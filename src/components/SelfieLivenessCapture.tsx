/**
 * SelfieLivenessCapture
 *
 * Install: npm install @mediapipe/tasks-vision
 *
 * A self-contained React component that:
 *  - Opens the front camera (no file-upload path)
 *  - Runs MediaPipe FaceDetector in VIDEO mode via requestAnimationFrame
 *  - Gates the Capture button behind: face count, size, centering & brightness checks
 *  - Exports a square centre-cropped JPEG File and calls onCaptured(file)
 *  - Cleans up stream + detector on unmount
 *
 * All processing is client-side — zero backend calls.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

// ─────────────────────────────────────────────────────────── types ───────────

export interface SelfieLivenessCaptureProps {
    /** Called with the captured JPEG File (e.g. selfie_<timestamp>.jpg). */
    onCaptured: (file: File) => void;
    /** Called when the user clicks "Skip" after face detection fails for too long. */
    onSkip?: () => void;
    /** Label for the skip button. Default: "Skip for Now →" */
    skipLabel?: string;
    /** Called on camera permission errors, model-load errors, or export failures. */
    onError?: (message: string) => void;
    /**
     * Face bounding-box area must be at least this fraction of the total frame area.
     * Keeps users from being too far away. Default: 0.10
     */
    minFaceAreaRatio?: number;
    /**
     * Average frame brightness (0–255) below which capture is blocked.
     * Default: 70
     */
    minBrightness?: number;
    /**
     * Maximum allowed deviation of the face centre from the frame centre, as a
     * fraction of width/height (0–1). Default: 0.18
     */
    centerTolerance?: number;
}

type CaptureStatus =
    | 'idle'
    | 'model-loading'
    | 'camera-loading'
    | 'no-face'
    | 'multiple-faces'
    | 'too-small'
    | 'off-center'
    | 'too-dark'
    | 'ready';

// ─────────────────────────────────────────────────────────── constants ────────

/** MediaPipe Tasks Vision WASM runtime (CDN — no local copy needed). */
const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

/** BlazeFace short-range TFLite model (Google-hosted). */
const MODEL_CDN =
    'https://storage.googleapis.com/mediapipe-models/face_detector/' +
    'blaze_face_short_range/float16/1/blaze_face_short_range.tflite';

const LABEL: Record<CaptureStatus, string> = {
    idle: 'Press "Start Camera" to begin',
    'model-loading': 'Loading face detection model…',
    'camera-loading': 'Starting camera…',
    'no-face': 'No face detected',
    'multiple-faces': 'Multiple faces — stay alone in frame',
    'too-small': 'Move closer',
    'off-center': 'Center your face in the oval',
    'too-dark': 'Too dark — improve your lighting',
    ready: '✓ Ready to capture',
};

const BADGE_COLOR: Record<CaptureStatus, string> = {
    idle: '#9ca3af',
    'model-loading': '#F5A800',
    'camera-loading': '#F5A800',
    'no-face': '#ef4444',
    'multiple-faces': '#ef4444',
    'too-small': '#f97316',
    'off-center': '#f97316',
    'too-dark': '#f97316',
    ready: '#22c55e',
};

// ─────────────────────────────────────────────────────────── helpers ──────────

/**
 * Measure average luminance by drawing the video into a tiny 32×32 canvas.
 * Returns a value in [0, 255].
 */
function sampleBrightness(video: HTMLVideoElement): number {
    const W = 32, H = 32;
    const cvs = document.createElement('canvas');
    cvs.width = W;
    cvs.height = H;
    const ctx = cvs.getContext('2d');
    if (!ctx) return 255; // assume bright if canvas unavailable
    ctx.drawImage(video, 0, 0, W, H);
    const { data } = ctx.getImageData(0, 0, W, H);
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
        // ITU-R BT.601 luma formula
        sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    return sum / (W * H);
}

// ─────────────────────────────────────────────────────────── component ────────

export default function SelfieLivenessCapture({
    onCaptured,
    onSkip,
    skipLabel = 'Skip for Now →',
    onError,
    minFaceAreaRatio = 0.10,
    minBrightness = 70,
    centerTolerance = 0.18,
}: SelfieLivenessCaptureProps) {

    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const detectorRef = useRef<FaceDetector | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rafRef = useRef<number>(0);
    const modelReadyRef = useRef(false); // ref so the RAF loop sees updates instantly

    const [cameraOn, setCameraOn] = useState(false);
    const [status, setStatus] = useState<CaptureStatus>('camera-loading');
    const [capturing, setCapturing] = useState(false);
    const [showSkip, setShowSkip] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const facingModeRef = useRef<'user' | 'environment'>('user'); // stable ref for callbacks
    const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef(true);

    // ── 1. Load MediaPipe model on mount ─────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
                const detector = await FaceDetector.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: MODEL_CDN,
                        delegate: 'GPU', // gracefully falls back to CPU
                    },
                    runningMode: 'VIDEO',
                    minDetectionConfidence: 0.5,
                    minSuppressionThreshold: 0.3,
                });

                if (cancelled) {
                    detector.close?.();
                    return;
                }

                detectorRef.current = detector;
                modelReadyRef.current = true;

                // If the camera was started before the model finished loading,
                // bump status away from 'model-loading'.
                setStatus(prev =>
                    prev === 'model-loading' ? 'no-face' : prev
                );
            } catch (err) {
                if (cancelled) return;
                const msg = `Face-detection model failed to load: ${(err as Error).message}`;
                setStatus('idle');
                onError?.(msg);
            }
        })();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once; onError is stable enough not to add as dep

    // ── 2. Start camera (front or back) ──────────────────────────────────────
    const startCamera = useCallback(async (requestedFacing?: 'user' | 'environment') => {
        const facing = requestedFacing ?? facingModeRef.current;
        setStatus('camera-loading');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facing,
                    width: { ideal: 640 },
                    height: { ideal: 640 },
                },
                audio: false,
            });

            // Component unmounted while waiting for getUserMedia — stop tracks and bail
            if (!mountedRef.current) {
                stream.getTracks().forEach(t => t.stop());
                return;
            }

            streamRef.current = stream;
            facingModeRef.current = facing;
            setFacingMode(facing);

            const video = videoRef.current;
            if (video) {
                video.srcObject = stream;
                try {
                    await video.play();
                } catch (playErr) {
                    // play() was interrupted because the element was removed from the DOM
                    // (e.g. React Strict Mode remount or user closed the dialog). Not a
                    // real camera error — just bail silently.
                    if ((playErr as DOMException).name === 'AbortError') {
                        return;
                    }
                    throw playErr;
                }
            }

            if (!mountedRef.current) return;

            setCameraOn(true);
            setStatus(modelReadyRef.current ? 'no-face' : 'model-loading');
        } catch (err) {
            if (!mountedRef.current) return;
            setStatus('idle');
            onError?.(`Camera access denied: ${(err as Error).message}`);
        }
    }, [onError]);

    // ── 2a. Auto-start camera on mount ───────────────────────────────────────
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { void startCamera(); }, []);

    // ── 2c. Camera switch ─────────────────────────────────────────────────────
    const switchCamera = useCallback(async () => {
        const next: 'user' | 'environment' = facingModeRef.current === 'user' ? 'environment' : 'user';
        cancelAnimationFrame(rafRef.current);
        setCameraOn(false);
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        await startCamera(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startCamera]);

    // ── 2b. Show "Skip" button after 5 seconds unconditionally ────────────
    useEffect(() => {
        if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
        skipTimerRef.current = setTimeout(() => {
            if (mountedRef.current) setShowSkip(true);
        }, 5000);
        return () => {
            if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── 3. Real-time face detection loop ─────────────────────────────────────
    useEffect(() => {
        if (!cameraOn) return;

        const video = videoRef.current;
        if (!video) return;

        let lastTimestamp = -1;

        const tick = () => {
            rafRef.current = requestAnimationFrame(tick);

            // Video stream not ready yet
            if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
                setStatus('camera-loading');
                return;
            }

            // Model still downloading
            if (!modelReadyRef.current || !detectorRef.current) {
                setStatus('model-loading');
                return;
            }

            const now = performance.now();
            if (now === lastTimestamp) return; // same decoded frame — skip
            lastTimestamp = now;

            // ── a) Brightness gate ────────────────────────────────────────────
            if (sampleBrightness(video) < minBrightness) {
                setStatus('too-dark');
                return;
            }

            // ── b) Face detection ─────────────────────────────────────────────
            let detections: ReturnType<FaceDetector['detectForVideo']>['detections'];
            try {
                detections = detectorRef.current.detectForVideo(video, now).detections;
            } catch {
                return; // transient error (e.g. frame decode in progress) — skip frame
            }

            if (detections.length === 0) { setStatus('no-face'); return; }
            if (detections.length > 1) { setStatus('multiple-faces'); return; }

            const bb = detections[0].boundingBox;
            if (!bb) { setStatus('no-face'); return; }

            const vw = video.videoWidth || 640;
            const vh = video.videoHeight || 640;

            // ── c) Size gate ──────────────────────────────────────────────────
            const areaRatio = (bb.width * bb.height) / (vw * vh);
            if (areaRatio < minFaceAreaRatio) {
                setStatus('too-small');
                return;
            }

            // ── d) Centre gate ────────────────────────────────────────────────
            // Note: video is CSS-mirrored but MediaPipe sees the raw stream,
            // so we compare against 0.5 without inverting.
            const cx = (bb.originX + bb.width / 2) / vw;
            const cy = (bb.originY + bb.height / 2) / vh;
            if (
                Math.abs(cx - 0.5) > centerTolerance ||
                Math.abs(cy - 0.5) > centerTolerance
            ) {
                setStatus('off-center');
                return;
            }

            setStatus('ready');
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [cameraOn, minFaceAreaRatio, minBrightness, centerTolerance]);

    // ── 4. Cleanup on unmount ─────────────────────────────────────────────────
    useEffect(() => {
        mountedRef.current = true; // reset on remount (React Strict Mode)
        return () => {
            mountedRef.current = false;
            cancelAnimationFrame(rafRef.current);
            streamRef.current?.getTracks().forEach(t => t.stop());
            detectorRef.current?.close?.();
        };
    }, []);

    // ── 5. Capture ────────────────────────────────────────────────────────────
    const handleCapture = useCallback(() => {
        if (status !== 'ready' || capturing) return;

        const video = videoRef.current;
        if (!video) return;

        setCapturing(true);

        // Square centre-crop from the raw (unmirrored) stream
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const side = Math.min(vw, vh);
        const sx = (vw - side) / 2;
        const sy = (vh - side) / 2;

        const cvs = document.createElement('canvas');
        cvs.width = side;
        cvs.height = side;
        cvs.getContext('2d')!.drawImage(video, sx, sy, side, side, 0, 0, side, side);

        cvs.toBlob(
            (blob) => {
                setCapturing(false);
                if (!blob) {
                    onError?.('Image export failed — please try again.');
                    return;
                }
                const file = new File(
                    [blob],
                    `selfie_${Date.now()}.jpg`,
                    { type: 'image/jpeg' },
                );
                onCaptured(file);
            },
            'image/jpeg',
            0.9,
        );
    }, [status, capturing, onCaptured, onError]);

    // ── Derived ───────────────────────────────────────────────────────────────
    const isReady = status === 'ready';
    const ovalColor = BADGE_COLOR[status];
    const isLoading = status === 'model-loading' || status === 'camera-loading';

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 16,
            userSelect: 'none', fontFamily: 'inherit',
        }}>

            {/* ── Video frame ─────────────────────────────────────────────── */}
            <div style={{
                position: 'relative',
                width: '100%', maxWidth: 320,
                aspectRatio: '1 / 1',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#0d0d0d',
                boxShadow: `0 0 0 2px ${ovalColor}55, 0 8px 32px rgba(0,0,0,0.45)`,
                transition: 'box-shadow 0.35s ease',
            }}>
                {/* Live video — CSS-mirrored for front camera selfie UX.
                    Detection runs on the raw (unmirrored) stream. */}
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    autoPlay
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                        opacity: cameraOn ? 1 : 0,
                        transition: 'opacity 0.4s',
                    }}
                />

                {/* ── Oval face-guide SVG overlay ──────────────────────────── */}
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        pointerEvents: 'none',
                    }}
                >
                    <defs>
                        {/* Mask cuts the oval "window" out of the dark overlay */}
                        <mask id="slc-face-mask">
                            <rect width="100" height="100" fill="white" />
                            <ellipse cx="50" cy="50" rx="30" ry="38" fill="black" />
                        </mask>
                    </defs>

                    {/* Dark vignette outside the oval */}
                    <rect
                        width="100" height="100"
                        fill="rgba(0,0,0,0.52)"
                        mask="url(#slc-face-mask)"
                    />

                    {/* Dashed oval border — colour reflects current status */}
                    <ellipse
                        cx="50" cy="50" rx="30" ry="38"
                        fill="none"
                        stroke={ovalColor}
                        strokeWidth="1.2"
                        strokeDasharray="3.5 2"
                        style={{ transition: 'stroke 0.3s ease' }}
                    />

                    {/* Cardinal tick marks (top / right / bottom / left) */}
                    {([
                        [50, 12, 50, 7],   // top
                        [80, 50, 85, 50],   // right
                        [50, 88, 50, 93],   // bottom
                        [20, 50, 15, 50],   // left
                    ] as [number, number, number, number][]).map(([x1, y1, x2, y2], i) => (
                        <line
                            key={i}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={ovalColor}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            style={{ transition: 'stroke 0.3s ease' }}
                        />
                    ))}
                </svg>

                {/* ── Status badge ─────────────────────────────────────────── */}
                <div style={{
                    position: 'absolute', bottom: 10, left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.68)',
                    backdropFilter: 'blur(8px)',
                    color: ovalColor,
                    fontSize: 11, fontWeight: 700,
                    borderRadius: 20,
                    padding: '4px 14px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.25px',
                    border: `1px solid ${ovalColor}44`,
                    transition: 'color 0.3s, border-color 0.3s',
                    pointerEvents: 'none',
                }}>
                    {isLoading && (
                        <span style={{
                            display: 'inline-block',
                            width: 8, height: 8,
                            borderRadius: '50%',
                            background: ovalColor,
                            marginRight: 6,
                            animation: 'slc-pulse 1s ease-in-out infinite',
                        }} />
                    )}
                    {LABEL[status]}
                </div>
            </div>

            {/* ── Pulse animation keyframes ────────────────────────────────── */}
            <style>{`
                @keyframes slc-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.4; transform: scale(0.7); }
                }
            `}</style>

            {/* ── Camera switch button ─────────────────────────────────────── */}
            {cameraOn && (
                <button
                    onClick={switchCamera}
                    title={facingMode === 'user' ? 'Switch to back camera' : 'Switch to front camera'}
                    style={{
                        width: 260,
                        padding: '11px 0',
                        borderRadius: 28,
                        background: 'rgba(255,255,255,0.08)',
                        color: '#F5A800',
                        fontWeight: 700,
                        fontSize: 14,
                        border: '1px solid rgba(245,168,0,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                    }}
                >
                    🔄 {facingMode === 'user' ? t('forms.aspirant.livePhoto.backCamera', { defaultValue: 'Back Camera' }) : t('forms.aspirant.livePhoto.frontCamera', { defaultValue: 'Front Camera' })}
                </button>
            )}

            {/* ── Capture button ───────────────────────────────────────────── */}
            <button
                onClick={handleCapture}
                disabled={!isReady || capturing}
                style={{
                    width: 260,
                    padding: '11px 0',
                    borderRadius: 28,
                    background: isReady
                        ? 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)'
                        : 'rgba(255,255,255,0.07)',
                    color: isReady ? '#fff' : '#555',
                    fontWeight: 700,
                    fontSize: 14,
                    border: `1px solid ${isReady ? '#22c55e55' : '#ffffff14'}`,
                    cursor: isReady && !capturing ? 'pointer' : 'not-allowed',
                    boxShadow: isReady ? '0 4px 20px rgba(34,197,94,0.45)' : 'none',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.3px',
                }}
            >
                {capturing ? `⏳ ${t('forms.aspirant.livePhoto.capturing', { defaultValue: 'Capturing…' })}` : `📸 ${t('forms.aspirant.livePhoto.captureSelfie', { defaultValue: 'Capture Selfie' })}`}
            </button>

            {/* ── Skip button — appears after 5s if face not detected ──────── */}
            {showSkip && onSkip && (
                <button
                    onClick={onSkip}
                    style={{
                        padding: '9px 32px',
                        borderRadius: 28,
                        background: 'rgba(255,255,255,0.08)',
                        color: '#F5A800',
                        fontWeight: 700,
                        fontSize: 13,
                        border: '1px solid rgba(245,168,0,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.3px',
                    }}
                >
                    {skipLabel}
                </button>
            )}
        </div>
    );
}

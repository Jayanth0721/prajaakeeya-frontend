import { useEffect } from 'react';
import './Preloader.css';

/**
 * Call this when your app is ready to dismiss the preloader.
 * Usage in App.tsx:
 *
 *   import { dismissPreloader } from './components/Preloader';
 *
 *   useEffect(() => {
 *     // Option A — dismiss after animation completes (~5 s)
 *     const t = setTimeout(dismissPreloader, 5000);
 *     return () => clearTimeout(t);
 *
 *     // Option B — dismiss once your data / auth check finishes
 *     // dismissPreloader();
 *   }, []);
 */
export function dismissPreloader(): void {
    const el = document.getElementById('preloader');
    if (!el) return;
    el.classList.add('exit');
    setTimeout(() => el.remove(), 750);
}

/**
 * Mount this component near the top of your app tree.
 * It generates the floating particles inside the preloader
 * that already exists in index.html.
 *
 * Returns null — all visible HTML is in index.html.
 */
export default function Preloader(): null {
    useEffect(() => {
        // Skip preloader in React Native WebView — the native app has its own splash screen
        if (/ReactNative/i.test(navigator.userAgent)) {
            const el = document.getElementById('preloader');
            if (el) el.remove();
            return;
        }

        const container = document.getElementById('pl-particles');
        if (!container || container.childElementCount > 0) return;

        const COLORS = ['#C8180A', '#F5A800', '#FFCB00', '#FFD740', '#E02010'];

        for (let i = 0; i < 32; i++) {
            const d = document.createElement('div');
            d.className = 'pl-particle';
            const sz = 1 + Math.random() * 2;

            d.style.cssText = [
                `left:${(Math.random() * 100).toFixed(1)}%`,
                'bottom:-4px',
                `width:${sz.toFixed(1)}px`,
                `height:${sz.toFixed(1)}px`,
                `background:${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
                `opacity:${(0.15 + Math.random() * 0.3).toFixed(2)}`,
                `animation-duration:${(9 + Math.random() * 14).toFixed(1)}s`,
                `animation-delay:${(Math.random() * 8).toFixed(1)}s`,
            ].join(';');

            // CSS custom property for horizontal drift — must use setProperty
            d.style.setProperty('--dx', `${((Math.random() - 0.5) * 100).toFixed(0)}px`);

            container.appendChild(d);
        }
    }, []);

    return null;
}

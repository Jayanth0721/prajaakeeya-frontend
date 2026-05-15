export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const isFileSizeValid = (file: File | null | undefined, maxBytes = MAX_UPLOAD_SIZE_BYTES): boolean => {
  if (!file) return false;
  return file.size <= maxBytes;
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const loadImageBitmap = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to <img> path (Safari/HEIC etc.)
    }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));

export interface CompressImageOptions {
  maxBytes?: number;
  maxDimension?: number;
  mimeType?: string;
  minQuality?: number;
}

export const compressImage = async (file: File, options: CompressImageOptions = {}): Promise<File> => {
  const {
    maxBytes = 100 * 1024,
    maxDimension = 1024,
    mimeType = 'image/jpeg',
    minQuality = 0.4
  } = options;

  if (!file.type.startsWith('image/') || file.size <= maxBytes) return file;

  let bitmap: ImageBitmap | HTMLImageElement;
  try {
    bitmap = await loadImageBitmap(file);
  } catch {
    return file;
  }

  const srcW = (bitmap as ImageBitmap).width ?? (bitmap as HTMLImageElement).naturalWidth;
  const srcH = (bitmap as ImageBitmap).height ?? (bitmap as HTMLImageElement).naturalHeight;
  if (!srcW || !srcH) return file;

  let dimension = Math.min(maxDimension, Math.max(srcW, srcH));
  let best: Blob | null = null;

  while (dimension >= 256) {
    const scale = dimension / Math.max(srcW, srcH);
    const w = Math.round(srcW * scale);
    const h = Math.round(srcH * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, w, h);

    for (let q = 0.9; q >= minQuality - 0.001; q -= 0.1) {
      const blob = await canvasToBlob(canvas, mimeType, q);
      if (!blob) continue;
      if (!best || blob.size < best.size) best = blob;
      if (blob.size <= maxBytes) {
        const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
        return new File([blob], name, { type: mimeType, lastModified: Date.now() });
      }
    }
    dimension = Math.round(dimension * 0.75);
  }

  if (best && best.size < file.size) {
    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([best], name, { type: mimeType, lastModified: Date.now() });
  }
  return file;
};

export default { MAX_UPLOAD_SIZE_BYTES, isFileSizeValid, formatBytes, compressImage };

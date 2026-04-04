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

export default { MAX_UPLOAD_SIZE_BYTES, isFileSizeValid, formatBytes };

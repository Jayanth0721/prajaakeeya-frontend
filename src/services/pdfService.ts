import apiClient from './apiClient';

export const uploadWardPdfs = (wardId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return apiClient.post(`/wards/${wardId}/upload-pdfs`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const triggerExtraction = (wardId: number) => apiClient.post(`/extract/${wardId}`);
export const getExtractionStatus = () => apiClient.get('/admin/dashboard');

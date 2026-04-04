import apiClient from './apiClient';

export const uploadWardVotersExcel = (wardId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post(`/voters/ward/${wardId}/upload-excel`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const fetchWardVoterCounts = () => apiClient.get('/voters/ward');

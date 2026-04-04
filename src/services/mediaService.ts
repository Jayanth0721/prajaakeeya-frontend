import apiClient from './apiClient';

export interface AdminDocument {
  id: number;
  createdAt: string;
  updatedAt: string;
  documentType: string;
  documentUrl: string;
  version?: string;
  description?: string;
  isActive?: boolean;
}

export const getAdminDocuments = async () => {
  const { data } = await apiClient.get<AdminDocument[]>('/media/admin/documents');
  return data;
};

export default { getAdminDocuments };

export const uploadAspirantDocument = async (aspirantId: number, documentType: string, file: File) => {
  const form = new FormData();
  form.append('documentType', documentType);
  form.append('file', file, file.name);
  // Let axios set the Content-Type (including boundary) for FormData automatically.
  const { data } = await apiClient.post(`/media/aspirant/${aspirantId}/document`, form, { timeout: 60000 });
  return data;
};

export const uploadProfilePicture = async (file: File) => {
  const form = new FormData();
  form.append('file', file, file.name);
  const { data } = await apiClient.post('/media/profile-picture', form, { timeout: 60000 });
  return data;
};

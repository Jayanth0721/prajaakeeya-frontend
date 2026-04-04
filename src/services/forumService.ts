import apiClient from './apiClient';
import { AuthUser } from '../types/auth';

export interface ForumMessageDto {
  id: number;
  content: string;
  userId: number;
  wardId: number;
  createdAt: string;
  updatedAt: string;
  user?: AuthUser | { id: number; name?: string; role?: 'admin' | 'voter' | 'aspirant' };
}

export const getWardMessages = (wardId: number, page = 1, limit = 50) =>
  apiClient.get<{ data: ForumMessageDto[]; meta: any }>(`/forum/ward/${wardId}/messages`, {
    params: { page, limit }
  });

export const postWardMessage = (wardId: number, payload: { content: string }) =>
  apiClient.post<ForumMessageDto>(`/forum/ward/${wardId}/messages`, payload);

export const deleteMessage = (messageId: number) =>
  apiClient.delete(`/forum/messages/${messageId}`);

const forumService = { getWardMessages, postWardMessage, deleteMessage };

export default forumService;

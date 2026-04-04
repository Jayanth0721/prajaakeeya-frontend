import apiClient from './apiClient';
import { AuthUser } from '../types/auth';

export interface AspirantChatMessageDto {
  id: number;
  content: string;
  userId: number;
  aspirantId: number;
  createdAt: string;
  updatedAt: string;
  user?: AuthUser | { id: number; name?: string; role?: 'admin' | 'voter' | 'aspirant' };
  aspirant?: { id: number; name?: string; party?: string };
  ward?: { id: number; number?: string; name?: string };
}

export const getAspirantMessages = (aspirantId: number, page = 1, limit = 50) =>
  apiClient.get<{ data: AspirantChatMessageDto[]; meta: any }>(`/aspirants/${aspirantId}/chat/messages`, {
    params: { page, limit }
  });

export const getWardMessages = (wardNumber: string | number, page = 1, limit = 50) =>
  apiClient.get<{ data: AspirantChatMessageDto[]; meta: any }>(`/aspirant-discussion/ward/${wardNumber}/messages`, {
    params: { page, limit }
  });

export const deleteAspirantMessage = (messageId: number) =>
  apiClient.delete<{ message: string }>(`/aspirant-discussion/messages/${messageId}`);

export const postAspirantMessage = (aspirantId: number, payload: { content: string }) =>
  // Use aspirant-discussion endpoint for aspirant-originated messages
  apiClient.post<AspirantChatMessageDto>(`/aspirant-discussion/aspirant/${aspirantId}/messages`, payload);

// For regular users posting to an aspirant's public chat room use the aspirant chat endpoint
export const postUserChatMessage = (aspirantId: number, payload: { content: string }) =>
  apiClient.post<AspirantChatMessageDto>(`/aspirants/${aspirantId}/chat/messages`, payload);

export default { getAspirantMessages, getWardMessages, postAspirantMessage, deleteAspirantMessage };

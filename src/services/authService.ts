import apiClient from './apiClient';
import { AuthUser } from '../types/auth';

export interface EpicLoginPayload {
  epicId: string;
}

export interface RegisterOtpPayload {
  email: string;
}

export interface VerifyRegisterOtpPayload {
  email: string;
  otp: string;
  verificationId?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  verificationId?: string;
}

export interface AdminLoginPayload {
  phone: string;
}

export interface AspirantSendOtpPayload {
  mobileNumber: string;
}

export interface AspirantVerifyOtpPayload {
  mobileNumber: string;
  verificationId: string;
  code: string;
}

export interface AdminVerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface RegisterVoterPayload {
  name: string;
  idToken: string;
  phone?: string;
  relativeName?: string;
  epicId?: string;
  gender?: string;
}

export interface RegisterVoterResponse {
  token?: string;
  user: AuthUser;
  ward?: { id: number; name: string };
}

export const loginWithEpic = async (payload: EpicLoginPayload) => {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/login', payload);
  return data;
};

export const loginWithGoogle = async (idToken: string) => {
  const endpoints = ['/auth/google/login'];
  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      const { data } = await apiClient.post<{ token: string; user: AuthUser }>(endpoint, { idToken });
      return data;
    } catch (err: any) {
      lastError = err;
      if (err?.response?.status !== 404) {
        throw err;
      }
    }
  }

  throw lastError;
};

export const loginWithApple = async (idToken: string) => {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/apple/login', { idToken });
  return data;
};

export const requestAdminOtp = (payload: AdminLoginPayload) => apiClient.post('/auth/admin/login', payload);

export const requestRegisterOtp = (payload: RegisterOtpPayload) =>
  apiClient.post<{ message: string; verificationId?: string }>('/auth/register/request-otp', payload);

export const verifyRegisterOtp = (payload: VerifyRegisterOtpPayload) =>
  apiClient.post('/auth/register/verify-otp', payload);

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/verify-otp', payload);
  return data;
};

export const sendAspirantOtp = async (payload: AspirantSendOtpPayload) => {
  const { data } = await apiClient.post<{ message: string; verificationId: string }>('/auth/aspirant/send-otp', payload);
  return data;
};

export const verifyAspirantLoginOtp = async (payload: AspirantVerifyOtpPayload) => {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/aspirant/verify-otp', payload);
  return data;
};

export const resendAspirantOtp = async (payload: AspirantSendOtpPayload) => {
  const { data } = await apiClient.post<{ message: string; verificationId: string }>('/auth/aspirant/resend-otp', payload);
  return data;
};

export const verifyAdminOtp = async (payload: AdminVerifyOtpPayload) => {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/admin/verify-otp', payload);
  return data;
};

export const adminLoginWithPassword = async (payload: { email: string; password: string }) => {
  const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/auth/admin/login', payload);
  return data;
};

export const fetchProfile = () => apiClient.get<AuthUser>('/auth/me');

export const registerVoter = async (payload: RegisterVoterPayload) => {
  const { data } = await apiClient.post<RegisterVoterResponse>('/auth/register-voter', payload);
  return data;
};

export interface RegisterVoterByEpicPayload {
  epicNumber: string;
  confirm?: boolean;
  email?: string;
}

// Flexible helper for the two-step EPIC flow used by the UI.
export const registerVoterByEpic = async (payload: RegisterVoterByEpicPayload) => {
  const { data } = await apiClient.post<any>('/auth/register-voter', payload);
  return data;
};

export interface UpdateProfilePayload {
  name?: string;
  age?: number;
  gender?: string;
  phone?: string;
  epicId?: string;
  address?: string;
  wardNumber?: string;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await apiClient.put<AuthUser>('/auth/profile', payload);
  return data;
};

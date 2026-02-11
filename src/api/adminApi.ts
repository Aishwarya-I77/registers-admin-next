import axiosInstance from './axiosConfig';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  UserFilters,
} from '../types/user.types';
import { ApiResponse, PaginatedResponse } from '../types/common.types';
import { FormHistory } from '../types/analytics.types';
import { UserStatusSummaryDto } from '../types/analytics.types';

/* =========================
   AUTH TYPES
========================= */
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    email: string;
    userId: number;
    name: string;
    role?: string;
    tokenType?: string;
  };
  timestamp: string;
}

/* =========================
   ADMIN API
========================= */
export const adminApi = {
  /* ---------- AUTH ---------- */
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // ✅ Verify token
  verifyToken: async () => {
    const response = await axiosInstance.get<ApiResponse<{ valid: boolean }>>('/auth/verify');
    return response.data;
  },

  /* ---------- USERS ---------- */

  // ✅ Get paginated users
  getAllUsers: async (filters: UserFilters) => {
    const params = new URLSearchParams();

    params.append('page', filters.page.toString());
    params.append('size', filters.size.toString());
    params.append('sortBy', filters.sortBy);
    params.append('sortDir', filters.sortDir);

    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined) {
      params.append('isActive', filters.isActive.toString());
    }

    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<User>>
    >(`/admin/users?${params.toString()}`);

    return response.data;
  },

  // ✅ Get single user by ID
  getUserById: async (id: number | string) => {
    const response = await axiosInstance.get<ApiResponse<User>>(
      `/admin/users/${id}`
    );
    return response.data;
  },

  // ✅ Create user
  createUser: async (data: CreateUserRequest) => {
    const response = await axiosInstance.post<ApiResponse<User>>(
      '/admin/users',
      data
    );
    return response.data;
  },

  // ✅ Update user
  updateUser: async (id: number, data: UpdateUserRequest) => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `/admin/users/${id}`,
      data
    );
    return response.data;
  },

  // ✅ Reset password
  resetPassword: async (id: number, data: ResetPasswordRequest) => {
    const response = await axiosInstance.patch<ApiResponse<void>>(
      `/admin/users/${id}/reset-password`,
      data
    );
    return response.data;
  },

  // ✅ Toggle active/inactive
  toggleActiveStatus: async (id: number) => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/admin/users/${id}/toggle-active`
    );
    return response.data;
  },

  // ✅ Delete user
  deleteUser: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<User>>(
      `/admin/users/${id}`
    );
    return response.data;
  },

  getUserFormHistory: async (
  userId: string | number,
  params?: {
    page?: number;
    size?: number;
  }
) => {
  const response = await axiosInstance.get(
    `/admin/analytics/users/${userId}/history`,
    { params }
  );

  return response.data;
},

// ✅ Get active / inactive / total users summary
getUserStatusSummary: async () => {
  const response = await axiosInstance.get<
    ApiResponse<UserStatusSummaryDto>
  >('/admin/users/status-summary');

  return response.data;
},

};





export {};

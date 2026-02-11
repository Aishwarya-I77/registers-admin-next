import { Role } from './common.types';

export interface User {
  id: number;
  name: string;
  email: string;
  designation: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  designation: string;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  designation?: string;
  role?: Role;
  isActive?: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}


export interface UserFilters {
  page: number;
  size: number;
  search?: string;
  role?: Role;
  isActive?: boolean;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export {};
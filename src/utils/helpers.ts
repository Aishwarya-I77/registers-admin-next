import dayjs from 'dayjs';
import { DATETIME_FORMAT } from './constants';

export const formatDate = (date: string | Date, format: string = DATETIME_FORMAT): string => {
  return dayjs(date).format(format);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getRoleColor = (role: string): string => {
  return role === 'ADMIN' ? 'red' : 'blue';
};

export const getStatusColor = (isActive: boolean): string => {
  return isActive ? 'green' : 'default';
};

export const handleError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export {};
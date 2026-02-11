import axiosInstance from './axiosConfig';
import {
  FormsSummary,
  MonthlyFormTrend,
  UserFormUsage,
  FormHistory,
  UserStatusSummary,
  AnalyticsFilters,
  
} from '../types/analytics.types';
import { ApiResponse, PaginatedResponse } from '../types/common.types';

export const analyticsApi = {
  getFormsSummary: async (filters?: AnalyticsFilters) => {
    const params = new URLSearchParams();
    if (filters?.period) params.append('period', filters.period);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await axiosInstance.get<ApiResponse<FormsSummary>>(
      `/admin/analytics/forms/summary?${params.toString()}`
    );
    return response.data;
  },

  getMonthlyTrends: async (months: number = 12) => {
    const response = await axiosInstance.get<ApiResponse<MonthlyFormTrend[]>>(
      `/admin/analytics/forms/monthly-trends?months=${months}`
    );
    return response.data;
  },

  getUserFormUsage: async (filters: AnalyticsFilters & { page: number; size: number }) => {
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('size', filters.size.toString());
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<UserFormUsage>>>(
      `/admin/analytics/users/form-usage?${params.toString()}`
    );
    return response.data;
  },

  getUserHistory: async (
    userId: number,
    formType?: string,
    filters?: AnalyticsFilters & { page: number; size: number }
  ) => {
    const params = new URLSearchParams();
    params.append('page', (filters?.page || 0).toString());
    params.append('size', (filters?.size || 10).toString());
    if (formType) params.append('formType', formType);
    if (filters?.period) params.append('period', filters.period);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<FormHistory>>>(
      `/admin/analytics/users/${userId}/history?${params.toString()}`
    );
    return response.data;
  },

  getUserStatusSummary: async () => {
    const response = await axiosInstance.get<ApiResponse<UserStatusSummary>>(
      '/admin/analytics/users/status-summary'
    );
    return response.data;
  },
  getFormTypeDistribution: async () => {
  const response = await axiosInstance.get<
    ApiResponse<{ formType: string; count: number }[]>
  >('/admin/analytics/forms/by-type');

  return response.data;
},
};



export {};
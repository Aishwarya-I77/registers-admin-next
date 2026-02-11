export interface FormsSummary {
  totalFormsGenerated: number;
  formsToday?: number;
  formsThisMonth?: number;
  periodStart?: string;
  periodEnd?: string;
  period?: string;
}

export interface UserStatusSummaryDto {
  totalActiveUsers: number;
  totalInactiveUsers: number;
  totalUsers: number;
}


export interface MonthlyFormTrend {
  month: string;
  count: number;
}

export interface UserFormUsage {
  userId: number;
  email: string;
  name: string;
  totalFormsGenerated: number;
}

export interface FormHistory {
  id: number;
  formType: string;
  fileName: string;
  generatedAt: string; // ✅ ADD THIS
}


export interface UserStatusSummary {
  totalActiveUsers: number;
  totalInactiveUsers: number;
  totalUsers: number;
}

export interface AnalyticsFilters {
  period?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface FormTypeDistributionDto {
  formType: string;
  count: number;
  percentage: number;
}

export interface FormTypeStat {
  type: string;
  count: number;
}


export {};
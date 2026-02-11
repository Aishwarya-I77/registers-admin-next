export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const PAGE_SIZES = [10, 20, 50, 100];

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const PERIOD_OPTIONS = [
  { label: 'All Time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom Range', value: 'custom' },
];

export const SORT_OPTIONS = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
];

export {};
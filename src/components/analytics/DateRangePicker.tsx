"use client";

import { DatePicker, Space, Select } from 'antd';
import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

interface DateRangePickerProps {
  period?: string;
  dateRange?: [Dayjs | null, Dayjs | null];
  onPeriodChange?: (value: string) => void;
  onDateRangeChange?: Dispatch<
    SetStateAction<[Dayjs | null, Dayjs | null]>
  >;
}

const DateRangePicker = ({
  period,
  dateRange,
  onPeriodChange,
  onDateRangeChange,
}: DateRangePickerProps) => {
  return (
    <Space>
      {onPeriodChange && (
        <Select
          value={period || 'all'}
          onChange={onPeriodChange}
          style={{ width: 120 }}
        >
          <Select.Option value="all">All Time</Select.Option>
          <Select.Option value="today">Today</Select.Option>
          <Select.Option value="week">This Week</Select.Option>
          <Select.Option value="month">This Month</Select.Option>
          <Select.Option value="custom">Custom Range</Select.Option>
        </Select>
      )}

      {period === 'custom' && onDateRangeChange && (
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (dates) {
              onDateRangeChange([
                dates[0] || null,
                dates[1] || null,
              ]);
            }
          }}
        />
      )}
    </Space>
  );
};

export default DateRangePicker;

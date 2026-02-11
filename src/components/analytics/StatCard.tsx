"use client";

import { Card, Statistic, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  color = '#1890ff',
  loading = false,
  trend,
}) => {
  if (loading) {
    return <Skeleton active />;
  }

  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{
          color: trend && trend > 0 ? '#3f8600' : trend && trend < 0 ? '#cf1322' : '#1890ff',
        }}
      />
      {trend && (
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          {trend > 0 ? (
            <span style={{ color: '#3f8600' }}>
              <ArrowUpOutlined /> {Math.abs(trend)}%
            </span>
          ) : (
            <span style={{ color: '#cf1322' }}>
              <ArrowDownOutlined /> {Math.abs(trend)}%
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default StatCard;

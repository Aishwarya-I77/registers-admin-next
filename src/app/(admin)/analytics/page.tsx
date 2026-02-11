// Analytics.tsx - Updated columns section
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Typography, Card, Table, message } from 'antd';
import { Dayjs } from 'dayjs';

import DateRangePicker from '@/components/analytics/DateRangePicker';
import { analyticsApi } from '@/api/analyticsApi';
import { UserFormUsage } from '@/types/analytics.types';
import { PaginatedResponse } from '@/types/common.types';

const { Title } = Typography;

const Analytics: React.FC = () => {
  const [userFormUsage, setUserFormUsage] =
    useState<PaginatedResponse<UserFormUsage>>({
      content: [],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,  
      last: false,
      first: true,
    });

  const [period, setPeriod] = useState<string>('all');
  const [dateRange, setDateRange] =
    useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const [loading, setLoading] = useState(false);

  const fetchUserFormUsage = useCallback(async () => {
    try {
      setLoading(true); 

      const filters: any = {
        page: userFormUsage?.pageNumber || 0,
        size: userFormUsage?.pageSize || 10,
        period,
      };

      if (period === 'custom' && dateRange[0] && dateRange[1]) {
        filters.startDate = dateRange[0].format('YYYY-MM-DDTHH:mm:ss');
        filters.endDate = dateRange[1].format('YYYY-MM-DDTHH:mm:ss');
      }

      const response = await analyticsApi.getUserFormUsage(filters);
      
      if (response && response.data) {
        setUserFormUsage(response.data);
      } else {
        console.warn('Invalid response format:', response);
        message.error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Failed to fetch user form usage:', error);
      message.error(error.response?.data?.message || 'Failed to fetch user form usage');
    } finally {
      setLoading(false);
    }
  }, [period, dateRange, userFormUsage?.pageNumber, userFormUsage?.pageSize]);

  useEffect(() => {
    fetchUserFormUsage();
  }, [fetchUserFormUsage]);

  const handlePageChange = (page: number, pageSize: number) => {
    setUserFormUsage(prev => ({
      ...prev,
      pageNumber: page - 1,
      pageSize,
    }));
  };

  // Custom header style
  const headerStyle = {
    fontWeight: 600,
    color: 'rgb(53, 89, 171)', // Change this to your desired color
    
  };

  return (
    <div style={{ padding: '0px' }}>
      {/* Header */}
      <Title level={4} style={{ marginTop: -15 }}>User Form Usage</Title>

      {/* Optional Date Filter */}
      <DateRangePicker
        period={period}
        dateRange={dateRange}
        onPeriodChange={setPeriod}
        onDateRangeChange={setDateRange}
      />

      {/* Table */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card styles={{ body: { padding: '16px 16px 0px 16px' } }}>
            <Table
             size="small"
              loading={loading}
              rowKey="userId"
              bordered
          rowClassName={(_, index) =>
            index % 2 === 0 ? 'user-row-even' : 'user-row-odd'
          }
              dataSource={userFormUsage.content}
              columns={[
                {
                  title: 'User Name',
                  dataIndex: 'name',
                  key: 'name',
                  onHeaderCell: () => ({ style: headerStyle }),
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email',
                  onHeaderCell: () => ({ style: headerStyle }),
                },
                {
                  title: 'Total Forms Generated',
                  dataIndex: 'totalFormsGenerated',
                  key: 'totalFormsGenerated',
                  align: 'right',
                  onHeaderCell: () => ({ style: headerStyle }),
                },
              ]}
              pagination={{
                current: userFormUsage.pageNumber + 1,
                pageSize: userFormUsage.pageSize,
                total: userFormUsage.totalElements,
                onChange: handlePageChange,
                style: { margin: '8px 8px' },
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;

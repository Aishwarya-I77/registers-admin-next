"use client";
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, message, Statistic } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Line } from '@ant-design/plots';
import { analyticsApi } from '@/api/analyticsApi';
import {
  FormsSummary,
  MonthlyFormTrend,
  UserStatusSummary,
} from '@/types/analytics.types';
import {
  FileTextOutlined,
  CalendarOutlined,
  BarChartOutlined,
  RiseOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

type FormTypeStat = {
  type: string;
  count: number;
};

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
  const [formsSummary, setFormsSummary] = useState<FormsSummary | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyFormTrend[]>([]);
  const [formTypeStats, setFormTypeStats] = useState<FormTypeStat[]>([]);
  const [userStatusSummary, setUserStatusSummary] =
    useState<UserStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, trendsRes, userStatusRes] = await Promise.all([
          analyticsApi.getFormsSummary({ period: 'all' }),
          analyticsApi.getMonthlyTrends(12),
          analyticsApi.getUserStatusSummary(),
        ]);

        setFormsSummary(summaryRes.data);
        setMonthlyTrends(trendsRes.data);
        setUserStatusSummary(userStatusRes.data);

        const formTypeRes = await analyticsApi.getFormTypeDistribution();
        setFormTypeStats(
          (formTypeRes.data ?? []).slice(0, 5).map((item: { formType: string; count: number }) => ({
  type: item.formType,
  count: item.count,
}))

        );
      } catch {
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const lineChartData = [...monthlyTrends]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map((item) => {
      const [year, month] = item.month.split('-');
      const date = new Date(Number(year), Number(month) - 1);

      return {
        month: date.toLocaleString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        value: item.count,
      };
    });

  const monthlyLineConfig = {
    data: lineChartData,
    xField: 'month',
    yField: 'value',
    height: 130,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#4f46e5',
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 3,
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    
    color: '#4f46e5',
    axis: {
      x: {
        title: false,
        line: true,
        tick: true,
        label: {
          style: {
            fontSize: 11,
            fill: '#64748b',
          },
        },
      },
      y: {
        title: false,
        grid: true,
        label: {
          style: {
            fontSize: 11,
            fill: '#64748b',
            
          },
        },
      },
    },
  };

  return (
  
   <div style={{ padding: 0, height: '100%', overflow: 'hidden' }}>
  {/* Header Section */}
  <div style={{ marginBottom: 4 }}>
    <Title
      level={4}
      style={{
        marginTop: -15,
        marginBottom: 2,
        color: '#1e293b',
        
      }}
    >
      Dashboard Overview
    </Title>

    <Text type="secondary" >
      Real-time analytics and system monitoring
    </Text>
  </div>


      {/* Summary Stats Cards */}
      <Row gutter={[15, 15]} style={{ marginBottom: 15 }}>
  {[
    {
      label: 'Total Forms Generated',
      value: formsSummary?.totalFormsGenerated ?? 0,
      color: '#667eea',
      bgColor: '#eef2ff',
      icon: <FileTextOutlined />,
      prefix: null,
    },
    {
      label: 'Forms Generated Today',
      value: formsSummary?.formsToday ?? 0,
      color: '#10b981',
      bgColor: '#ecfdf5',
      icon: <CalendarOutlined />,
      // prefix: <RiseOutlined />,
    },
    {
      label: 'Forms This Month',
      value: formsSummary?.formsThisMonth ?? 0,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      icon: <BarChartOutlined />,
      prefix: null,
    },
  ].map((item, idx) => (
    <Col
      xl={8}
      lg={12}
      md={24}
      sm={24}
      xs={24}
      key={idx}
    >
      <Card
        hoverable
        loading={loading}
        style={{
          height: 86,
          borderRadius: 12,
          border: 'none',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
        styles={{
          body: { padding: 12 },
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <Text
              type="secondary"
              style={{
                fontSize: 10,
                display: 'block',
                marginBottom: 4,
              }}
            >
              {item.label}
            </Text>

            <Statistic
              value={item.value}
              prefix={item.prefix}
              styles={{
                content: {
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1e293b',
                },
              }}
            />
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: item.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color,
              fontSize: 18,
            }}
          >
            {item.icon}
          </div>
        </div>
      </Card>
    </Col>
  ))}
</Row>



      {/* Charts Section */}
      <Row gutter={[15, 15]} style={{ marginBottom: 15 }}>
        {/* Monthly Trends - 70% width */}
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card
            title={
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                Monthly Trends
              </span>
            }
            loading={loading}
            style={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              height: '100%',
            }}
             styles={{
    body: {
      padding: 10,
    },
  }}
          >
            <Line {...monthlyLineConfig} />
          </Card>
        </Col>

        {/* Form Distribution - 30% width */}
        
        <Col xl={12} lg={10} md={24} sm={24} xs={24}>
          <Card
            title={
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                Form Distribution
              </span>
            }
            loading={loading}
            style={{
              borderRadius: 20,
              border: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              height: '100%',
            }}
            styles={{ body: { padding: 6 } }}
          >
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={formTypeStats}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="55%"
                  outerRadius={60}
                label={({ cx, cy, midAngle, outerRadius, percent , fill}) => {
                      if (
                        percent === undefined ||
                        percent === 0 ||
                        midAngle === undefined ||
                        cx === undefined ||
                        cy === undefined ||
                        outerRadius === undefined
                      ) {
                        return null;
                      }

                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + (percent > 0.35 ? 4 : 12);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN) -6; // ⬅ adjust vertical position here

                      return (
                        <text
                          x={x}
                          y={y}
                          fill={fill}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={12}
                          fontWeight={600}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}


                  labelLine={false}  
                >
                  {formTypeStats.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <ReTooltip
                  formatter={(value?: number) =>
                    value ? value.toLocaleString() : '0'
                  }
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 8 }}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* User Status Cards - Compact Design */}
      <Row gutter={[15,15]}>
        {[
          {
            title: 'Active Users',
            value: userStatusSummary?.totalActiveUsers || 0,
            total: userStatusSummary?.totalUsers || 0,
            color: '#1890ff',
            icon: <UserOutlined />,
            bgLight: '#ecfdf5',
          },
          {
            title: 'Inactive Users',
            value: userStatusSummary?.totalInactiveUsers || 0,
            total: userStatusSummary?.totalUsers || 0,
            color: '#1890ff',
            icon: <UserOutlined />,
            bgLight: '#fef2f2',
          },
          {
            title: 'Total Users',
            value: userStatusSummary?.totalUsers || 0,
            total: userStatusSummary?.totalUsers || 0,
            color: '#1890ff',
            icon: <TeamOutlined />,
            bgLight: '#eef2ff',
          },
        ].map((item, idx) => {
          const percentage =
            item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;

          return (
            <Col xl={8} lg={8} md={24} sm={24} xs={24} key={idx}>
              <Card
                style={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                  height: 110,

                }}
               styles={{ body: { padding: 10 } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: item.bgLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color,
                        fontSize: 14,
                        marginRight: 10,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                        {item.value.toLocaleString()}
                      </Text>
                    </div>
                  </div>

                  <div style={{ position: 'relative', width: 60, height: 60 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: percentage },
                            { value: 100 - percentage },
                          ]}
                          dataKey="value"
                          innerRadius={22}
                          outerRadius={30}
                          startAngle={90}
                          endAngle={450}
                        >
                          <Cell fill={item.color} />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 700, color: item.color }}>
                        {percentage}%
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Dashboard;

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import {
  Card,
  Avatar,
  Tag,
  Button,
  Row,
  Col,
  message,
  Table,
  Modal,
  Input,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import { adminApi } from '@/api/adminApi';
import { User } from '@/types/user.types';
import { FormHistory } from '@/types/analytics.types';

const PAGE_SIZE = 4;

interface PageProps {
  params: {
    id: string;
  };
}
const UserDetail = ({ params }: PageProps) => {
  const { id } = params; // ✅ NEXT.JS WAY

  /* ---------------- STATES ---------------- */
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<FormHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  // Reset password
  const [passwordModal, setPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [statusLoading, setStatusLoading] = useState(false);

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    if (id) {
      fetchUserDetail(id);
      fetchHistory(id, 0);
    }
  }, [id]);

  /* ---------------- API CALLS ---------------- */
  const fetchUserDetail = async (userId: string) => {
    try {
      setLoading(true);
      const res = await adminApi.getUserById(userId);
      setUser(res.data);
    } catch {
      message.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (userId: string, pageNo: number) => {
  try {
    setHistoryLoading(true);

    const res = await adminApi.getUserFormHistory(userId, {
      page: pageNo,
      size: PAGE_SIZE,
    });

    setHistory(res.data.content);
    setTotal(res.data.totalElements);
    setPage(pageNo);
  } catch {
    message.error('Failed to load history');
  } finally {
    setHistoryLoading(false);
  }
};

  /* ---------------- ACTIONS ---------------- */
  const handleResetPassword = async () => {
    if (!newPassword) {
      message.warning('Please enter a new password');
      return;
    }

    try {
      setPasswordLoading(true);
      await adminApi.resetPassword(Number(id), {
        newPassword,
      });

      message.success('Password reset successfully');
      setPasswordModal(false);
      setNewPassword('');
    } catch {
      message.error('Failed to reset password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await adminApi.toggleActiveStatus(Number(id));
      setUser(res.data);
      message.success('User status updated');
    } catch {
      message.error('Failed to update user status');
    } finally {
      setStatusLoading(false);
    }
  };

  if (!user) return null;

  /* ---------------- HISTORY TABLE ---------------- */
 const headerStyle = {
  color: '#1677ff',      // primary blue
  fontWeight: 600,
};

const columns = [
  {
    title: 'Form Type',
    dataIndex: 'formType',
    key: 'formType',
    onHeaderCell: () => ({
      style: headerStyle,
    }),
  },
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    onHeaderCell: () => ({
      style: headerStyle,
    }),
  },
  {
    title: 'Generated At',
    dataIndex: 'generatedAt',
    key: 'generatedAt',
    onHeaderCell: () => ({
      style: headerStyle,
    }),
    render: (value: string) => {
      const date = new Date(value);

      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return (
        <div>
          <div>{formattedDate}</div>
          <div style={{ color: '#888' }}>{formattedTime}</div>
        </div>
      );
    },
  },
];

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* USER INFO */}
      <Card loading={loading} style={{ marginBottom: 12 }}>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={80} icon={<UserOutlined />} />
          </Col>

          <Col flex="auto">
            <h2>
              {user.name}{' '}
              <Tag color={user.isActive ? 'green' : 'red'}>
                {user.isActive ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
            </h2>
            <p>{user.email}</p>
            <Tag>{user.role}</Tag>
          </Col>

          <Col>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => setPasswordModal(true)}
            >
              Reset Password
            </Button>

            <Button
              danger={user.isActive}
              loading={statusLoading}
              onClick={handleToggleStatus}
            >
              {user.isActive ? 'Deactivate User' : 'Activate User'}
            </Button>
          </Col>
        </Row>
      </Card>

<Card
  title="Form History"
  bodyStyle={{ paddingBottom: 8 }}
>
  <Table
    size="small"
    rowKey={(record) => `${record.fileName}-${record.generatedAt}`}
    columns={columns}
    dataSource={history}
    loading={historyLoading}
    pagination={{
      current: page + 1,
      total,
      pageSize: PAGE_SIZE,
      showSizeChanger: false,
      onChange: (p) => fetchHistory(id!, p - 1),
    }}
  />
</Card>





     

      {/* RESET PASSWORD MODAL */}
      <Modal
        title="Reset User Password"
        open={passwordModal}
        onCancel={() => setPasswordModal(false)}
        onOk={handleResetPassword}
        confirmLoading={passwordLoading}
        okText="Update Password"
      >
        <Input.Password
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default UserDetail;

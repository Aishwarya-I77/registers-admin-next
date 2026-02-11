"use client";
import React, { useState } from 'react';
import { Typography, Button, Card, Space } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import UserTable from '@/components/users/UserTable';
import { User } from '@/types/user.types';

const { Title, Text } = Typography;

const Users: React.FC = () => {
  const [createVisible, setCreateVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // 🔹 EXPORT USERS TO CSV
  const handleExport = () => {
    if (!users.length) return;

    const header = ['Name', 'Email', 'Designation', 'Role', 'Status'];

    const rows = users.map(u => [
      u.name,
      u.email,
      u.designation,
      u.role,
      u.isActive ? 'Active' : 'Inactive',
    ]);

    const csvContent =
      [header, ...rows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 0 }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
          marginTop: -15,
        }}
      >
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Users
          </Title>
          <Text type="secondary">
            Manage system access, roles, and user status
          </Text>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
          >
            Add New User
          </Button>

          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Export
          </Button>
        </Space>
      </div>

      <UserTable
        createVisible={createVisible}
        setCreateVisible={setCreateVisible}
        setExportUsers={setUsers}
      />
    </div>
  );
};

export default Users;

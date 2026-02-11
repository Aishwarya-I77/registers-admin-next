import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface UserFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ onFiltersChange }) => {
  const handleFilterChange = (filters: any) => {
    onFiltersChange(filters);
  };

  return (
    <Space>
      <Input
        placeholder="Search users..."
        prefix={<SearchOutlined />}
        onChange={(e) => handleFilterChange({ search: e.target.value })}
      />
      <Select
        placeholder="Filter by role"
        style={{ width: 120 }}
        allowClear
        onChange={(value) => handleFilterChange({ role: value })}
      >
        <Select.Option value="admin">Admin</Select.Option>
        <Select.Option value="user">User</Select.Option>
      </Select>
      <Select
        placeholder="Filter by status"
        style={{ width: 120 }}
        allowClear
        onChange={(value) => handleFilterChange({ isActive: value === 'active' })}
      >
        <Select.Option value="active">Active</Select.Option>
        <Select.Option value="inactive">Inactive</Select.Option>
      </Select>
    </Space>
  );
};

export default UserFilters;
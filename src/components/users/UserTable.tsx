import React, { useEffect, useState } from 'react';
// import './UserTable.css';
import {
  Table,
  Button,
  Card,
  Tag,
  Dropdown,
  message,
  Modal,
  Input,
  Select,
  Space,
  Popover,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';

import { User } from '../../types/user.types';
import { Role } from '../../types/common.types';
import { adminApi } from '../../api/adminApi';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import UserDetailsModal from './UserDetailsModal';

const { confirm } = Modal;

interface Props {
  createVisible: boolean;
  setCreateVisible: (v: boolean) => void;
  setExportUsers: (users: User[]) => void;
}

const UserTable: React.FC<Props> = ({
  createVisible,
  setCreateVisible,
  setExportUsers,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Filters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<Role | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [filterVisible, setFilterVisible] = useState(false);

  // ✏️ Edit
  const [editVisible, setEditVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 👁 Details
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedDetailsUser, setSelectedDetailsUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUsers();
  }, [search, role, isActive]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await adminApi.getAllUsers({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'desc',
        search,
        role,
        isActive,
      });

      const list = res?.data?.content || [];
      setUsers(list);
      setExportUsers(list);
    } catch {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete user
  const handleDeleteUser = (user: User) => {
    confirm({
      title: 'Delete User',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${user.name}?`,
      okType: 'danger',
      onOk: async () => {
        try {
          await adminApi.deleteUser(user.id);
          setUsers(prev => prev.filter(u => u.id !== user.id));
          message.success('User deleted');
        } catch {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const actions = (user: User) => [
    {
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
      onClick: () => {
        setSelectedDetailsUser(user);
        setDetailsVisible(true);
      },
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => {
        setSelectedUser(user);
        setEditVisible(true);
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      danger: true,
      icon: <DeleteOutlined />,
      onClick: () => handleDeleteUser(user),
    },
  ];

  // Custom header style - Change the color here
  const headerStyle = {
    fontWeight: 600,
    color: 'rgb(53, 89, 171)',
    background: '#f8fafc',
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name: string) => (
        <span style={{ whiteSpace: 'nowrap' }}>{name}</span>
      ),
      onHeaderCell: () => ({ style: headerStyle }),
    },
    {
  title: 'Email',
  dataIndex: 'email',
  render: (email: string) => (
    <span
      style={{
        color: '#475569',
        cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#1677ff')}
      onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
    >
      {email}
    </span>
  ),
  onHeaderCell: () => ({ style: headerStyle }),
},
    { 
      title: 'Designation', 
      dataIndex: 'designation',
      render: (designation: string) => (
    <span style={{ color: '#2563eb' }}>
      {designation}
    </span>
  ),
      onHeaderCell: () => ({ style: headerStyle }),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: string) => <Tag>{role}</Tag>,
      onHeaderCell: () => ({ style: headerStyle }),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'default'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
      onHeaderCell: () => ({ style: headerStyle }),
    },
    {
      title: 'Actions',
      render: (_: any, record: User) => (
        <Dropdown menu={{ items: actions(record) }}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
      onHeaderCell: () => ({ style: headerStyle }),
    },
  ];

  // Check if any filters are active
  const hasActiveFilters = role !== undefined || isActive !== undefined;

  // Filter dropdown content
  const filterContent = (
    <div style={{ width: 200 }}>
      <Space orientation="vertical" style={{ width: '100%' }}>
        <div>
          <div style={{ marginBottom: 4, fontSize: 12, color: '#666' }}>Role</div>
          <Select
            placeholder="Select role"
            allowClear
            value={role}
            onChange={setRole}
            style={{ width: '100%' }}
          >
            <Select.Option value="ADMIN">Admin</Select.Option>
            <Select.Option value="USER">User</Select.Option>
          </Select>
        </div>

        <div>
          <div style={{ marginBottom: 4, fontSize: 12, color: '#666' }}>Status</div>
          <Select
            placeholder="Select status"
            allowClear
            value={isActive}
            onChange={setIsActive}
            style={{ width: '100%' }}
          >
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </div>
      </Space>
    </div>
  );

  return (
    <>
      {/* 🔍 Filter Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%' }}>
          <Input
            placeholder="Search name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ flex: 1, minWidth: 800 }}
          />

          <Popover
            content={filterContent}
            title="Filters"
            trigger="click"
            open={filterVisible}
            onOpenChange={setFilterVisible}
            placement="bottomRight"
          >
            <Button 
              icon={<FilterOutlined />}
              type={hasActiveFilters ? 'primary' : 'default'}
              style={{ width: 120 }}
            >
              Filters
              {hasActiveFilters && (
                <span style={{ 
                  marginLeft: 4, 
                  background: '#fff', 
                  color: '#1890ff',
                  borderRadius: '50%',
                  padding: '0 6px',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  {[role, isActive].filter(f => f !== undefined).length}
                </span>
              )}
            </Button>
          </Popover>
        </Space>
      </Card>

      <Card
        style={{
          
          borderRadius: 12,
          border: '1px solid #eef2f7',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
           
        }}
        styles={{ body: { padding: '16px 16px 2px 16px' } }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          size="small"
          bordered
          rowClassName={(_, index) =>
            index % 2 === 0 ? 'user-row-even' : 'user-row-odd'
          }
          pagination={{
            pageSize: 4,
            showSizeChanger: false,
            hideOnSinglePage: true,
            style: { margin: '8px 8px' },
          }}
        />
      </Card>

      <CreateUserModal
        open={createVisible}
        onClose={() => setCreateVisible(false)}
        onSuccess={fetchUsers}
      />

      <EditUserModal
        visible={editVisible}
        user={selectedUser}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchUsers}
      />

      <UserDetailsModal
        visible={detailsVisible}
        user={selectedDetailsUser}
        onClose={() => setDetailsVisible(false)}
      />
    </>
  );
};

export default UserTable;

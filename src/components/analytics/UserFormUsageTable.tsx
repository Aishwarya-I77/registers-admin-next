"use client";

import { Table, Card, Skeleton, Typography } from 'antd';
import { UserFormUsage } from '../../types/analytics.types';
import { PaginatedResponse } from '../../types/common.types';


const { Title } = Typography;

/* ✅ MOVE THIS ABOVE THE COMPONENT */
interface UserFormUsageTableProps {
  data: PaginatedResponse<UserFormUsage>;
  loading?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
}

const UserFormUsageTable: React.FC<UserFormUsageTableProps> = ({
  data,
  loading = false,
  onPageChange,
}) => {
  if (loading) {
    return <Skeleton active />;
  }

  const headerStyle = {
  fontWeight: 600,
  color: '#1677ff',
};

const columns = [
  {
    title: 'User Name',
    dataIndex: 'username',
    key: 'username',
    onHeaderCell: () => ({ style: headerStyle }),
  },
  {
    title: 'Total Forms Used',
    dataIndex: 'formsUsed',
    key: 'formsUsed',
    onHeaderCell: () => ({ style: headerStyle }),
  },
  {
    title: 'Last Login',
    dataIndex: 'lastAccess',
    key: 'lastAccess',
    onHeaderCell: () => ({ style: headerStyle }),
  },
];

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          User Form Usage
        </Title>
      }
      style={{ marginTop: 12 }}   // reduced gap
    >
      <Table
        columns={columns}
        dataSource={data.content}
        rowKey="username"
        pagination={{
          current: data.pageNumber + 1,
          pageSize: data.pageSize,
          total: data.totalElements,
          showSizeChanger: false,
          onChange: (page, pageSize) => {
            onPageChange?.(page - 1, pageSize);
          },
        }}
      />
    </Card>
  );
};

export default UserFormUsageTable;

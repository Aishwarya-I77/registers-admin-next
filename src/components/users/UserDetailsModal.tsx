"use client";

import React, { useEffect, useState } from "react";
import {
  Tag,
  Button,
  Table,
  Divider,
  Avatar,
  Space,
  Popconfirm,
  message,
  Modal,
  Spin,
} from "antd";
import {
  LockOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { User } from "@/types/user.types";
import { adminApi } from "@/api/adminApi";
import ResetPasswordModal from "./ResetPasswordModal";
import { FormHistory } from "@/types/analytics.types";

interface UserDetailsModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const PAGE_SIZE = 10;

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  /* -------- FORM HISTORY STATE -------- */
  const [history, setHistory] = useState<FormHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  /* -------- FETCH FORM HISTORY -------- */
  useEffect(() => {
    if (visible && user?.id) {
      fetchFormHistory(0);
    }
  }, [visible, user?.id]);

  const fetchFormHistory = async (pageNo = 0) => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await adminApi.getUserFormHistory(user.id, {
        page: pageNo,
        size: PAGE_SIZE,
      });

      setHistory(res.data.content);
      setTotal(res.data.totalElements);
      setPage(pageNo);
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to fetch form history"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------- USER ACTIONS -------- */
  const handleDeactivateUser = async () => {
    if (!user) return;

    try {
      setDeactivating(true);
      await adminApi.updateUser(user.id, { isActive: false });
      message.success("User deactivated successfully");
      onClose();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to deactivate user"
      );
    } finally {
      setDeactivating(false);
    }
  };

  if (!visible || !user) return null;

  /* -------- TABLE COLUMNS -------- */
  const columns = [
    {
      title: "FORM TYPE",
      dataIndex: "formType",
      key: "formType",
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "GENERATED DATE",
      dataIndex: "generatedAt",
      key: "generatedAt",
      render: (value: string) =>
        new Date(value).toLocaleString("en-GB"),
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "center" as const,
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<DownloadOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        width={1000}
        footer={null}
        style={{ padding: 0 }}
      >
        <div style={{ padding: "24px" }}>
          {/* -------- HEADER -------- */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Avatar size={80} style={{ backgroundColor: "#667eea" }}>
                {user?.name?.charAt(0)}
              </Avatar>

              <div>
                <h2 style={{ margin: "0 0 8px 0" }}>
                  {user?.name}{" "}
                  <Tag color={user?.isActive ? "green" : "red"}>
                    {user?.isActive ? "ACTIVE" : "INACTIVE"}
                  </Tag>
                </h2>
                <p style={{ margin: "4px 0", color: "#666" }}>{user?.email}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={() => setResetPasswordVisible(true)}
              >
                Reset Password
              </Button>

              <Popconfirm
                title="Deactivate User"
                onConfirm={handleDeactivateUser}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  loading={deactivating}
                >
                  Deactivate User
                </Button>
              </Popconfirm>
            </div>
          </div>

          <Divider />

          {/* -------- FORM HISTORY -------- */}
          <div>
            <h3 style={{ marginBottom: "16px" }}>Form History</h3>

            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={history}
                rowKey="id"
                pagination={{
                  current: page + 1,
                  total,
                  pageSize: PAGE_SIZE,
                  showSizeChanger: false,
                  onChange: (p) => fetchFormHistory(p - 1),
                }}
                size="small"
              />
            </Spin>
          </div>
        </div>
      </Modal>

      <ResetPasswordModal
        visible={resetPasswordVisible}
        user={user}
        onClose={() => setResetPasswordVisible(false)}
      />
    </>
  );
};

export default UserDetailsModal;

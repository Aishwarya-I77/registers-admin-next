// src/components/users/CreateUserModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Row,
  Col,
  message,
} from 'antd';
import { adminApi } from '../../api/adminApi';
import { User } from '../../types/user.types';
import { Role } from '../../types/common.types';

const { Option } = Select;

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await adminApi.createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        designation: values.designation,
        role: values.role,
        isActive: values.isActive,
      });

      message.success('User created successfully');
      onSuccess(res.data);

      form.resetFields();
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add New User" open={open} onCancel={onClose} footer={null} width={700}>
      <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="Alice Johnson" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input placeholder="alice@company.com" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true }]}
            >
              <Input placeholder="Compliance Officer" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="password"
              label="Temporary Password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select placeholder="Select role">
                <Option value={Role.ADMIN}>Admin</Option>
                <Option value={Role.USER}>User</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="isActive" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Create User
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;

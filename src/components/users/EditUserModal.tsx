// src/components/users/EditUserModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox, message } from 'antd';
import { User, UpdateUserRequest } from '../../types/user.types';
import { adminApi } from '../../api/adminApi';

interface EditUserModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  user,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue({
        name: user.name,
        designation: user.designation,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, visible, form]);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: UpdateUserRequest = {
        name: values.name,
        designation: values.designation,
        role: values.role,
        isActive: values.isActive,
      };

      const res = await adminApi.updateUser(user.id, payload);

      message.success('User updated successfully');
      onSuccess(res.data); // ✅ return updated user
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Edit User - ${user?.name}`}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="designation"
          label="Designation"
          rules={[{ required: true, message: 'Designation is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="ADMIN">Admin</Select.Option>
            <Select.Option value="USER">User</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Active</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;

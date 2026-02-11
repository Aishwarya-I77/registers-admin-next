// src/components/users/ResetPasswordModal.tsx
import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { User } from '../../types/user.types';
import { adminApi } from '../../api/adminApi';

interface ResetPasswordModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      await adminApi.resetPassword(user.id, { newPassword: values.newPassword });
      message.success('Password reset successfully');
      form.resetFields();
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to reset password');
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
      title={`Reset Password - ${user?.name}`}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter new password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;
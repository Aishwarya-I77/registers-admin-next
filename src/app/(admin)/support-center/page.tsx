"use client";
import React from 'react';
import {
  Card,
  Typography,
  Collapse,
  Space,
  Button,
  Form,
  Input,
  message,
} from 'antd';
import {
  MailOutlined,
  QuestionCircleOutlined,
  BugOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const SupportCenter: React.FC = () => {
  const onFinish = () => {
    message.success('Support request submitted successfully');
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          Support Center
        </Title>
        <Text type="secondary">
          Get help, report issues, and find answers to common questions
        </Text>
      </div>

      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        {/* Knowledge Base */}
        <Card
          title={
            <Space>
              <QuestionCircleOutlined />
              <span>Knowledge Base</span>
            </Space>
          }
        >
          <Collapse ghost>
            <Panel header="How to manage users?" key="1">
              <Text>
                You can add, edit, or deactivate users from the Users section
                based on your access permissions.
              </Text>
            </Panel>

            <Panel header="How to generate forms?" key="2">
              <Text>
                Navigate to the Forms section, select the required form type,
                and generate or download it.
              </Text>
            </Panel>

            <Panel header="How to view analytics?" key="3">
              <Text>
                Analytics dashboards provide insights into form usage and user
                activity.
              </Text>
            </Panel>
          </Collapse>
        </Card>

        {/* Report Issue */}
        <Card
          title={
            <Space>
              <BugOutlined />
              <span>Report an Issue</span>
            </Space>
          }
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Issue Title"
              name="title"
              rules={[{ required: true, message: 'Please enter issue title' }]}
            >
              <Input placeholder="Brief issue title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: 'Please describe the issue' },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Describe the issue..." />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit Issue
            </Button>
          </Form>
        </Card>

        {/* Contact Support */}
        <Card
          title={
            <Space>
              <MailOutlined />
              <span>Contact Support</span>
            </Space>
          }
        >
          <Space direction="vertical">
            <Text>
              <strong>Email:</strong> leads@acquanthr.com
            </Text>
            <Text>
              <strong>Address:</strong> XG3C+42M 170, BBMP PID Number39-226-170, 1st Stage, 3rd Block, 
              Nagarabhavi, Chandra Layout, Bengaluru, Karnataka 560040
            </Text>
            <Text>
              <strong>Working Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM
            </Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default SupportCenter;

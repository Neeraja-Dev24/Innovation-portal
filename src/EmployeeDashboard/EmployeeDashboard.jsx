import { useState, useEffect } from 'react';
import { Layout, Typography, Button, Form, Input, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Usercontext/UserContext';

import './EmployeeDashboard.css';

const { Content, Footer } = Layout;
const { Title } = Typography;

const EmployeeDashboard = () => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const navigate = useNavigate();

  // Data for the existing ideas table
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form data for new idea submission
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== 'employee') {
      navigate('/'); // Redirect to login if not an employee
    }

    // Simulate fetching ideas (Replace with real API call)
    setIdeas([
      { key: '1', title: 'AI for HR', description: 'Using AI to streamline HR processes', status: 'Pending' },
      { key: '2', title: 'Blockchain for Voting', description: 'A secure voting system using blockchain technology', status: 'Approved' },
      { key: '3', title: 'Cloud Data Storage', description: 'A scalable cloud data storage solution', status: 'Rejected' },
    ]);
  }, [loggedInUser, navigate]);

  const handleSubmitIdea = (values) => {
    setLoading(true);

    // Simulate API call to submit the idea (Replace with real API call)
    setTimeout(() => {
      setLoading(false);
      setIdeas((prevIdeas) => [
        ...prevIdeas,
        {
          key: (prevIdeas.length + 1).toString(),
          title: values.title,
          description: values.description,
          status: 'Pending',
        },
      ]);
      message.success('Idea submitted successfully!');
      form.resetFields(); // Reset form after submission
    }, 1000);
  };

  const columns = [
    {
      title: 'Idea Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <Layout className="site-layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="dashboard-content">
          <Title level={3}>Welcome, {loggedInUser?.name}!</Title>

          {/* Existing Ideas Table */}
          <Title level={4} className="section-title">Existing Ideas</Title>
          <Table columns={columns} dataSource={ideas} pagination={false} />

          {/* New Idea Submission Form */}
          <Title level={4} className="section-title">Submit New Idea</Title>
          <Form
            form={form}
            name="idea-form"
            onFinish={handleSubmitIdea}
            layout="vertical"
            className="idea-form"
          >
            <Form.Item
              label="Idea Title"
              name="title"
              rules={[{ required: true, message: 'Please input your idea title!' }]}
            >
              <Input placeholder="Enter idea title" />
            </Form.Item>

            <Form.Item
              label="Idea Description"
              name="description"
              rules={[{ required: true, message: 'Please input your idea description!' }]}
            >
              <Input.TextArea placeholder="Enter idea description" rows={4} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Submit Idea
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center' }}>
        Innovation Portal ©2025 Created by Your Company
      </Footer>
    </Layout>
  );
};

export default EmployeeDashboard;

import React, { useState } from 'react';
import { Button, Layout, Typography, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext/UserContext'
import './LoginPage.css';

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access setUser function from context
  const [loading, setLoading] = useState(false);

  // Mock authentication function
  const authenticateUser = (values) => {
    setLoading(true);
    const { username, password } = values;

    // Mock role-based redirection (replace this with your real API call)
    setTimeout(() => {
      setLoading(false);
      if (username === 'employee' && password === '1234') {
        // Set the user context when login is successful
        setUser({ name: 'John Doe', role: 'employee', username: 'employee' });
        navigate('/employee-dashboard'); // Redirect to the employee dashboard
      } else if (username === 'reviewer' && password === '1234') {
        setUser({ name: 'Jane Smith', role: 'reviewer', username: 'reviewer' });
        navigate('/reviewer-dashboard'); // Redirect to the reviewer dashboard
      } else {
        message.error('Invalid username or password!');
      }
    }, 1000);
  };

  return (
    <Layout className="login-page">
      <Header className="header">Innovation Portal</Header>

      <Content className="content">
        <div className="form-wrapper">
          <Title level={2} className="title">Login</Title>
          <Form
            name="login"
            layout="vertical"
            onFinish={authenticateUser}
            className="login-form"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      <Footer className="footer">
        Innovation Portal ©2025 Created by Conneqt Digital!!
      </Footer>
    </Layout>
  );
};

export default LoginPage;

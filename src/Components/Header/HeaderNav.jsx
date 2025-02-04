import { useState } from 'react';
import { Button, Layout, Typography, Form, Input, message, Modal, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext/UserContext';
import { Users, addUser } from '../../Data/Users';  // Ensure Users and addUser are correctly implemented
import './HeaderNav.css';

const { Title } = Typography;
const { Header } = Layout;
const { Option } = Select;

const HeaderNav = () => {
  const { setUser } = useUser();
  const [isModalVisible, setIsModalVisible] = useState({ login: false, signup: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showModal = (type) => {
    // Debugging: Log to check if showModal is working
    console.log(`Opening ${type} modal`);
    setIsModalVisible({ ...isModalVisible, [type]: true });
  };

  const handleCancel = () => {
    console.log("Closing Modal");
    setIsModalVisible({ login: false, signup: false });
  };

  const handleLogin = (values) => {
    const { username, password } = values;
    setLoading(true);

    const user = Users.find((user) => user.username === username);

    setTimeout(() => {
      setLoading(false);

      if (user && password === '1234') {
        setUser({ name: user.name, role: user.role, username: user.username, user_id: user.id });
        message.success('Login successful! Redirecting...');

        const redirectPath = user.role === 'reviewer' ? '/reviewer-dashboard' : '/employee-dashboard';

        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      } else {
        message.error('Invalid username or password!');
      }
    }, 1000);
  };

  const handleSignUp = (values) => {
    const { name, username, password, role } = values;
    setLoading(true);

    const existingUser = Users.find((user) => user.username === username);

    setTimeout(() => {
      setLoading(false);

      if (existingUser) {
        message.error('Username already exists!');
      } else {
        addUser({ name, username, password, role });
        message.success('Sign-up successful! You can now log in.');

        setIsModalVisible({ ...isModalVisible, signup: false });
      }
    }, 1000);
  };

  return (
    <div>
      <Header className="hedernav">
        <div className="head-title">
          <Title level={3}>Innovation Portal</Title>
        </div>
        <div className="head-login">
          <Title level={4} onClick={() => showModal('login')} className="login">
            Login /
          </Title>
          <Title level={4} onClick={() => showModal('signup')} className="signup">
            Sign Up
          </Title>
        </div>
      </Header>

      {/* Login Modal */}
      <Modal
        title="Login"
        visible={isModalVisible.login}  
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}  
      >
        <Form name="login" layout="vertical" onFinish={handleLogin}>
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
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        title="Sign Up"
        visible={isModalVisible.signup}  
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true} 
      >
        <Form name="signup" layout="vertical" onFinish={handleSignUp}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter a username!' }]}
          >
            <Input placeholder="Choose a username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter a password!' }]}
          >
            <Input.Password placeholder="Choose a password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select your role">
              <Option value="employee">Employee</Option>
              <Option value="reviewer">Reviewer</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HeaderNav;

import { useState } from 'react';
import { Button, Layout, Typography, Form, Input, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext/UserContext';
import { Users } from '../../Data/Users';  // Fixed import
import "./HeaderNav.css";

const { Title } = Typography;
const { Header } = Layout;

function HeaderNav() {
  const { setUser } = useUser(); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const authenticateUser = (values) => {
    setLoading(true);
    const { username, password } = values;

    const user = Users.find(user => user.username === username); // Fixed user lookup

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

  return (
    <div>
      <Header className='hedernav'>
        <div className="head-title">
          <Title level={3}>Innovation Portal</Title>
        </div>
        <div className='head-login'>
          <Title level={4} onClick={showModal} style={{ cursor: 'pointer' }}>
            Login
          </Title>
        </div>
      </Header>
      
      <Modal
        title="Login"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="login" layout="vertical" onFinish={authenticateUser}>
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
    </div>
  );
}

export default HeaderNav;

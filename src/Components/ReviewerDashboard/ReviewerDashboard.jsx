import { useState, useEffect } from 'react';
import { Layout, Typography, Menu, Button, Drawer } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '../../UserContext/useUser';
import { ClockCircleOutlined, CheckCircleOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import './ReviewerDashboard.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const ReviewerDashboard = () => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState('pendingReviews');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Ensure only reviewers can access this dashboard
  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== 'reviewer') {
      navigate('/login');
    }
  }, [loggedInUser, navigate]);

  // Update selected menu based on the current URL
  useEffect(() => {
    const { pathname } = location;
    const menuKeys = ['pendingReviews', 'approvedIdeas', 'profile'];
    const selectedKey = menuKeys.find(key => pathname.includes(key)) || 'approvedIdeas';
    setSelectedMenu(selectedKey);
  }, [location]);
  

  const handleMenuClick = ({ key }) => {
    setSelectedMenu(key);
    navigate(`/reviewer-dashboard/${key}`);
    setIsDrawerVisible(false);
  };

  const handleLogout = () => {
    navigate('/login');
    setLoggedInUser(null);
  };

  return (
    <Layout className="dashboard-layout">
      <Header className="dashboard-header">
        <div className="header-content">
          <Title level={3} className="welcome-message">
            Welcome, {loggedInUser?.name} (Reviewer)!
          </Title>
          <div className="header-right">
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </Button>
            <Button
              type="link"
              icon={<MenuOutlined />}
              onClick={() => setIsDrawerVisible(true)}
              className="hamburger-menu"
            />
          </div>
        </div>
      </Header>

      <Layout>
        <Sider className="dashboard-sidebar" breakpoint="md" collapsedWidth="0">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={handleMenuClick}
            className="dashboard-menu"
          >
            <Menu.Item key="approvedIdeas" icon={<CheckCircleOutlined />}>
             Approved Ideas
            </Menu.Item>
            <Menu.Item key="pendingReviews" icon={<ClockCircleOutlined />}>
              Pending Reviews
            </Menu.Item>
          
          </Menu>
        </Sider>

        <Layout className="dashboard-main">
          <Content className="dashboard-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        className="mobile-drawer"
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          <Menu.Item key="approvedIdeas" icon={<CheckCircleOutlined />}>
            Approved Ideas
          </Menu.Item>
          <Menu.Item key="pendingReviews" icon={<ClockCircleOutlined />}>
            Pending Reviews
          </Menu.Item>
          
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default ReviewerDashboard;

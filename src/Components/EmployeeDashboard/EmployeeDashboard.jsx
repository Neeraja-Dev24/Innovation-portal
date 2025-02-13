import { useState, useEffect } from 'react';
import { Layout, Typography, Menu, Button, Drawer } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // useLocation for URL changes
import { useUser } from '../../UserContext/useUser';
import { AppstoreOutlined, FormOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import './EmployeeDashboard.css';

const { Content, Header, Sider } = Layout;
const { Title } = Typography;

const EmployeeDashboard = () => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [selectedMenu, setSelectedMenu] = useState('approvedIdeas');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);


  useEffect(() => {
    if (location.pathname.includes('details')) {
      setSelectedMenu('approvedIdeas'); 
    }
  }, [location]);

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== 'employee') {
      navigate('/');
    }
  }, [loggedInUser, navigate]);

  const handleMenuClick = ({ key }) => {
    setSelectedMenu(key);
    navigate(`/employee-dashboard/${key}`);
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
            Welcome, {loggedInUser?.name}!
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
          <Menu mode="inline" selectedKeys={[selectedMenu]} onClick={handleMenuClick} className="dashboard-menu">
            <Menu.Item key="approvedIdeas" icon={<AppstoreOutlined />}>
              Approved Ideas
            </Menu.Item>
            <Menu.Item key="myIdeas" icon={<AppstoreOutlined />}>
              My Ideas
            </Menu.Item>
            <Menu.Item key="submitIdea" icon={<FormOutlined />}>
              Submit Idea
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
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        closable={true}
        className="mobile-drawer"
      >
        <Menu mode="inline" selectedKeys={[selectedMenu]} onClick={handleMenuClick} className="dashboard-menu">
          <Menu.Item key="approvedIdeas" icon={<AppstoreOutlined />}>
            Approved Ideas
          </Menu.Item>
          <Menu.Item key="myIdeas" icon={<AppstoreOutlined />}>
            My Ideas
          </Menu.Item>
          <Menu.Item key="submitIdea" icon={<FormOutlined />}>
            Submit Ideas
          </Menu.Item>
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default EmployeeDashboard;

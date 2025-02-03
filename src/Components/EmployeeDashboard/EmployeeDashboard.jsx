import { useState, useEffect } from 'react';
import { Layout, Typography, Menu, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext/UserContext';
import { AppstoreOutlined, FormOutlined, LogoutOutlined } from '@ant-design/icons';
import { IdeasData } from '../../Data/IdeasData';
import ExistingIdeas from './ExistingIdeas/ExistingIdeas';
import SubmitIdeas from './SubmitIdeas/SubmitIdeas';
import './EmployeeDashboard.css';

const { Content, Header, Sider } = Layout;
const { Title } = Typography;

const EmployeeDashboard = () => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const navigate = useNavigate();
  const { menu } = useParams(); // Get menu state from URL
  const [selectedMenu, setSelectedMenu] = useState(menu || 'existingIdeas');
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== 'employee') {
      navigate('/');
    }
    setIdeas(IdeasData);
  }, [loggedInUser, navigate]);

  const handleMenuClick = ({ key }) => {
    setSelectedMenu(key);
  };

  const handleLogout = () => {
    navigate('/');
    setLoggedInUser(null);

  };

  return (
    <Layout className="site-layout">
      {/* Header */}
      <Header className="site-header">
        <div className="header-content">
          <Title level={3} className="welcome-message">
            Welcome, {loggedInUser?.name}!
          </Title>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      </Header>

      {/* Sidebar and Content */}
      <Layout style={{ display: 'flex' }}>
        <Sider width={240} className="sidebar" theme="dark">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={handleMenuClick}
          >
            <Menu.Item key="existingIdeas" icon={<AppstoreOutlined />}>
              Existing Ideas
            </Menu.Item>
            <Menu.Item key="submitIdea" icon={<FormOutlined />}>
              Submit Idea
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '24px' }}>
          <Content className="dashboard-content">
            {selectedMenu === 'existingIdeas' ? (
              <ExistingIdeas ideas={ideas} setIdeas={setIdeas} />
            ) : (
              <SubmitIdeas ideas={ideas} setIdeas={setIdeas} />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default EmployeeDashboard;

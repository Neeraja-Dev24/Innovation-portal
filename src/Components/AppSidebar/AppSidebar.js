import { Layout, Menu } from 'antd';
import { AppstoreAddOutlined, FileSearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './AppSidebar.css';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/'); 
  };

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<AppstoreAddOutlined />} onClick={() => navigate('/employee-dashboard')}>
          Submit Idea
        </Menu.Item>
        <Menu.Item key="2" icon={<FileSearchOutlined />} onClick={() => navigate('/my-ideas')}>
          My Ideas
        </Menu.Item>
        <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;

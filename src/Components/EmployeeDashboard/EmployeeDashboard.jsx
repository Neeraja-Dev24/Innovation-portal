import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Layout, Typography, Menu, Button } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useUser } from "../../UserContext/useUser";
import {
  AppstoreOutlined,
  FormOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./EmployeeDashboard.css";

const { Content, Header, Sider } = Layout;
const { Title } = Typography;

const Drawer = lazy(() => import("antd/es/drawer"));

const EmployeeDashboard = () => {
  const { loggedInUser, logOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("approvedIdeas");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("details")) {
      setSelectedMenu("approvedIdeas");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== "employee") {
      navigate("/login");
    }
  }, [loggedInUser, navigate]);

  const handleMenuClick = useCallback(({ key }) => {
    setSelectedMenu(key);
    navigate(`/employee-dashboard/${key}`);
    setIsDrawerVisible(false);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logOut();
  }, [logOut]);

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
              aria-label="Logout"
            >
              Logout
            </Button>
            <Button
              type="link"
              icon={<MenuOutlined />}
              onClick={() => setIsDrawerVisible(true)}
              className="hamburger-menu"
              aria-label="Open Menu"
            />
          </div>
        </div>
      </Header>

      <Layout>
        <Sider
          className="dashboard-sidebar"
          breakpoint="md"
          collapsedWidth="0"
          collapsible
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={handleMenuClick}
            className="dashboard-menu"
          >
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

      <Suspense fallback={null}>
        {isDrawerVisible && (
          <Drawer
            title="Menu"
            placement="left"
            data-testid="drawer" 
            onClose={() => setIsDrawerVisible(false)}
            open={isDrawerVisible}
            closable
            className="mobile-drawer"
            aria-label="Navigation Drawer"
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedMenu]}
              onClick={handleMenuClick}
              className="dashboard-menu"
            >
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
        )}
      </Suspense>
    </Layout>
  );
};

export default EmployeeDashboard;

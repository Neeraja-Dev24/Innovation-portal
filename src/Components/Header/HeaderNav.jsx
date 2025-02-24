import { Layout, Typography} from 'antd';
import './HeaderNav.css';

const { Title } = Typography;
const { Header } = Layout;

const HeaderNav = () => {
  return (
    <div>
      <Header className="hedernav">
          <Title level={3} data-testid="header-title">Innovation Portal</Title>
      </Header>
    </div>
  );
};

export default HeaderNav;

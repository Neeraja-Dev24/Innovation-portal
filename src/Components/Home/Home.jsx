import { Layout } from 'antd';
import Login from '../Auth/Login/Login';
import HeaderNav from '../Header/HeaderNav';

const { Content } = Layout;

export default function Home() {
  return (
    <Layout>
      <HeaderNav/>
      <Content>
        <Login/>
      </Content>
    </Layout>
  )
}

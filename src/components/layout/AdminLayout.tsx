import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  WalletOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Admin Dashboard' },
    { key: '/admin/users', icon: <TeamOutlined />, label: 'Users' },
    { key: '/admin/accounts', icon: <WalletOutlined />, label: 'Accounts' },
    { key: '/admin/audit-logs', icon: <FileSearchOutlined />, label: 'Audit Logs' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 64, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {collapsed ? 'AX' : 'AdminX'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Admin Console</Title>
        </Header>
        <Content style={{ margin: 24, background: '#fff', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

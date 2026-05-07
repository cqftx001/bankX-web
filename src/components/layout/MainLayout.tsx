import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Space, Layout, Menu, Avatar, Dropdown, Typography } from 'antd';
import {
  DashboardOutlined,
  WalletOutlined,
  TransactionOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { logout as logoutApi } from '../../api/auth';
import { changeLanguage } from '../../i18n';
import { useTranslation } from 'react-i18next';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export function MainLayout() {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // 监听窗口大小变化
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // 自动折叠 Sider
      if (mobile) setCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Language switcher dropdown
  const languageItems = [
    { key: 'en', label: 'English',  onClick: () => changeLanguage('en') },
    { key: 'zh', label: '中文',     onClick: () => changeLanguage('zh') },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.warn('Logout API failed:', e);
    }
    clearAuth();
    navigate('/login', { replace: true });
  };

  // 修改 menuItems，让 label 国际化
  const menuItems = [
    { key: '/app/dashboard',    icon: <DashboardOutlined />,   label: t('nav.dashboard')    },
    { key: '/app/accounts',     icon: <WalletOutlined />,      label: t('nav.accounts')     },
    { key: '/app/transactions', icon: <TransactionOutlined />, label: t('nav.transactions') },
    { key: '/app/profile',      icon: <UserOutlined />,        label: t('nav.profile')      },
  ];

  // 修改 userMenuItems
  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />,   label: t('nav.profile'),
      onClick: () => navigate('/app/profile') },
    { key: 'logout',  icon: <LogoutOutlined />, label: t('nav.logout'), danger: true,
      onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        theme="dark"  
        breakpoint="md"  
        collapsedWidth={80}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {collapsed ? 'BX' : 'BankX'}
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
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          }}
        >
          <div
            style={{ cursor: 'pointer', fontSize: 18 }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Space size="middle">
            <Dropdown menu={{ items: languageItems }} placement="bottomRight">
                <div style={{ cursor: 'pointer', padding: '0 8px' }}>
                    <GlobalOutlined style={{ fontSize: 18 }} />
                    <Text style={{ marginLeft: 6 }}>
                    {i18n.language === 'zh' ? '中文' : 'EN'}
                    </Text>
                </div>
            </Dropdown>

            {/* 用户下拉菜单 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<UserOutlined />} />
                <Text>{user?.email}</Text>
                </div>
            </Dropdown>
            </Space>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

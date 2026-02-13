import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Space, Avatar, Spin, message } from 'antd';
import { LogoutOutlined, HomeOutlined, UnorderedListOutlined, LoginOutlined, UserAddOutlined, UserOutlined, BugOutlined } from '@ant-design/icons';
import NotificationBell from './NotificationBell';

const Navigation = ({ isAuthenticated, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername || 'User');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    message.success('Logged out successfully');
    navigate('/login');
    setLoading(false);
  };

  const userMenuItems = isAuthenticated ? [
    {
      key: 'profile',
      label: `Signed in as: ${username}`,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ] : [];

  const authButtons = isAuthenticated ? (
    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
      <Space>
        <Avatar icon={<UserOutlined />} />
        <span style={{ color: '#40a9ff', fontWeight: 600, fontSize: 16 }}>{username}</span>
      </Space>
    </Dropdown>
  ) : (
    <Space>
      <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
        Login
      </Button>
      <Button icon={<UserAddOutlined />} onClick={() => navigate('/register')}>
        Register
      </Button>
    </Space>
  );

  return (
    <Layout.Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
        boxShadow: '0 4px 16px #00000033',
        padding: '0 40px',
        minHeight: 64,
        borderBottom: '2px solid #ff7875',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <BugOutlined style={{ fontSize: 32, color: '#ff7875', marginRight: 14, filter: 'drop-shadow(0 2px 4px #00000044)' }} />
          <span style={{
            color: '#fff',
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: 1.5,
            textShadow: '0 2px 8px #00000055',
            fontFamily: 'Segoe UI, Arial, sans-serif',
          }}>BugTracker</span>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          selectable={false}
          style={{
            background: 'transparent',
            borderBottom: 'none',
            fontSize: 17,
            fontWeight: 600,
            color: '#e0e0e0',
            minWidth: 220,
          }}
        >
          <Menu.Item key="home" icon={<HomeOutlined style={{ color: '#40a9ff' }} />}>
            <Link to="/" style={{ color: '#e0e0e0' }}>Home</Link>
          </Menu.Item>
          <Menu.Item key="tickets" icon={<UnorderedListOutlined style={{ color: '#ffc53d' }} />}>
            <Link to="/tickets" style={{ color: '#e0e0e0' }}>Tickets</Link>
          </Menu.Item>
        </Menu>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {isAuthenticated && <NotificationBell />}
        {authButtons}
      </div>
    </Layout.Header>
  );
};

export default Navigation;

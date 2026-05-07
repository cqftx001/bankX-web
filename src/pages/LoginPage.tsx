import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Space } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { login } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import { BackendError } from '../api/client';
import type { LoginRequest } from '../types/auth';
import { parseAuthClaims } from '../utils/authClaims';

const { Title, Text } = Typography;

export function LoginPage() {
  const { t } = useTranslation();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const setAuth = useAuthStore((state) => state.setAuth);

  const from =
    (location.state as { from?: Location })?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (values: LoginRequest) => {
    setError(null);
    setLoading(true);

    try {
      const auth = await login(values);
      const claims = parseAuthClaims(auth.roles);

      setAuth(
        {
          userId: auth.userId,
          email: auth.email,
          roles: claims.roles,
          authorities: claims.authorities,
        },
        auth.accessToken
      );

      navigate(from, { replace: true });
    } catch (e) {
      setError(
        e instanceof BackendError
          ? e.message
          : t('auth.login.failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{
        width: '100%',
        maxWidth: 400,        // 🆕 最大宽度，但不强制 400
        margin: '0 16px',     // 🆕 手机上左右留 16px 边距
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 4 }}>
              {t('common.appName')}
            </Title>

            <Text type="secondary">
              {t('auth.login.title')}
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              label={t('auth.login.email')}
              name="email"
              rules={[
                {
                  required: true,
                  message: t('auth.login.emailRequired'),
                },
                {
                  type: 'email',
                  message: t('auth.login.emailInvalid'),
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={t('auth.login.emailPlaceholder')}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={t('auth.login.password')}
              name="password"
              rules={[
                {
                  required: true,
                  message: t('auth.login.passwordRequired'),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.login.password')}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                {t('auth.login.submit')}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register">
                {t('auth.login.register')}
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}

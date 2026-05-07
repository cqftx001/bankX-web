import { Card, Row, Col, Statistic, Typography } from 'antd';
import { WalletOutlined, TransactionOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <Title level={2}>{t('dashboard.welcome', { email: user?.email })}</Title>
      <Paragraph type="secondary">{t('dashboard.subtitle')}</Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title={t('dashboard.totalBalance')} value={0} prefix="$" precision={2} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title={t('dashboard.activeAccounts')} value={0} prefix={<WalletOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title={t('dashboard.monthlyTransactions')} value={0} prefix={<TransactionOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
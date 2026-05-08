import { useCallback } from 'react';
import {
    Card, Row, Col, Typography, Statistic, Spin, Alert, Empty,
} from 'antd';
import { WalletOutlined, SwapOutlined, DollarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { getMyAccounts } from '../api/account';
import { searchMyTransactions } from '../api/transaction';
import { useApiQuery } from '../hooks/useApiQuery';
import { TransactionCard } from '../components/transaction/TransactionCard';
import { useAuthStore } from '../stores/authStore';

const { Title, Text } = Typography;

export function DashboardPage() {
    const { t } = useTranslation();
    const email = useAuthStore((s) => s.user?.email);

    const {
        data: accounts,
        loading: accountsLoading,
        error: accountsError,
    } = useApiQuery(
        useCallback((signal: AbortSignal) => getMyAccounts(signal), [])
    );

    const {
        data: recentTx,
        loading: txLoading,
        error: txError,
    } = useApiQuery(
        useCallback(
            (signal: AbortSignal) =>
                searchMyTransactions({}, { page: 0, size: 5 }, signal),
            [],
        )
    );

    const activeAccounts = accounts?.filter((a) => a.status === 'ACTIVE') ?? [];
    const totalBalance = activeAccounts.reduce((sum, a) => sum + a.balance, 0);
    const recentTransactions = recentTx?.items ?? [];

    const loading = accountsLoading || txLoading;
    const error = accountsError || txError;

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 60 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert message="Failed to load dashboard" description={error} type="error" showIcon />
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>
                    {t('dashboard.welcome', { email })}
                </Title>
                <Text type="secondary">{t('dashboard.subtitle')}</Text>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title={t('dashboard.totalBalance')}
                            value={totalBalance}
                            prefix={<DollarOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title={t('dashboard.activeAccounts')}
                            value={activeAccounts.length}
                            suffix={accounts ? `/ ${accounts.length}` : ''}
                            prefix={<WalletOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title={t('dashboard.monthlyTransactions')}
                            value={recentTx?.total ?? 0}
                            prefix={<SwapOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title={t('transaction.title')} style={{ marginBottom: 24 }}>
                {recentTransactions.length === 0 ? (
                    <Empty description={t('transaction.empty')} />
                ) : (
                    recentTransactions.map((tx) => (
                        <TransactionCard key={tx.id} transaction={tx} />
                    ))
                )}
            </Card>
        </div>
    );
}
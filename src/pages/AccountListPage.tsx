// src/pages/AccountListPage.tsx

import { useState, useCallback } from 'react';
import {
    Card, Row, Col, Button, Tag, Typography, Modal,
    Form, Select, Empty, Spin, Alert, Statistic, Space,
} from 'antd';
import {
    PlusOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { getMyAccounts, createAccount } from '../api/account';
import { useApiQuery } from '../hooks/useApiQuery';
import { BackendError } from '../api/client';
import type { AccountVo, AccountStatus } from '../types/account';

const { Title, Text } = Typography;

const STATUS_COLOR: Record<AccountStatus, string> = {
    ACTIVE:   'green',
    FROZEN:   'blue',
    CLOSED:   'default',
    INACTIVE: 'orange',
};

export function AccountListPage() {
    const { t } = useTranslation();

    const {
        data: accounts,
        loading,
        error,
        refetch,
    } = useApiQuery(
        useCallback((signal: AbortSignal) => getMyAccounts(signal), [])
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [form] = Form.useForm();

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            setCreating(true);
            setCreateError(null);
            await createAccount({ accountType: values.accountType });
            setModalOpen(false);
            form.resetFields();
            refetch();
        } catch (e) {
            if (e instanceof BackendError) {
                setCreateError(e.message);
            }
        } finally {
            setCreating(false);
        }
    };

    const activeAccounts = accounts?.filter((a) => a.status === 'ACTIVE') ?? [];
    const totalBalance = activeAccounts.reduce((sum, a) => sum + a.balance, 0);

    return (
        <div>
            {/* 页面标题 + 开户按钮 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: 12,
            }}>
                <Title level={3} style={{ margin: 0 }}>
                    {t('nav.accounts')}
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                >
                    {t('account.openNew')}
                </Button>
            </div>

            {/* 汇总卡片 */}
            {accounts && accounts.length > 0 && (
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title={t('account.totalBalance')}
                                value={totalBalance}
                                prefix="$"
                                precision={2}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title={t('account.activeAccounts')}
                                value={activeAccounts.length}
                                suffix={`/ ${accounts.length}`}
                                prefix={<WalletOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 加载 / 错误 / 空 */}
            {loading && (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <Spin size="large" />
                </div>
            )}

            {error && (
                <Alert
                    message={t('account.loadFailed')}
                    description={error}
                    type="error"
                    showIcon
                    action={<Button onClick={refetch}>{t('common.retry')}</Button>}
                    style={{ marginBottom: 16 }}
                />
            )}

            {!loading && !error && accounts?.length === 0 && (
                <Empty
                    description={t('account.empty')}
                    style={{ padding: 60 }}
                />
            )}

            {/* 账户卡片 */}
            <Row gutter={[16, 16]}>
                {accounts?.map((account) => (
                    <Col xs={24} sm={12} lg={8} key={account.id}>
                        <AccountCard account={account} />
                    </Col>
                ))}
            </Row>

            {/* 开户 Modal */}
            <Modal
                title={t('account.create.title')}
                open={modalOpen}
                onOk={handleCreate}
                onCancel={() => {
                    setModalOpen(false);
                    setCreateError(null);
                    form.resetFields();
                }}
                confirmLoading={creating}
                okText={t('common.create')}
                cancelText={t('common.cancel')}
            >
                {createError && (
                    <Alert
                        message={createError}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setCreateError(null)}
                        style={{ marginBottom: 16 }}
                    />
                )}
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="accountType"
                        label={t('account.create.typeLabel')}
                        rules={[{
                            required: true,
                            message: t('account.create.typeRequired'),
                        }]}
                    >
                        <Select
                            placeholder={t('account.create.typePlaceholder')}
                            options={[
                                { value: 'SAVING',   label: t('account.create.saving') },
                                { value: 'CHECKING', label: t('account.create.checking') },
                                { value: 'CREDIT',   label: t('account.create.credit') },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

// ── AccountCard ─────────────────────────────────────────────

function AccountCard({ account }: { account: AccountVo }) {
    const { t } = useTranslation();
    const dateStr = new Date(account.createdAt).toLocaleDateString();

    return (
        <Card
            hoverable
            style={{ height: '100%' }}
            styles={{ body: { padding: 20 } }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
            }}>
                <Text strong>
                    {t(`account.type.${account.accountType}`)}
                </Text>
                <Tag color={STATUS_COLOR[account.status]}>
                    {account.status}
                </Tag>
            </div>

            <div style={{ marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('account.balance')}
                </Text>
                <div style={{ fontSize: 24, fontWeight: 500 }}>
                    ${account.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            </div>

            <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {account.accountNumber}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {account.currency} · {t('account.opened', { date: dateStr })}
                </Text>
            </Space>
        </Card>
    );
}
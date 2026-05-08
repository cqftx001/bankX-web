// src/pages/ProfilePage.tsx

import { useState, useCallback } from 'react';
import {
    Card, Row, Col, Typography, Descriptions, Button,
    Spin, Alert, Divider,
} from 'antd';
import {
    EditOutlined, UserOutlined, MailOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { getMyProfile } from '../api/profile';
import { useApiQuery } from '../hooks/useApiQuery';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { EmailChangeModal } from '../components/profile/EmailChangeModal';

const { Title, Text } = Typography;

export function ProfilePage() {
    const { t } = useTranslation();

    const {
        data: profile,
        loading,
        error,
        refetch,
    } = useApiQuery(
        useCallback((signal: AbortSignal) => getMyProfile(signal), [])
    );

    const [editOpen, setEditOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 60 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <Alert
                message={t('profile.loadFailed')}
                description={error}
                type="error"
                showIcon
                action={<Button onClick={refetch}>{t('common.retry')}</Button>}
            />
        );
    }

    const displayValue = (value: string | null) =>
        value || <Text type="secondary">{t('profile.notProvided')}</Text>;

    return (
        <div>
            {/* 标题 + 操作按钮 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                flexWrap: 'wrap',
                gap: 12,
            }}>
                <Title level={3} style={{ margin: 0 }}>
                    {t('profile.title')}
                </Title>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button onClick={() => setEmailOpen(true)}>
                        {t('profile.changeEmail')}
                    </Button>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
                        {t('profile.edit')}
                    </Button>
                </div>
            </div>

            {/* 头部信息卡 */}
            <Card style={{ marginBottom: 24 }}>
                <Row align="middle" gutter={16}>
                    <Col>
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: '#1677ff15',
                            color: '#1677ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                        }}>
                            <UserOutlined />
                        </div>
                    </Col>
                    <Col flex="auto">
                        <Text strong style={{ fontSize: 16 }}>
                            {profile.firstName && profile.lastName
                                ? `${profile.firstName} ${profile.lastName}`
                                : profile.username ?? profile.email}
                        </Text>
                        <br />
                        <Text type="secondary">
                            <MailOutlined style={{ marginRight: 4 }} />
                            {profile.email}
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* 个人信息 */}
            <Card title={t('profile.sectionIdentity')} style={{ marginBottom: 24 }}>
                <Descriptions column={{ xs: 1, sm: 2 }} colon={false}>
                    <Descriptions.Item label={t('profile.firstName')}>
                        {displayValue(profile.firstName)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.lastName')}>
                        {displayValue(profile.lastName)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.phone')}>
                        {displayValue(profile.phone)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.birthDate')}>
                        {displayValue(profile.birthDate)}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 地址信息 */}
            <Card title={t('profile.sectionAddress')}>
                <Descriptions column={{ xs: 1, sm: 2 }} colon={false}>
                    <Descriptions.Item label={t('profile.addressLine1')}>
                        {displayValue(profile.addressLine1)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.addressLine2')}>
                        {displayValue(profile.addressLine2)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.city')}>
                        {displayValue(profile.city)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.state')}>
                        {displayValue(profile.state)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.zipCode')}>
                        {displayValue(profile.zipCode)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('profile.country')}>
                        {displayValue(profile.country)}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Modal */}
            <EditProfileModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSuccess={refetch}
                profile={profile}
            />
            <EmailChangeModal
                open={emailOpen}
                onClose={() => {
                    setEmailOpen(false);
                    refetch();
                }}
                currentEmail={profile.email}
            />
        </div>
    );
}
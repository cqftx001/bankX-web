import { useEffect, useState } from 'react';
import {
    Modal, Form, Input, Row, Col, Descriptions, Alert,
    Tooltip, Typography, message,
} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { updateMyProfile, updateUserProfile } from '../../api/profile';
import type { UserProfileVo, UpdateMyProfileRequest, UpdateProfileRequest } from '../../types/profile';
import { BackendError } from '../../api/client';

const { Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    profile: UserProfileVo;
}

export function EditProfileModal({ open, onClose, onSuccess, profile }: Props) {
    const { t } = useTranslation();
    const [form] = Form.useForm<UpdateMyProfileRequest>();
    const [userForm] = Form.useForm<UpdateProfileRequest>();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 每次打开时回填当前值
    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                addressLine1: profile.addressLine1 ?? '',
                addressLine2: profile.addressLine2 ?? '',
                city: profile.city ?? '',
                state: profile.state ?? '',
                zipCode: profile.zipCode ?? '',
                country: profile.country ?? '',
            });
            setError(null);
        }
    }, [open, profile, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            setError(null);

            await updateMyProfile(values);

            message.success(t('profile.updateSuccess'));
            onSuccess();
            onClose();
        } catch (e) {
            if (e instanceof BackendError) {
                setError(e.message);
            }
            else {
                setError("Unknown Error");
            }
        } finally {
            setSaving(false);
        }
    };

    const kycValue = (value: string | null) =>
        value || <Text type="secondary">{t('profile.notProvided')}</Text>;

    const kycLock = (
        <Tooltip title={t('profile.kycTooltip')}>
            <LockOutlined style={{ color: '#8c8c8c', marginLeft: 4 }} />
        </Tooltip>
    );


    return (
        <Modal
            title={t('profile.edit')}
            open={open}
            onOk={handleSave}
            onCancel={onClose}
            confirmLoading={saving}
            okText={t('profile.save')}
            cancelText={t('common.cancel')}
            destroyOnHidden
            width={560}
        >
            {error && (
                <Alert
                    type="error"
                    showIcon
                    closable={{onClose: () =>  setError(null)}}
                    title={error}
                    style={{ marginBottom: 16 }}
                />
            )}

            {/* KYC 字段：只读展示 */}
            <div style={{ marginBottom: 20 }}>
                <Text strong style={{ fontSize: 13, color: '#8c8c8c' }}>
                    {t('profile.sectionIdentity')}
                </Text>
                <Descriptions
                    column={2}
                    colon={false}
                    size="small"
                    style={{ marginTop: 8 }}
                >
                    <Descriptions.Item label={<>{t('profile.firstName')} {kycLock}</>}>
                        {kycValue(profile.firstName)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<>{t('profile.lastName')} {kycLock}</>}>
                        {kycValue(profile.lastName)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<>{t('profile.phone')} {kycLock}</>}>
                        {kycValue(profile.phone)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<>{t('profile.birthDate')} {kycLock}</>}>
                        {kycValue(profile.birthDate)}
                    </Descriptions.Item>
                </Descriptions>
            </div>

            {/* 地址字段：可编辑 */}
            <Text strong style={{ fontSize: 13, color: '#8c8c8c', display: 'block', marginBottom: 12 }}>
                {t('profile.sectionAddress')}
            </Text>
            <Form form={form} layout="vertical" size="middle">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="addressLine1" label={t('profile.addressLine1')}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="addressLine2" label={t('profile.addressLine2')}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="city" label={t('profile.city')}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="state" label={t('profile.state')}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="zipCode" label={t('profile.zipCode')}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="country" label={t('profile.country')}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
import { useState } from 'react';
import {
    Modal, Form, Input, Alert, Steps, Button, message,
} from 'antd';
import { MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { requestEmailChange, confirmEmailChange } from '../../api/profile';
import { BackendError } from '../../api/client';
import { useAuthStore } from '../../stores/authStore';
import { toAuthUser } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

interface Props {
    open: boolean;
    onClose: () => void;
    currentEmail: string;
}

export function EmailChangeModal({ open, onClose, currentEmail }: Props) {

    const navigate = useNavigate();
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const { t } = useTranslation();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailForm] = Form.useForm<{ newEmail: string }>();
    const [codeForm] = Form.useForm<{ code: string }>();
    const [pendingEmail, setPendingEmail] = useState('');

    const resetAll = () => {
        setStep(0);
        setError(null);
        setLoading(false);
        setPendingEmail('');
        emailForm.resetFields();
        codeForm.resetFields();
    };

    const handleClose = () => {
        resetAll();
        onClose();
    };

    const handleSendCode = async () => {
        try {
            const { newEmail } = await emailForm.validateFields();
            setLoading(true);
            setError(null);
            await requestEmailChange(newEmail);
            setPendingEmail(newEmail);
            setStep(1);
        } catch (e) {
            if (e instanceof BackendError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        try {
            const { code } = await codeForm.validateFields();
            setLoading(true);
            setError(null);

            const authResponse = await confirmEmailChange(code);
            setAuth(toAuthUser(authResponse), authResponse.accessToken);
            
            message.success(t('profile.email.success'));
            clearAuth();

            // redirect to /login
            navigate('/login', {
                replace: true,
                state: {
                  message: 'Your email has been updated. Please log in again.',
                },
            });

            handleClose();
        } catch (e) {
            if (e instanceof BackendError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t('profile.changeEmail')}
            open={open}
            onCancel={handleClose}
            footer={null}
            destroyOnHidden
            width={480}
        >
            <Steps
                current={step}
                size="small"
                style={{ marginBottom: 24 }}
                items={[
                    { title: t('profile.email.stepRequest'), icon: <MailOutlined /> },
                    { title: t('profile.email.stepConfirm'), icon: <SafetyCertificateOutlined /> },
                ]}
            />

            {error && (
                <Alert
                    type="error"
                    showIcon
                    title={error}
                    closable={{ onClose:() => setError(null)}}
                    style={{ marginBottom: 16 }}
                />
            )}

            {step === 0 && (
                <Form form={emailForm} layout="vertical">
                    <Form.Item
                        name="newEmail"
                        label={t('profile.email.newEmailLabel')}
                        rules={[
                            { required: true, message: t('profile.email.newEmailRequired') },
                            { type: 'email', message: t('profile.email.newEmailInvalid') },
                        ]}
                    >
                        <Input
                            placeholder={t('profile.email.newEmailPlaceholder')}
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>
                    <Button type="primary" onClick={handleSendCode} loading={loading} block>
                        {t('profile.email.sendCode')}
                    </Button>
                </Form>
            )}

            {step === 1 && (
                <Form form={codeForm} layout="vertical">
                    <Alert
                        type="info"
                        showIcon
                        title={t('profile.email.codeSent', { email: pendingEmail })}
                        style={{ marginBottom: 16 }}
                    />
                    <Form.Item
                        name="code"
                        label={t('profile.email.codeLabel')}
                        rules={[{ required: true, message: t('profile.email.codeRequired') }]}
                    >
                        <Input
                            placeholder={t('profile.email.codePlaceholder')}
                            prefix={<SafetyCertificateOutlined />}
                            maxLength={6}
                        />
                    </Form.Item>
                    <Button type="primary" onClick={handleConfirm} loading={loading} block>
                        {t('profile.email.confirm')}
                    </Button>
                </Form>
            )}
        </Modal>
    );
}

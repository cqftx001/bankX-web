import { useEffect, useState } from 'react';
import { Modal, Form, Select, Alert, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { withdraw } from '../../api/transaction';
import { BackendError } from '../../api/client';
import { generateIdempotencyKey } from '../../utils/idempotency';
import { TransactionFormFields } from './TransactionFormFields';
import type { AccountVo } from '../../types/account';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accounts: AccountVo[];
}

interface FormValues {
    accountId: string;
    amount: number;
    description?: string;
}

export function WithdrawModal({ open, onClose, onSuccess, accounts }: Props) {
    const { t } = useTranslation();
    const [form] = Form.useForm<FormValues>();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [idempotencyKey, setIdempotencyKey] = useState(() => generateIdempotencyKey());

    useEffect(() => {
        if (open) {
            setIdempotencyKey(generateIdempotencyKey());
            setSubmitError(null);
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // 前端余额校验
            // 注意：这只是 UX 优化（即时反馈），后端必须再校验一次
            // —— 不能信任前端的任何校验
            const account = accounts.find((a) => a.id === values.accountId);
            if (account && values.amount > account.balance) {
                setSubmitError(
                    // keep 2 digits
                    `Insufficient balance. Available: $${account.balance.toFixed(2)}`
                );
                return;
            }

            setSubmitting(true);
            setSubmitError(null);

            await withdraw({
                fromAccountId: values.accountId,
                amount: values.amount,
                currency: 'USD',
                description: values.description,
                idempotencyKey,
            });

            message.success(t('transaction.modal.success'));
            onSuccess();
            onClose();
        } catch (e) {
            if (e instanceof BackendError) {
                setSubmitError(e.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE');

    return (
        <Modal
            title={t('transaction.modal.withdrawTitle')}
            open={open}
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={submitting}
            okText={t('transaction.modal.submit')}
            cancelText={t('common.cancel')}
            destroyOnHidden
        >
            {submitError && (
                <Alert
                    type="error"
                    showIcon
                    title={submitError}
                    closable={{onClose: () => setSubmitError(null)}}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form form={form} layout="vertical">
                <Form.Item
                    name="accountId"
                    label={t('transaction.modal.accountLabel')}
                    rules={[{ required: true, message: t('transaction.modal.accountRequired') }]}
                >
                    <Select
                        placeholder={t('transaction.modal.accountPlaceholder')}
                        options={activeAccounts.map((a) => ({
                            value: a.id,
                            label: `${a.accountType} · ${a.accountNumber} · $${a.balance.toFixed(2)}`,
                        }))}
                    />
                </Form.Item>

                <TransactionFormFields />
            </Form>
        </Modal>
    );
}
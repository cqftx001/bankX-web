import { useEffect, useState } from 'react';
import { Modal, Form, Select, Alert, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { transfer } from '../../api/transaction';
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
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string;
}

export function TransferModal({ open, onClose, onSuccess, accounts }: Props) {
    const { t } = useTranslation();
    const [form] = Form.useForm<FormValues>();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [idempotencyKey, setIdempotencyKey] = useState(() => generateIdempotencyKey());

    const fromAccountId = Form.useWatch('fromAccountId', form);

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

            // 同账户校验（前端兜底，后端也会拒绝）
            if (values.fromAccountId === values.toAccountId) {
                setSubmitError(t('transaction.modal.sameAccountError'));
                return;
            }

            // 余额校验
            const fromAccount = accounts.find((a) => a.id === values.fromAccountId);
            if (fromAccount && values.amount > fromAccount.balance) {
                setSubmitError(
                    `Insufficient balance. Available: $${fromAccount.balance.toFixed(2)}`
                );
                return;
            }

            setSubmitting(true);
            setSubmitError(null);

            await transfer({
                fromAccountId: values.fromAccountId,
                toAccountId: values.toAccountId,
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
    const toAccountOptions = activeAccounts
    .filter((a) => a.id !== fromAccountId)
    .map((a) => ({
        value: a.id,
        label: `${a.accountType} · ${a.accountNumber} · $${a.balance.toFixed(2)}`,
    }));

    return (
        <Modal
            title={t('transaction.modal.transferTitle')}
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
                    closable={{onClose:() => setSubmitError(null)}}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form form={form} layout="vertical">
                <Form.Item
                    name="fromAccountId"
                    label={t('transaction.modal.fromAccountLabel')}
                    rules={[{ required: true, message: t('transaction.modal.accountRequired') }]}
                >
                    <Select
                        placeholder={t('transaction.modal.accountPlaceholder')}
                        options={activeAccounts.map((a) => ({
                            value: a.id,
                            label: `${a.accountType} · ${a.accountNumber} · $${a.balance.toFixed(2)}`,
                        }))}
                        onChange={() => {
                            // 切换 from 账户时，清空 to 字段（避免 to == from 的尴尬状态）
                            form.setFieldValue('toAccountId', undefined);
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="toAccountId"
                    label={t('transaction.modal.toAccountLabel')}
                    rules={[{ required: true, message: t('transaction.modal.accountRequired') }]}
                >
                    <Select
                        placeholder={t('transaction.modal.toAccountPlaceholder')}
                        options={toAccountOptions}
                        disabled={!fromAccountId}
                    />
                </Form.Item>

                <TransactionFormFields />
            </Form>
        </Modal>
    );
}

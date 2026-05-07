// src/components/transaction/TransactionFilterPanel.tsx

import { useState } from 'react';
import {
    Drawer, Form, Select, DatePicker, InputNumber, Button, Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs, { type Dayjs } from 'dayjs';

import type { AccountVo } from '../../types/account';
import type {
    TransactionSearchRequest,
    TransactionType,
    TransactionStatus,
} from '../../types/transaction';

const { RangePicker } = DatePicker;

/**
 * 表单内部的字段类型 —— 和后端 DTO 不完全一样：
 *   - 后端要 startDate / endDate 两个字符串
 *   - 表单用 RangePicker，单个 [Dayjs, Dayjs] 字段更自然
 *
 * 提交时再展开成两个字段。
 */
interface FilterFormValues {
    accountId?: string;
    type?: TransactionType;
    status?: TransactionStatus;
    dateRange?: [Dayjs, Dayjs];
    minAmount?: number;
    maxAmount?: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    /** 当前已应用的筛选条件，用于面板打开时回填 */
    currentFilters: TransactionSearchRequest;
    /** 用户点击 Apply 时回调，父组件用新条件去查询 */
    onApply: (filters: TransactionSearchRequest) => void;
    /** 账户下拉选项 */
    accounts: AccountVo[];
}

export function TransactionFilterPanel({
    open, onClose, currentFilters, onApply, accounts,
}: Props) {
    const { t } = useTranslation();
    const [form] = Form.useForm<FilterFormValues>();

    // 面板每次打开时把当前筛选条件回填进去
    // 用 useState + open 变化来同步，避免初始值固定的问题
    const [initialized, setInitialized] = useState(false);
    if (open && !initialized) {
        form.setFieldsValue({
            accountId: currentFilters.accountId,
            type: currentFilters.type,
            status: currentFilters.status,
            dateRange:
                currentFilters.startDate && currentFilters.endDate
                    ? [dayjs(currentFilters.startDate), dayjs(currentFilters.endDate)]
                    : undefined,
            minAmount: currentFilters.minAmount,
            maxAmount: currentFilters.maxAmount,
        });
        setInitialized(true);
    }
    if (!open && initialized) {
        setInitialized(false);
    }

    const handleApply = async () => {
        const values = await form.validateFields();

        const result: TransactionSearchRequest = {
            accountId: values.accountId,
            type: values.type,
            status: values.status,
            minAmount: values.minAmount,
            maxAmount: values.maxAmount,
            // RangePicker 转成 ISO date 字符串
            startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
            endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
        };

        onApply(result);
        onClose();
    };

    const handleClear = () => {
        form.resetFields();
        onApply({});
        onClose();
    };

    return (
        <Drawer
            title={t('transaction.filter')}
            open={open}
            onClose={onClose}
            width={360}
            footer={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button onClick={handleClear}>{t('transaction.filterClear')}</Button>
                    <Button type="primary" onClick={handleApply}>
                        {t('transaction.filterApply')}
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical">
                <Form.Item name="accountId" label={t('transaction.filterAccount')}>
                    <Select
                        allowClear
                        placeholder={t('transaction.filterAccountPlaceholder')}
                        options={accounts.map((a) => ({
                            value: a.id,
                            label: `${a.accountType} · ${a.accountNumber}`,
                        }))}
                    />
                </Form.Item>

                <Form.Item name="type" label={t('transaction.filterType')}>
                    <Select
                        allowClear
                        placeholder={t('transaction.filterTypePlaceholder')}
                        options={[
                            { value: 'DEPOSIT',  label: t('transaction.type.DEPOSIT') },
                            { value: 'WITHDRAW', label: t('transaction.type.WITHDRAW') },
                            { value: 'TRANSFER', label: t('transaction.type.TRANSFER') },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="status" label={t('transaction.filterStatus')}>
                    <Select
                        allowClear
                        placeholder={t('transaction.filterStatusPlaceholder')}
                        options={[
                            { value: 'PENDING',   label: t('transaction.status.PENDING') },
                            { value: 'COMPLETED', label: t('transaction.status.COMPLETED') },
                            { value: 'FAILED',    label: t('transaction.status.FAILED') },
                            { value: 'REVERSED',  label: t('transaction.status.REVERSED') },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="dateRange" label={t('transaction.filterDateRange')}>
                    <RangePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="minAmount" label={t('transaction.filterAmountMin')}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        precision={2}
                        prefix="$"
                    />
                </Form.Item>

                <Form.Item name="maxAmount" label={t('transaction.filterAmountMax')}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        precision={2}
                        prefix="$"
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
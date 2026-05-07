// src/pages/TransactionListPage.tsx

import { useState, useCallback, useEffect } from 'react';
import {
    Button, Typography, Alert, Spin, Empty, Pagination, Space,
} from 'antd';
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    SwapOutlined,
    FilterOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { DepositModal } from '../components/transaction/DepositModal';
import { WithdrawModal } from '../components/transaction/WithdrawModal';
import { TransferModal } from '../components/transaction/TransferModal';
import { searchMyTransactions } from '../api/transaction';
import { getMyAccounts } from '../api/account';
import { useApiQuery } from '../hooks/useApiQuery';
import { TransactionCard } from '../components/transaction/TransactionCard';
import { TransactionFilterPanel } from '../components/transaction/TransactionFilterPanel';
import type { TransactionSearchRequest } from '../types/transaction';

const { Title } = Typography;

// Modal 类型：用 union type 表示三种 + 关闭
type ModalKind = null | 'deposit' | 'withdraw' | 'transfer';

export function TransactionListPage() {
    const { t } = useTranslation();

    // ── 分页 + 筛选状态 ──────────────────────────────
    // page 用 1-based 给 UI 显示，发请求时 -1 转 0-based 给后端
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [filters, setFilters] = useState<TransactionSearchRequest>({});

    // ── 筛选面板开关 ──────────────────────────────────
    const [filterOpen, setFilterOpen] = useState(false);

    // ── 三个操作 Modal ────────────────────────────────
    // Step 3 才会真正实现，这里先占位
    const [modalKind, setModalKind] = useState<ModalKind>(null);

    // ── 加载账户列表（筛选 + Modal 都要用）────────────
    const {
        data: accounts,
    } = useApiQuery(
        useCallback((signal: AbortSignal) => getMyAccounts(signal), [])
    );

    // ── 加载交易记录 ──────────────────────────────────
    // fetcher 依赖 page/pageSize/filters，所以要把它们包进 useCallback 依赖
    const fetcher = useCallback(
        (signal: AbortSignal) =>
            searchMyTransactions(
                filters,
                { page: page - 1, size: pageSize },
                signal,
            ),
        [page, pageSize, filters],
    );

    const {
        data: pageResult,
        loading,
        error,
        refetch,
    } = useApiQuery(fetcher);

    // ── 筛选条件变化时回到第一页 ──────────────────────
    // 否则用户在第 5 页应用了筛选，新结果可能没有 5 页数据，会显示空
    useEffect(() => {
        setPage(1);
    }, [filters]);

    // 筛选条件计数（顶部按钮上显示个数 badge）
    const activeFilterCount = Object.values(filters).filter(
        (v) => v !== undefined && v !== null && v !== '',
    ).length;

    return (
        <div>
            {/* Demo 提示条 */}
            <Alert
                type="info"
                showIcon
                title={t('transaction.demoBannerTitle')}
                description={t('transaction.demoBannerDesc')}
                style={{ marginBottom: 16 }}
            />

            {/* 标题 + 操作按钮 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 12,
            }}>
                <Title level={3} style={{ margin: 0 }}>
                    {t('transaction.title')}
                </Title>
                <Space wrap>
                    <Button
                        icon={<PlusCircleOutlined />}
                        onClick={() => setModalKind('deposit')}
                    >
                        {t('transaction.deposit')}
                    </Button>
                    <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => setModalKind('withdraw')}
                    >
                        {t('transaction.withdraw')}
                    </Button>
                    <Button
                        type="primary"
                        icon={<SwapOutlined />}
                        onClick={() => setModalKind('transfer')}
                    >
                        {t('transaction.transfer')}
                    </Button>
                </Space>
            </div>

            {/* 筛选按钮 */}
            <div style={{ marginBottom: 16 }}>
                <Button
                    icon={<FilterOutlined />}
                    onClick={() => setFilterOpen(true)}
                >
                    {t('transaction.filter')}
                    {activeFilterCount > 0 && ` (${activeFilterCount})`}
                </Button>
            </div>

            {/* -- 加载 -- */}
            {loading && (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <Spin size="large" />
                </div>
            )}

            {/* -- 错误 -- */}
            {error && (
                <Alert
                title={t('transaction.loadFailed')}
                    description={error}
                    type="error"
                    showIcon
                    action={<Button onClick={refetch}>{t('common.retry')}</Button>}
                    style={{ marginBottom: 16 }}
                />
            )}

            {/* -- 空 -- */}
            {!loading && !error && pageResult?.items.length === 0 && (
                <Empty description={t('transaction.empty')} style={{ padding: 60 }} />
            )}

            {/* 交易卡片列表 */}
            {pageResult?.items.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
            ))}

            {/* 分页 */}
            {pageResult && pageResult.total > 0 && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={pageResult.total}
                        showSizeChanger
                        showTotal={(total) => `Total ${total}`}
                        onChange={(p, s) => {
                            setPage(p);
                            setPageSize(s);
                        }}
                    />
                </div>
            )}

            {/* 筛选面板 */}
            <TransactionFilterPanel
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                currentFilters={filters}
                onApply={setFilters}
                accounts={accounts ?? []}
            />

            {/* 三个操作 Modal */}
            <DepositModal
                open={modalKind === 'deposit'}
                onClose={() => setModalKind(null)}
                onSuccess={refetch}
                accounts={accounts ?? []}
            />
            <WithdrawModal
                open={modalKind === 'withdraw'}
                onClose={() => setModalKind(null)}
                onSuccess={refetch}
                accounts={accounts ?? []}
            />
            <TransferModal
                open={modalKind === 'transfer'}
                onClose={() => setModalKind(null)}
                onSuccess={refetch}
                accounts={accounts ?? []}
            />
        </div>
    );
}
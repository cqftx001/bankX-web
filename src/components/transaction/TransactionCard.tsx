import { Card, Tag, Typography, Space } from 'antd';
import {
    ArrowDownOutlined, ArrowUpOutlined, SwapOutlined, RollbackOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import type {
    TransactionVo,
    TransactionType,
    TransactionStatus,
} from '../../types/transaction';

const { Text } = Typography;

/**
 * 类型 → 图标 + 颜色映射
 *
 * 视觉编码逻辑：
 *   - DEPOSIT 绿色向下箭头（钱进来）
 *   - WITHDRAW 红色向上箭头（钱出去）
 *   - TRANSFER 蓝色双向箭头（账户间）
 *   - REVERSAL 灰色回退箭头（撤销操作）
 *
 */

const TYPE_VISUAL: Record<TransactionType, { icon: React.ReactNode; color: string }> = {
    DEPOSIT:  { icon: <ArrowDownOutlined />, color: '#52c41a' },
    WITHDRAW: { icon: <ArrowUpOutlined />,   color: '#ff4d4f' },
    TRANSFER: { icon: <SwapOutlined />,      color: '#1677ff' },
    REVERSAL: { icon: <RollbackOutlined />,  color: '#8c8c8c' },
};

const STATUS_COLOR: Record<TransactionStatus, string> = {
    PENDING:   'gold',
    COMPLETED: 'green',
    FAILED:    'red',
    REVERSED:  'purple',
    CANCELED:  'default',
    REFUNDED:  'cyan',
};

interface Props {
    transaction: TransactionVo;
}
export function TransactionCard({ transaction: tx }: Props) {
    const { t, i18n } = useTranslation();
    const visual = TYPE_VISUAL[tx.type];

    // 金额显示前缀：DEPOSIT 是 +，WITHDRAW 是 -，其他不显示符号
    // (TRANSFER 的方向取决于这个交易是从用户哪个账户的视角看，
    //  这里简化处理只显示绝对金额)
    const amountPrefix =
        tx.type === 'DEPOSIT' ? '+' :
        tx.type === 'WITHDRAW' ? '-' : '';

    const dateStr = new Date(tx.createdAt).toLocaleString(
        i18n.language === 'zh' ? 'zh-CN' : 'en-US',
        { dateStyle: 'medium', timeStyle: 'short'},
    );

    return (
        <Card
            hoverable
            styles={{ body: { padding: 16 } }}
            style={{ marginBottom: 12 }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* 左侧图标 */}
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: `${visual.color}15`,  // 15 = 8% 透明度
                        color: visual.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                    }}
                >
                    {visual.icon}
                </div>

                {/* 中间主信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 8,
                        marginBottom: 4,
                    }}>
                        <Text strong>{t(`transaction.type.${tx.type}`)}</Text>
                        <Text strong style={{ color: visual.color, fontSize: 16 }}>
                            {amountPrefix}${tx.amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Text>
                    </div>

                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                        {/* 账户信息：根据类型显示不同字段 */}
                        {tx.fromAccountNumber && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {t('transaction.fromAccount')}: {tx.fromAccountNumber}
                            </Text>
                        )}
                        {tx.toAccountNumber && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {t('transaction.toAccount')}: {tx.toAccountNumber}
                            </Text>
                        )}

                        {tx.description && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {tx.description}
                            </Text>
                        )}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 4,
                            flexWrap: 'wrap',
                            gap: 8,
                        }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {dateStr}
                            </Text>
                            <Tag color={STATUS_COLOR[tx.status]} style={{ margin: 0 }}>
                                {t(`transaction.status.${tx.status}`)}
                            </Tag>
                        </div>
                    </Space>
                </div>
            </div>
        </Card>
    );
}

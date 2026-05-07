import client from './client';
import type { PageResult, PageParams } from '../types/api';
import type {
    TransactionVo,
    TransactionSearchRequest,
    DepositRequest,
    WithdrawRequest,
    TransferRequest,
} from '../types/transaction';

// ── Customer self-service（/api/v1/me/transactions）─────────
export async function searchMyTransactions(
    filters: TransactionSearchRequest = {},
    paging: PageParams = {},
    signal?: AbortSignal,
): Promise<PageResult<TransactionVo>> {
    const params: Record<string, string | number> = {
        page: paging.page ?? 0,
        size: paging.size ?? 20,
        sort: paging.sort ?? 'createdAt,desc',
    };

    if (filters.accountId)  params.accountId  = filters.accountId;
    if (filters.startDate)  params.startDate  = filters.startDate;
    if (filters.endDate)    params.endDate    = filters.endDate;
    if (filters.type)       params.type       = filters.type;
    if (filters.status)     params.status     = filters.status;
    if (filters.minAmount != null) params.minAmount = filters.minAmount;
    if (filters.maxAmount != null) params.maxAmount = filters.maxAmount;

    const response = await client.get<PageResult<TransactionVo>>(
        '/api/v1/me/transactions',
        { params, signal },
    );
    return response.data;
}

/**
 * Get transaction history for a specific account.
 */
export async function getAccountTransactions(
    accountId: string,
    signal?: AbortSignal,
): Promise<TransactionVo[]> {
    const response = await client.get<TransactionVo[]>(
        `/api/v1/me/transactions/${accountId}`,
        { signal },
    );
    return response.data;
}

// ── Teller（/api/v1/teller/transactions）────────────────────
// 分页 + 动态筛选，和 customer 版复用同一套 filter 类型
export async function searchAllTransactions(
    filters: TransactionSearchRequest = {},
    paging: PageParams = {},
    signal?: AbortSignal,
): Promise<PageResult<TransactionVo>> {
    const params: Record<string, string | number> = {
        page: paging.page ?? 0,
        size: paging.size ?? 20,
        sort: paging.sort ?? 'createdAt,desc',
    };

    if (filters.accountId)  params.accountId  = filters.accountId;
    if (filters.startDate)  params.startDate  = filters.startDate;
    if (filters.endDate)    params.endDate    = filters.endDate;
    if (filters.type)       params.type       = filters.type;
    if (filters.status)     params.status     = filters.status;
    if (filters.minAmount != null) params.minAmount = filters.minAmount;
    if (filters.maxAmount != null) params.maxAmount = filters.maxAmount;

    const response = await client.get<PageResult<TransactionVo>>(
        '/api/v1/teller/transactions',
        { params, signal },
    );
    return response.data;
}

// ── Mutations（不传 AbortSignal，金融操作不应被取消）─────────
export async function deposit(payload: DepositRequest): Promise<TransactionVo> {
    const response = await client.post<TransactionVo>(
        '/api/v1/me/transactions/deposit',
        payload,
    );
    return response.data;
}

export async function withdraw(payload: WithdrawRequest): Promise<TransactionVo> {
    const response = await client.post<TransactionVo>(
        '/api/v1/me/transactions/withdraw',
        payload,
    );
    return response.data;
}

export async function transfer(payload: TransferRequest): Promise<TransactionVo> {
    const response = await client.post<TransactionVo>(
        '/api/v1/me/transactions/transfer',
        payload,
    );
    return response.data;
}
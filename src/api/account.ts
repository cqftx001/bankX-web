
import client from './client';
import type { AccountVo, CreateAccountRequest } from '../types/account';
import type { PageResult, PageParams } from '../types/api';
import type { AccountSearchParams } from '../types/account';

// ── Customer self-service（/api/v1/me/accounts）─────────────
// 不分页：单个用户最多十几个账户，全量返回更简单

export async function getMyAccounts(signal?: AbortSignal): Promise<AccountVo[]> {
    const response = await client.get<AccountVo[]>('/api/v1/me/accounts', { signal });
    return response.data;
}

export async function getAccountById(accountId: string, signal?: AbortSignal): Promise<AccountVo> {
    const response = await client.get<AccountVo>(`/api/v1/me/accounts/${accountId}`, { signal });
    return response.data;
}

// 创建/修改类操作通常不取消——保留旧签名
export async function createAccount(payload: CreateAccountRequest): Promise<AccountVo> {
    const response = await client.post<AccountVo>('/api/v1/me/accounts', payload);
    return response.data;
}

// ── Teller（/api/v1/teller/accounts）────────────────────────
// 分页 + 动态筛选：全行账户可能上万条

export async function searchAllAccounts(
    filters: AccountSearchParams = {},
    paging: PageParams = {},
    signal?: AbortSignal,
): Promise<PageResult<AccountVo>> {
    const params: Record<string, string | number> = {
        page: paging.page ?? 0,
        size: paging.size ?? 20,
        sort: paging.sort ?? 'createdAt,desc',
    };

    if (filters.accountType) params.accountType = filters.accountType;
    if (filters.accountStatus)      params.accountStatus      = filters.accountStatus;
    if (filters.currency)    params.currency     = filters.currency;
    if (filters.userId)      params.userId       = filters.userId;
    if (filters.startDate)   params.startDate    = filters.startDate;
    if (filters.endDate)     params.endDate      = filters.endDate;
    if (filters.minBalance != null) params.minBalance = filters.minBalance;
    if (filters.maxBalance != null) params.maxBalance = filters.maxBalance;

    const response = await client.get<PageResult<AccountVo>>(
        '/api/v1/teller/accounts',
        { params, signal },
    );
    return response.data;
}


// ── Admin / Manager ops ─────────────────────

export async function freezeAccount(accountId: string): Promise<AccountVo> {
    const response = await client.patch<AccountVo>(`/api/v1/manager/accounts/${accountId}/freeze`);
    return response.data;
}

export async function unfreezeAccount(accountId: string): Promise<AccountVo> {
    const response = await client.patch<AccountVo>(`/api/v1/admin/accounts/${accountId}/unfreeze`);
    return response.data;
}


export async function closeAccount(accountId: string): Promise<AccountVo> {
    const response = await client.patch<AccountVo>(`/api/v1/admin/accounts/${accountId}/close`);
    return response.data;
}

export async function uncloseAccount(accountId: string): Promise<AccountVo> {
    const response = await client.patch<AccountVo>(`/api/v1/admin/accounts/${accountId}/unclose`);
    return response.data;
}


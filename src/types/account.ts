/**
 * Account types — must match backend AccountType enum.
 */
export type AccountType = 'SAVING' | 'CHECKING' | 'CREDIT'

/**
 * Account status — must match backend AccountStatus enum.
 */
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED' | 'INACTIVE'

/**
 * Currency — must match backend CurrencyEnum.
 */
export type Currency = 'USD' | 'EUR' | 'CNY' | 'JPY' | 'CAD' | 'AUD';

/**
 * Account view object.
 * Mirrors com.bankx.demo.account.vo.AccountVo.
 */
export interface AccountVo {
    id: string;
    accountNumber: string;
    accountType: AccountType;
    balance: number;
    currency: Currency;
    status: AccountStatus;
    createdAt: string;
}

/**
 * Create account request.
 * Mirrors com.bankx.demo.account.dto.CreateAccountRequest.
 */
export interface CreateAccountRequest {
    accountType: AccountType;
}

export interface AccountSearchParams {
    accountType?: AccountType;
    accountStatus?: AccountStatus;
    currency?: Currency;
    minBalance?: number;
    maxBalance?: number;
    userId?: string;
    startDate?: string;
    endDate?: string;
}
import type { Currency } from './account';

/**
 * Transaction types — must match backend TransactionType enum.
 */
export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'REVERSAL';

/**
 * Transaction status — must match backend TransactionStatus enum.
 */
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED' | 'CANCELED' | 'REFUNDED';

/**
 * Transaction view object.
 * Mirrors com.bankx.demo.transaction.vo.TransactionVo.
 *
 * Note: amount is always absolute (positive). The frontend determines
 * "incoming" vs "outgoing" by checking which account (from/to) belongs
 * to the user being viewed.
 */
export interface TransactionVo {
    id: string;
    transactionNumber: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: number;                  // always positive
    currency: Currency;
    balanceAfter: number;
    fromAccountId: string | null;    // null for DEPOSIT
    fromAccountNumber: string | null;
    toAccountId: string | null;      // null for WITHDRAW
    toAccountNumber: string | null;
    description: string | null;
    createdAt: string;
  }

/**
 * Search filters for the transaction list.
 * Mirrors com.bankx.demo.transaction.dto.TransactionSearchRequest.
 *
 * All fields are optional — empty fields are not applied to the query.
 */
export interface TransactionSearchRequest {
    accountId?: string;
    startDate?: string;              // ISO date "YYYY-MM-DD"
    endDate?: string;                // ISO date "YYYY-MM-DD"
    type?: TransactionType;
    status?: TransactionStatus;
    minAmount?: number;
    maxAmount?: number;
  }

/**
 * Deposit request.
 */
export interface DepositRequest {
    toAccountId: string;
    amount: number;
    currency: Currency;
    description?: string;
    idempotencyKey: string;
}

/**
 * Withdraw request.
 */
export interface WithdrawRequest {
    fromAccountId: string;
    amount: number;
    currency: Currency;
    description?: string;
    idempotencyKey: string;
}

/**
 * Transfer request.
 */
export interface TransferRequest {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    currency: Currency;
    description?: string;
    idempotencyKey: string;
} 
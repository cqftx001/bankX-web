/**
 * Standard backend response envelope.
 * Mirrors com.bankx.demo.common.base.ResponseResult<T>.
 *
 * Code "0000" means success; any other code is an error.
 */
export interface ResponseResult<T> {
    code: string;
    message: string;
    data: T;
    timestamp: string;
    requestId: string;
  }

/**
 * Standard pagination response.
 * Mirrors com.bankx.demo.common.base.PageResult<T>.
 *
 * Note: pageNumber is 1-based (NOT 0-based like Spring Data internally).
 */

export interface PageResult<T> {
    items: T[];
    pageNumber: number; // 1-based
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    firstPage: boolean;
    lastPage: boolean;
}

/**
 * Standard pagination request parameters.
 * Spring Data binds these from query string: ?page=0&size=20&sort=field,direction
 *
 * Note: page is 0-based on the wire (Spring Data convention),
 *       even though our PageResult.pageNumber is 1-based.
 */
export interface PageParams{
    page?: number;
    size?: number;
    sort?: string;
}
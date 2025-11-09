export interface ApiResult<T = any> {
    isSucceeded: boolean;
    statusCode?: number;
    message?: string;
    errors?: string[];
    data: T[];
    singleData: T;
    totalRecords: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  }
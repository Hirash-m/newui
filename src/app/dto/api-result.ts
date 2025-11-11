// src/app/dto/api-result.ts
export interface ApiResult<T = any> {
  isSucceeded: boolean;
  message?: string;
  statusCode?: number;
  errors?: string[];
  data?: T;
  totalRecords?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const createApiResult = <T>(): ApiResult<T> => ({
  isSucceeded: false,
  data: undefined,
});
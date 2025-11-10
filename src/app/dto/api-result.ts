// src/app/dto/api-result.ts

export interface ApiResult<T = any> {
  isSucceeded: boolean;
  message?: string;
  statusCode?: number;
  errors?: string[];

  // فقط یک فیلد: data
  // می‌تونه T یا T[] باشه
  data?: T | T[];

  totalRecords?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
}

// Factory
export const createApiResult = <T>(): ApiResult<T> => ({
  isSucceeded: false,
  data: undefined,
  totalRecords: undefined,
  totalPages: undefined,
  pageNumber: undefined,
  pageSize: undefined,
});
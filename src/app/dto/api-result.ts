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

export const ApiResult = {
  Success: <T>(data: T, message?: string): ApiResult<T> => ({
    isSucceeded: true,
    data,
    message,
    statusCode: 200
  }),
  Failed: (message: string = 'خطا', errors?: string[]): ApiResult<any> => ({
    isSucceeded: false,
    message,
    errors,
    statusCode: 400
  })
};
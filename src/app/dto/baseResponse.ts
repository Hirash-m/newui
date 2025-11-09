// src/app/dto/baseResponse.ts
export class baseResponse<T> {
    isSucceeded!: boolean;
    message?: string;
    data!: T[];
    singleData!:T;
    totalRecords!: number;
    totalPages!: number;
    pageNumber!: number;
    pageSize!: number;
}

// result.helper.ts

import { 
    StatusResult, 
    SingleDataResult, 
    ListDataResult, 
    FileResult, 
    ResultStatusEnum
} from '../dto/result';

export class ResultHelper {
    
    // ساخت نتیجه موفق با داده
    static ok<T>(data: T, messages: string[] | null = null): SingleDataResult<T> {
        return {
            status: ResultStatusEnum.Accepted,
            messages: messages || [],
            isSuccess: true,
            singleData: data
        };
    }

    // ساخت نتیجه موفق بدون داده
    static okWithoutData(messages: string[] | null = null): SingleDataResult<null> {
        return {
            status: ResultStatusEnum.Accepted,
            messages: messages || [],
            isSuccess: true,
            singleData: null
        };
    }

    // ساخت نتیجه خطا
    static error<T = null>(message: string, status: number = 400): SingleDataResult<T> {
        return {
            status: status,
            messages: [message],
            isSuccess: false,
            singleData: null
        };
    }

    // ساخت نتیجه خطا با چند پیام
    static errorWithMessages<T = null>(messages: string[], status: number = 400): SingleDataResult<T> {
        return {
            status: status,
            messages: messages,
            isSuccess: false,
            singleData: null
        };
    }

    // ساخت نتیجه لیستی
    static okList<T>(
        listData: T[], 
        totalRecords: number, 
        pageNumber: number, 
        pageSize: number,
        messages: string[] | null = null
    ): ListDataResult<T> {
        const totalPages = Math.ceil(totalRecords / pageSize);
        
        return {
            status: ResultStatusEnum.Success,
            messages: messages || [],
            isSuccess: true,
            Data: listData,
            totalRecords: totalRecords,
            totalPages: totalPages,
            pageNumber: pageNumber,
            pageSize: pageSize
        };
    }

    // ساخت نتیجه لیستی خالی
    static emptyList<T>(
        pageNumber: number = 1, 
        pageSize: number = 10,
        messages: string[] | null = null
    ): ListDataResult<T> {
        return {
            status: ResultStatusEnum.Success,
            messages: messages || [],
            isSuccess: true,
             
            Data: [],
            totalRecords: 0,
            totalPages: 0,
            pageNumber: pageNumber,
            pageSize: pageSize
        };
    }

    // ساخت نتیجه فایل
    static fileOk(filePath: string, messages: string[] | null = null): FileResult {
        const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown';
        
        return {
            status: ResultStatusEnum.Success,
            messages: messages || [],
            isSuccess: true,
             
            filePath: filePath,
            fileName: fileName
        };
    }

    // ساخت نتیجه فایل خطا
    static fileError(filePath: string, message: string, status: number = 400): FileResult {
        const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown';
        
        return {
            status: status,
            messages: [message],
            isSuccess: false,
            filePath: filePath,
            fileName: fileName
        };
    }

    // ساخت نتیجه سفارشی
    static custom<T>(
        status: number, 
        messages: string[] | null, 
        data: T | null = null
    ): SingleDataResult<T> {
        return {
            status: status,
            messages: messages || [],
            isSuccess: status >= 200 && status < 300,

            singleData: data
        };
    }

    // ساخت نتیجه سفارشی برای لیست
    static customList<T>(
        status: number,
        messages: string[] | null,
        listData: T[] | null,
        totalRecords: number,
        pageNumber: number,
        pageSize: number
    ): ListDataResult<T> {
        const totalPages = Math.ceil(totalRecords / pageSize);
        
        return {
            status: status,
            messages: messages || [],
            isSuccess: status >= 200 && status < 300,
            Data: listData,
            totalRecords: totalRecords,
            totalPages: totalPages,
            pageNumber: pageNumber,
            pageSize: pageSize
        };
    }

    // متد کمکی برای تبدیل ارور به نتیجه
    static fromError<T = null>(error: any): SingleDataResult<T> {
        const message = error?.error?.message || error?.message || 'خطای ناشناخته رخ داده است';
        const status = error?.status || 500;
        
        return this.error(message, status);
    }

    // متد کمکی برای لاگ کردن نتیجه
    static log(result: StatusResult): void {
        if (result.isSuccess) {
            console.log('✅ Success:', result.messages);
        } else {
            console.error('❌ Error:', result.messages);
        }
    }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ResultStatusEnum,
  StatusResult, 
    SingleDataResult, 
    ListDataResult, 
    FileResult 
} from 'src/app/dto/result';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts = signal<ToastData[]>([]);

  // تنظیمات پیش‌فرض
  private defaults = {
    success: { title: 'عملیات موفق', duration: 4000 },
    error: { title: 'خطا', duration: 6000 },
    warning: { title: 'اخطار', duration: 5000 },
    info: { title: 'اطلاعات', duration: 4000 },
  };

  // متد اصلی نمایش Toast
  private show(type: ToastType, message: string, title?: string, duration?: number): void {
    const id = this.counter++;
    const config = this.defaults[type];

    const toast: ToastData = {
      id,
      type,
      title: title ?? config.title,
      message,
      duration: duration ?? config.duration,
    };

    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.remove(id), toast.duration);
  }

  // متدهای عمومی
  success(message: string, title?: string): void {
    this.show('success', message, title);
  }

  error(message: string, title?: string): void {
    this.show('error', message, title);
  }

  warning(message: string, title?: string): void {
    this.show('warning', message, title);
  }

  info(message: string, title?: string): void {
    this.show('info', message, title);
  }

  remove(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  removeToast(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  // --- هندل کردن SingleDataResult ---
  handleSingleResult<T>(result: SingleDataResult<T>): void {
    if (result.isSuccess) {
      if (result.messages && result.messages.length > 0) {
        // اگر چند پیام داریم، اولین پیام را نشان بده
        this.success(result.messages[0]);
      }
      // اگر messages خالی بود → هیچ توستی نمایش داده نمی‌شود
    } else {
      this.handleErrorResult(result);
    }
  }

  // --- هندل کردن ListDataResult ---
  handleListResult<T>(result: ListDataResult<T>): void {
    if (result.isSuccess) {
      if (result.messages && result.messages.length > 0) {
        this.success(result.messages[0]);
      }
    } else {
      this.handleErrorResult(result);
    }
  }

  // --- هندل کردن FileResult ---
  handleFileResult(result: FileResult): void {
    if (result.isSuccess) {
      if (result.messages && result.messages.length > 0) {
        this.success(result.messages[0]);
      }
    } else {
      this.handleErrorResult(result);
    }
  }

  // --- هندل کردن通用的 StatusResult ---
  handleResult(result: StatusResult): void {
    if (result.isSuccess) {
      if (result.messages && result.messages.length > 0) {
        this.success(result.messages[0]);
      }
    } else {
      this.handleErrorResult(result);
    }
  }

  // --- هندل کردن خطاهای Result ---
  private handleErrorResult(result: StatusResult): void {
    // گرفتن پیام‌ها از بک‌اند
    const messages = result.messages ?? [];
    
    // اگر چندتا پیام خطا داریم، همه رو با join کنار هم میذاریم
    const message = messages.length > 0 
      ? messages.join(' - ')  // یا میتونی از '<br>' استفاده کنی برای HTML
      : 'خطایی رخ داد.';
    
    const status = result.status;
  
    // هندل کردن انواع خطاها بر اساس status از بک‌اند
    switch (status) {
      // ========== Client Errors (۴xx معادل‌ها) ==========
      case ResultStatusEnum.BadRequest:
        this.error(message, 'درخواست نامعتبر');
        break;
        
      case ResultStatusEnum.ValidationFailed:
        this.error(message, 'خطای اعتبارسنجی');
        break;
        
      case ResultStatusEnum.NotFound:
        this.error(message, 'اطلاعات مورد نظر یافت نشد');
        break;
        
      case ResultStatusEnum.Unauthorized:
        this.warning(message, 'لطفاً مجدداً وارد شوید');
        break;
        
      case ResultStatusEnum.Forbidden:
        this.warning(message, 'شما دسترسی لازم را ندارید');
        break;
        
      case ResultStatusEnum.Conflict:
        this.warning(message, 'تداخل در اطلاعات');
        break;
      
      // ========== Server Errors (۵xx معادل‌ها) ==========
      case ResultStatusEnum.InternalError:
        this.error(message, 'خطای داخلی سرور');
        break;
        
      case ResultStatusEnum.ServiceUnavailable:
        this.error(message, 'سرویس در دسترس نیست');
        break;
        
      case ResultStatusEnum.DatabaseError:
        this.error(message, 'خطای پایگاه داده');
        break;
        
      case ResultStatusEnum.ThirdPartyError:
        this.error(message, 'خطا در ارتباط با سرویس‌های جانبی');
        break;
      
      // ========== Default ==========
      default:
        this.error(message);
        break;
    }
  }
  // --- نمایش تمام پیام‌های یک نتیجه (برای مواردی که چند پیام مهم دارند) ---
  handleAllMessages(result: StatusResult): void {
    if (result.messages && result.messages.length > 0) {
      if (result.isSuccess) {
        // برای موفقیت: همه پیام‌ها را نشان بده
        result.messages.forEach(msg => this.success(msg));
      } else {
        // برای خطا: همه پیام‌ها را با نوع error نشان بده
        result.messages.forEach(msg => this.error(msg));
      }
    }
  }

  // --- فقط خطاهای خام HTTP (بدون Result) ---
  handleHttpError(error: HttpErrorResponse): void {
    let message = 'خطای ارتباط با سرور';

    if (error.error instanceof ErrorEvent) {
      // خطای کلاینت
      message = `خطا: ${error.error.message}`;
    } else {
      // خطای سرور
      const status = error.status;
      const body = error.error;

      if (status === 0) {
        message = 'اتصال به سرور برقرار نیست.';
      } else if (status === 401) {
        message = 'لطفاً مجدداً وارد شوید.';
        this.warning(message, 'احراز هویت');
        return;
      } else if (status === 403) {
        message = 'شما دسترسی لازم را ندارید.';
        this.warning(message, 'دسترسی ممنوع');
        return;
      } else if (status === 404) {
        message = 'منبع مورد نظر یافت نشد.';
      } else if (status === 500) {
        message = 'خطای داخلی سرور.';
      } else if (body && typeof body === 'object' && 'message' in body) {
        message = (body as any).message;
      } else if (typeof body === 'string') {
        message = body;
      }
    }

    this.error(message);
  }

  // --- متد کمکی برای هندل کردن Promise-based نتایج ---
  async handleAsyncResult<T>(
    promise: Promise<SingleDataResult<T>>, 
    successMessage?: string
  ): Promise<SingleDataResult<T> | null> {
    try {
      const result = await promise;
      this.handleSingleResult(result);
      return result;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleHttpError(error);
      } else {
        this.error('خطای غیرمنتظره رخ داد');
      }
      return null;
    }
  }
}


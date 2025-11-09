// src/app/services/utilities/toast.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResult } from 'src/app/dto/api-result';

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
  // --- فقط پیام از ApiResult — بدون fallback محلی ---
  handleApiResponse<T>(result: ApiResult<T>): void {
    if (result.isSucceeded) {
      if (result.message) {
        this.success(result.message);
      }
      // اگر message نبود → هیچ توستی نمایش داده نمی‌شود
    } else {
      this.handleApiError(result);
    }
  }
  

  // --- هندل کردن خطاهای ApiResult با چک statusCode ایمن ---
  private handleApiError(result: ApiResult): void {
    const errors = result.errors ?? [];
    const message = errors.length > 0 ? errors[0] : result.message ?? 'خطایی رخ داد.';

    const status = result.statusCode;

    if (status === 401) {
      this.warning(message, 'احراز هویت');
    } else if (status === 403) {
      this.warning(message, 'دسترسی ممنوع');
    } else if (status != null && status >= 400 && status < 500) {
      this.error(message, 'خطای اعتبارسنجی');
    } else {
      this.error(message); // 500 یا بدون statusCode
    }
  }

  // --- فقط خطاهای خام HTTP (بدون ApiResult) ---
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
      } else if (status === 500) {
        message = 'خطای داخلی سرور.';
      } else if (status === 404) {
        message = 'منبع مورد نظر یافت نشد.';
      } else if (body && typeof body === 'object' && 'message' in body) {
        message = (body as any).message;
      } else if (typeof body === 'string') {
        message = body;
      }
    }

    this.error(message);
  
  
  }

  
}
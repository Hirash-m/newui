// toast.service.ts
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  duration?: number; // به میلی‌ثانیه
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts = signal<ToastData[]>([]);

  private defaultConfigs: Record<ToastType, { title: string; message: string; duration: number }> = {
    success: { title: 'عملیات موفق', message: 'با موفقیت انجام شد.', duration: 5000 },
    error: { title: 'خطا', message: 'مشکلی پیش آمده.', duration: 5000 },
    warning: { title: 'اخطار', message: 'لطفاً با دقت ادامه دهید.', duration: 5000 },
    info: { title: 'اطلاعات', message: 'یک پیام اطلاعاتی.', duration: 5000 },
  };

  // متد اصلی
  private pushToast(type: ToastType, overrides: Partial<Omit<ToastData, 'id' | 'type'>> = {}) {
    const id = this.counter++;
    const defaults = this.defaultConfigs[type];

    const toast: ToastData = {
      id,
      type,
      title: overrides.title ?? defaults.title,
      message: overrides.message ?? defaults.message,
      duration: overrides.duration ?? defaults.duration,
    };

    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.removeToast(id), toast.duration);
  }

  // ✅ توابع shortcut
  showToast = {
    success: (overrides?: Partial<Omit<ToastData, 'id' | 'type'>>) =>
      this.pushToast('success', overrides),
    error: (overrides?: Partial<Omit<ToastData, 'id' | 'type'>>) =>
      this.pushToast('error', overrides),
    warning: (overrides?: Partial<Omit<ToastData, 'id' | 'type'>>) =>
      this.pushToast('warning', overrides),
    info: (overrides?: Partial<Omit<ToastData, 'id' | 'type'>>) =>
      this.pushToast('info', overrides),
  };

  removeToast(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}

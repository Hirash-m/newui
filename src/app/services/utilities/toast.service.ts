import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastData | null>(null);
  toastState$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.toastSubject.next({ message, type });

    // بعد از ۳ ثانیه پیام رو پاک کن
    setTimeout(() => this.toastSubject.next(null), 3000);
  }
}

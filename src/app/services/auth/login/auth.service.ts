// src/app/services/auth/login/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastService } from '../../utilities/toast.service';
import { Domain } from '../../../../utilities/path';
import { ListDataResult, SingleDataResult} from 'src/app/dto/result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${Domain}/api/Auth`;

  // ذخیره پرمیشن‌ها
  private permissions = new BehaviorSubject<string[]>([]);
  public readonly permissions$ = this.permissions.asObservable();

  constructor(private http: HttpClient, private toast: ToastService) {
    this.loadPermissionsFromStorage();
  }

  private loadPermissionsFromStorage(): void {
    const stored = localStorage.getItem('permissions');
    if (stored) {
      this.permissions.next(JSON.parse(stored)); // اینجا اصلاح شد: داخل بلاک if
    }
  }

// src/app/services/auth/login/auth.service.ts

login(username: string, password: string): Observable<any> {
  const body = { username, password };

  return this.http.post<SingleDataResult<any>>(`${this.apiUrl}/login`, body).pipe(
    tap(response => this.toast.handleSingleResult(response)),
    map(response => {
      if (response.isSuccess && response.singleData?.token) {
        // ذخیره در localStorage
        localStorage.setItem('token', response.singleData.token);
        localStorage.setItem('user', JSON.stringify(response.singleData));
        localStorage.setItem('token_expires_at', (Date.now() + 24*60*60*1000).toString());
        this.fetchPermissions();
      }
      return response;
    }),
    catchError(error => {
      this.toast.handleHttpError(error);
      return throwError(() => error);
    })
  );
}

getUserId(): number {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.warn('No user in localStorage');
    return 0;
  }

  try {
    const user = JSON.parse(userStr);
    console.log('Parsed user:', user); // برای دیباگ

    // ترتیب مهم است: اول user.userId، بعد data
    return user.userId || user.data?.userId || user.id || 0;
  } catch (e) {
    console.error('Failed to parse user:', e);
    return 0;
  }
}

  private fetchPermissions(): void {
    this.http.get<ListDataResult<string>>(`/api/user/permissions`).pipe(
      catchError(() => {
        this.toast.error('خطا در دریافت دسترسی‌ها');
        return of(null);
      })
    ).subscribe(res => {
      if (res?.data) {
        this.permissions.next(res.data);
        localStorage.setItem('permissions', JSON.stringify(res.data));
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.permissions.value.includes(permission);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    this.permissions.next([]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // متد برای بروزرسانی دستی (اختیاری)
  refreshPermissions(): void {
    this.fetchPermissions();
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ToastService } from '../../utilities/toast.service';
import { Domain } from '../../../../utilities/path';
import { baseResponse } from '../../../dto/baseResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${Domain}/api/Auth`;

  constructor(private http: HttpClient, private toast: ToastService) { }

  /** تابع لاگین */
  login(email: string, password: string): Observable<any> {
    const body = { email, password };

    return this.http.post<baseResponse<any>>(`${this.apiUrl}/login`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(response => {
        if (response.isSucceeded && response.singleData?.token) {
          // ذخیره توکن در localStorage
          localStorage.setItem('token', response.singleData.token);
          localStorage.setItem('user', JSON.stringify(response.singleData));
        }
        return response;
      }),
      catchError(error => {
        this.toast.error( 'خطا در ورود به سیستم' );
        return throwError(() => error);
      })
    );
  }

  /** خروج از سیستم */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /** بررسی لاگین بودن کاربر */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** گرفتن توکن ذخیره‌شده */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

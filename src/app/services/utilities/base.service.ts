// src/app/services/utilities/base.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { ApiResult } from '../../dto/api-result';
import { ListRequest } from '../../dto/ListRequestDto';
import { Domain } from '../../../utilities/path';

@Injectable({ providedIn: 'root' })
export abstract class BaseService<TViewDto, TCreateDto = TViewDto> {
  protected apiUrl = Domain;
  protected abstract endpoint: string;

  constructor(
    protected http: HttpClient,
    protected toast: ToastService
  ) {}

  protected getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  // لیست: همیشه TViewDto[]
  getRecords(request: ListRequest): Observable<ApiResult<TViewDto[]>> {
    return this.http
      .post<ApiResult<TViewDto[]>>(
        `${this.apiUrl}${this.endpoint}/GetAll`,
        request,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }



    // لیست: همیشه TViewDto[]
    getRecordList(): Observable<ApiResult<TViewDto[]>> {
      return this.http
        .get<ApiResult<TViewDto[]>>(
          `${this.apiUrl}${this.endpoint}/GetList`,
          
          { headers: this.getJsonHeaders() }
        )
        .pipe(catchError(err => this.handleError(err)));
    }
  
  // ایجاد
  insertRecord(data: TCreateDto): Observable<ApiResult<TCreateDto>> {
    return this.http
      .post<ApiResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/create`,
        data,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // ویرایش
  updateRecord(data: TCreateDto): Observable<ApiResult<TCreateDto>> {
    return this.http
      .post<ApiResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/update`,
        data,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // حذف چندتایی
  deleteRecords(ids: number[]): Observable<ApiResult<any>> {
    return this.http
      .post<ApiResult<any>>(
        `${this.apiUrl}${this.endpoint}/delete`,
        ids,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // دریافت یک رکورد
  getRecordById(id: number): Observable<ApiResult<TCreateDto>> {
    return this.http
      .get<ApiResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/getById/?id=${id}`,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // فرم ایجاد (مثل roles, permissions)
  getCreateForm<U = any>(): Observable<ApiResult<U>> {
    return this.http
      .get<ApiResult<U>>(
        `${this.apiUrl}${this.endpoint}/getcreateform`,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // --- خطا ---
  protected handleError(error: any): Observable<never> {
    // می‌تونی اینجا لاگ بزنی
    console.error('API Error:', error);
    return throwError(() => error);
  }

  // --- نمایش پیام ---
  protected showApiResultToast(result: ApiResult<any>): void {
    if (!result) return;

    if (result.isSucceeded) {
      if (result.message) {
        this.toast.success(result.message);
      }
    } else {
      const errorMsg = result.errors?.[0] ?? result.message ?? 'خطایی رخ داد';
      this.toast.error(errorMsg);
    }
  }
}
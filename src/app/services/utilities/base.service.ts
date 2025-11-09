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

  // --- CRUD Methods ---
  getRecords(request: ListRequest): Observable<ApiResult<TViewDto>> {
    return this.http
      .post<ApiResult<TViewDto>>(
        `${this.apiUrl}${this.endpoint}/GetAll`,
        request,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  insertRecord(data: TCreateDto): Observable<ApiResult<TCreateDto>> {
    return this.http
      .post<ApiResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/create`,
        data,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  updateRecord(data: TCreateDto): Observable<ApiResult<TCreateDto>> {
    return this.http
      .post<ApiResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/update`,
        data,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  deleteRecords(ids: number[]): Observable<ApiResult<any>> {
    return this.http
      .post<ApiResult<any>>(
        `${this.apiUrl}${this.endpoint}/delete`,
        ids,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  getRecordById(id: number): Observable<ApiResult<TCreateDto>> {
    return this.http
      .get<ApiResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/getById/?id=${id}`,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  getCreateForm<TForm>(): Observable<ApiResult<TForm>> {
    return this.http
      .get<ApiResult<TForm>>(
        `${this.apiUrl}${this.endpoint}/getcreateform`,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // --- فقط throw خطا — Toast در اینترسپتور ---
  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }

  // --- فقط نمایش پیام از ApiResult (بدون fallback) ---
  protected showApiResultToast(result: ApiResult<any>): void {
    if (result.isSucceeded) {
      if (result.message) {
        this.toast.success(result.message);
      }
      // اگر message نبود → هیچ توستی نمایش داده نمی‌شود
    } else {
      const errorMsg = result.errors?.[0] ?? result.message;
      if (errorMsg) {
        this.toast.error(errorMsg);
      }
    }
  }
}
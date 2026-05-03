// src/app/services/utilities/base.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { ListRequest } from '../../dto/ListRequestDto';
import { Domain } from '../../../utilities/path';
import { ListDataResult, SingleDataResult, StatusResult } from 'src/app/dto/result';

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
  getRecords(request: ListRequest): Observable<ListDataResult<TViewDto>> {
    return this.http
      .post<ListDataResult<TViewDto>>(
        `${this.apiUrl}${this.endpoint}/GetAll`,
        request,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }



    // لیست: همیشه TViewDto[]
    getRecordList(): Observable<ListDataResult<TViewDto>> {
      return this.http
        .get<ListDataResult<TViewDto>>(
          `${this.apiUrl}${this.endpoint}/GetList`,
          
          { headers: this.getJsonHeaders() }
        )
        .pipe(catchError(err => this.handleError(err)));
    }
  
  // ایجاد
  insertRecord(data: TCreateDto): Observable<SingleDataResult<TCreateDto>> {
    return this.http
      .post<SingleDataResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/create`,
        data,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // ویرایش
  updateRecord(data: TCreateDto): Observable<SingleDataResult<TCreateDto>> {
    return this.http
      .post<SingleDataResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/update`,
        data,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // حذف چندتایی
  deleteRecords(ids: number[]): Observable<StatusResult> {
    return this.http
      .post<StatusResult>(
        `${this.apiUrl}${this.endpoint}/delete`,
        ids,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // دریافت یک رکورد
  getRecordById(id: number): Observable<SingleDataResult<TCreateDto>> {
    return this.http
      .get<SingleDataResult<TCreateDto>>(
        `${this.apiUrl}${this.endpoint}/getById/?id=${id}`,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }

  // فرم ایجاد (مثل roles, permissions)
  getCreateForm<U = any>(): Observable<SingleDataResult<U>> {
    return this.http
      .get<SingleDataResult<U>>(
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
  protected showApiResultToast(result: SingleDataResult<any>): void {
    if (!result) return;

    if (result.status < 300) {
      if (result.messages) {
        this.toast.success(result.messages.join());
      }
    } else {
      const errorMsg = result.messages?.join()?.[0] ?? result.messages?.join() ?? 'خطایی رخ داد';
      this.toast.error(errorMsg);
    }
  }
}
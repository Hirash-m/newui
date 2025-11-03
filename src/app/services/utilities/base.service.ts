import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from './toast.service'; // فرض کنید این رو دارید
import { baseResponse } from '../../dto/baseResponse'; // نوع response عمومی
import { ListRequest } from '../../dto/ListRequestDto'; // نوع request لیست
import { Domain } from '../../../utilities/path'; // URL پایه

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<TViewDto, TCreateDto = TViewDto> { // generics برای نوع view و create
  protected apiUrl = Domain; // URL پایه
  protected abstract endpoint: string; // هر سرویس خاص این رو مشخص کنه (مثل '/api/User')

  constructor(protected http: HttpClient, protected toast: ToastService) {}

  protected getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  // متد عمومی برای لیست
  getRecords(request: ListRequest): Observable<baseResponse<TViewDto>> {
    return this.http.post<baseResponse<TViewDto>>(
      `${this.apiUrl}${this.endpoint}/GetAll`,
      request,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // متد عمومی برای ایجاد
  insertRecord(data: TCreateDto): Observable<baseResponse<TCreateDto>> {
    return this.http.post<baseResponse<TCreateDto>>(
      `${this.apiUrl}${this.endpoint}/create`,
      data,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // متد عمومی برای حذف
  deleteRecords(ids: number[]): Observable<baseResponse<any>> {
    return this.http.post<baseResponse<any>>(
      `${this.apiUrl}${this.endpoint}/delete`,
      ids,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // متد عمومی برای بروزرسانی
  updateRecord(data: TCreateDto): Observable<baseResponse<TCreateDto>> {
    return this.http.post<baseResponse<TCreateDto>>(
      `${this.apiUrl}${this.endpoint}/update`,
      data,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // متد عمومی برای دریافت تک رکورد
  getRecordById(id: number): Observable<baseResponse<TCreateDto>> {
    return this.http.get<baseResponse<TCreateDto>>(
      `${this.apiUrl}${this.endpoint}/getById/?id=${id}`,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // هندلر عمومی خطا
  protected handleError(error: any): Observable<never> {
    this.toast.showToast.error({ message: 'خطا در تراکنش' });
    return throwError(() => error);
  }


  getCreateForm<TForm>(): Observable<baseResponse<TForm>> {
    return this.http.get<baseResponse<TForm>>(
      `${this.apiUrl}${this.endpoint}/getcreateform`,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }
}
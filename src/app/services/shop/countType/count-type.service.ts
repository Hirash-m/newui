// Angular Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Shared & Utility Imports
import { ToastService } from '../../utilities/toast.service';
import { BaseService } from '../../utilities/base.service';
import { Domain } from 'src/utilities/path';

// DTO Imports
import { CountTypeDto } from './../../../dto/shop/CountTypeDto';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { baseResponse } from 'src/app/dto/baseResponse';

// RxJS Imports
import { catchError, Observable, throwError } from 'rxjs';


// ==========================================================================
// ⬇️ Service Definition: CountTypeService
// ==========================================================================
@Injectable({
  providedIn: 'root'
})
export class CountTypeService extends BaseService {

  // 🔧 API Base URL
  private apiurl = Domain;

  // 📦 Inject HTTP client and toast notification service
  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {
    super();
  }

  // ==========================================================================
  // 📥 Get List of Records
  // ==========================================================================
  getRecords(request: ListRequest): Observable<baseResponse<CountTypeDto>> {
    const requestPayload = request;

    return this.http.post<baseResponse<CountTypeDto>>(
      `${this.apiurl}/api/CountType/GetAll`,
      requestPayload,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: error });
        return throwError(() => error);
      })
    );
  }

  // ==========================================================================
  // ➕ Insert New Record
  // ==========================================================================
  insertRecord(insertData: CountTypeDto): Observable<baseResponse<CountTypeDto>> {
    return this.http.post<baseResponse<any>>(
      `${this.apiurl}/api/CountType/create`,
      insertData,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: error });
        return throwError(() => error);
      })
    );
  }

  // ==========================================================================
  // 🗑️ Delete Records by IDs
  // ==========================================================================
  deleteRecords(ids: number[]): Observable<baseResponse<any>> {
    return this.http.post<baseResponse<any>>(
      `${this.apiurl}/api/CountType/delete`,
      ids,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: error });
        return throwError(() => error);
      })
    );
  }

  // ==========================================================================
  // 📝 Update Existing Record
  // ==========================================================================
  updateRecord(updateData: CountTypeDto): Observable<baseResponse<CountTypeDto>> {
    return this.http.post<baseResponse<CountTypeDto>>(
      `${this.apiurl}/api/CountType/update`,
      updateData,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: error });
        return throwError(() => error);
      })
    );
  }

  // ==========================================================================
  // 🔍 Get Record By ID
  // ==========================================================================
  getRecordById(id: number): Observable<baseResponse<CountTypeDto>> {
    return this.http.get<baseResponse<CountTypeDto>>(
      `${this.apiurl}/api/CountType/getById/?id=${id}`,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: error });
        return throwError(() => error);
      })
    );
  }

}

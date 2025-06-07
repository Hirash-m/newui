import { Injectable } from '@angular/core';
import { BaseService } from '../../utilities/base.service';
import { Domain } from 'src/utilities/path';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../utilities/toast.service';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { catchError, Observable, throwError } from 'rxjs';
import { baseResponse } from 'src/app/dto/baseResponse';
import {InventoryDto} from 'src/app/dto/shop/InventoryDto'

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseService {

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
 
    getRecords(request: ListRequest): Observable<baseResponse<InventoryDto>> {
      const requestPayload = request;
  
      return this.http.post<baseResponse<InventoryDto>>(
        `${this.apiurl}/api/inv/GetAll`,
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
  insertRecord(insertData: InventoryDto): Observable<baseResponse<InventoryDto>> {
    return this.http.post<baseResponse<any>>(
      `${this.apiurl}/api/inv/create`,
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
      `${this.apiurl}/api/inv/delete`,
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
  updateRecord(updateData: InventoryDto): Observable<baseResponse<InventoryDto>> {
    return this.http.post<baseResponse<InventoryDto>>(
      `${this.apiurl}/api/inv/update`,
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
  getRecordById(id: number): Observable<baseResponse<InventoryDto>> {
    return this.http.get<baseResponse<InventoryDto>>(
      `${this.apiurl}/api/inv/getById/?id=${id}`,
      { headers: this.getJsonHeaders() }
    ).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: error });
        return throwError(() => error);
      })
    );
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Domain } from 'src/utilities/path';
import { ToastService } from '../../utilities/toast.service';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { catchError, Observable, throwError } from 'rxjs';
import { baseResponse } from 'src/app/dto/baseResponse';
import {UserCreateFormData, UserDto} from 'src/app/dto/base/UserDto';
import { BaseService } from '../../utilities/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserManageService  extends BaseService{

  
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
 
    getRecords(request: ListRequest): Observable<baseResponse<UserDto>> {
      const requestPayload = request;
  
      return this.http.post<baseResponse<UserDto>>(
        `${this.apiurl}/api/User/GetAll`,
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
  // 📥 Get template create fields
  // ==========================================================================
 
  getCreateForm(): Observable<baseResponse<UserCreateFormData>> {
    return this.http.get<baseResponse<UserCreateFormData>>(
        `${this.apiurl}/api/User/getcreateform`,
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
  insertRecord(insertData: UserDto): Observable<baseResponse<UserDto>> {
    return this.http.post<baseResponse<any>>(
      `${this.apiurl}/api/User/create`,
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
      `${this.apiurl}/api/User/delete`,
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
  updateRecord(updateData: UserDto): Observable<baseResponse<UserDto>> {
    return this.http.post<baseResponse<UserDto>>(
      `${this.apiurl}/api/User/update`,
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
  getRecordById(id: number): Observable<baseResponse<UserDto>> {
    var result = this.http.get<baseResponse<UserDto>>(
      `${this.apiurl}/api/User/getById/?id=${id}`,
      { headers: this.getJsonHeaders() }

    ).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: error });
        return throwError(() => error);
      })
    );
 console.log(result.subscribe.toString);
    return result ;
  }
}

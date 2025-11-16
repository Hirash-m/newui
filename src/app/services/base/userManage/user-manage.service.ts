// src/app/services/base/userManage/user-manage.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Domain } from 'src/utilities/path';
import { ToastService } from '../../utilities/toast.service';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { UserCreateFormData, UserDto } from 'src/app/dto/base/UserDto';
import { BaseService } from '../../utilities/base.service';
import { ApiResult } from 'src/app/dto/api-result';

@Injectable({
  providedIn: 'root'
})
export class UserManageService extends BaseService<UserDto, UserDto> {
  protected override endpoint = '/api/user';

  constructor(
    http: HttpClient,
    private toastService: ToastService  // اینجا تزریق می‌شه
  ) {
    super(http , toastService ); // فراخوانی constructor پدر
  }


  // === Override insertRecord با FormData ===
  override insertRecord(data: UserDto): Observable<ApiResult<any>> {
    const formData = this.buildFormData(data);
    return this.http.post<ApiResult<any>>(`${Domain}${this.endpoint}/create`, formData).pipe(
      catchError(err => {
        this.toastService.error('خطا در ایجاد کاربر');
        throw err;
      })
    );
  }



 
  // === Override updateRecord با FormData ===
  override updateRecord(data: UserDto): Observable<ApiResult<any>> {
    const formData = this.buildFormData(data);
    return this.http.post<ApiResult<any>>(`${Domain}${this.endpoint}/update`, formData).pipe(
      catchError(err => {
        this.toastService.error('خطا در به‌روزرسانی کاربر');
        throw err;
      })
    );
  }

  // === متد کمکی برای ساخت FormData ===
  private buildFormData(data: UserDto): FormData {
    const formData = new FormData();

    // فیلدهای ساده
    if (data.id) formData.append('Id', data.id.toString());
    formData.append('FullName', data.fullName || '');
    formData.append('Username', data.username || '');
    formData.append('Email', data.email || '');
    formData.append('Password', data.Password || '');

    // آرایه RoleIds (تکراری برای هر مقدار)
    if (data.roleIds && data.roleIds.length > 0) {
      data.roleIds.forEach(id => formData.append('RoleIds', id.toString()));
    } else {
      formData.append('RoleIds', ''); // یا حذف کن اگر backend اجازه می‌ده
    }

    // فایل ProfilePicture (اگر File باشد)
    if (data.profilePicture instanceof File) {
      formData.append('ProfilePicture', data.profilePicture, data.profilePicture.name);
    } else {
      formData.append('ProfilePicture', ''); // یا حذف کن
    }

    return formData;
  }
}
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

  override getCreateForm(): Observable<ApiResult<UserCreateFormData>> {
    return this.http
      .get<ApiResult<UserCreateFormData>>(
        `${this.apiUrl}${this.endpoint}/getcreateform`,
        { headers: this.getJsonHeaders() }
      )
      .pipe(catchError(err => this.handleError(err)));
  }
}
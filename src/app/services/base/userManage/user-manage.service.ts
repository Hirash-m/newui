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
export class UserManageService  extends BaseService<UserDto, UserDto>{
  protected endpoint = '/api/user';

}

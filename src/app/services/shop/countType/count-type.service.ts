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
export class CountTypeService extends BaseService<CountTypeDto , CountTypeDto> {
protected  endpoint= '/api/counttype';

}

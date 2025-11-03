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
export class InventoryService extends BaseService<InventoryDto , InventoryDto> {

  protected endpoint='/api/inv';
   

}

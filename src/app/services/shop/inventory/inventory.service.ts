import { Injectable } from '@angular/core';
import { BaseService } from '../../utilities/base.service';
import {InventoryDto} from 'src/app/dto/shop/InventoryDto'

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseService<InventoryDto , InventoryDto> {

  protected endpoint='/api/inv';
   

}

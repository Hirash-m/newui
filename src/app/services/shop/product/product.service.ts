import { ToastService } from '../../utilities/toast.service';
import { ListRequest } from '../../../dto/ListRequestDto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Domain } from '../../../../utilities/path';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ProductCreateDto, ProductViewDto } from '../../../dto/shop/ProductDto';
import { BaseService } from '../../utilities/base.service';
import { ApiResult } from 'src/app/dto/api-result';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<ProductViewDto, ProductCreateDto> {
  protected endpoint='/api/product';
  private apiurl = Domain;







 

  /** جستجوی محصول با پارامترها */
  searchProducts(request: ListRequest): Observable<ApiResult<ProductViewDto>> {


    return this.http.post<ApiResult<ProductViewDto>>(`${this.apiurl}/api/product/search`, request, { headers: this.getJsonHeaders() }).pipe(
      catchError(error => {
        //this.toast.showToast.error({ message: 'خطا در تراکنش ' });
        this.toast.error("need change");
        return throwError(() => error);
      })
    );
  }

}

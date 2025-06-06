import { ToastService } from '../../utilities/toast.service';
import { ListRequest } from '../../../dto/ListRequestDto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Domain } from '../../../../utilities/path';
import { Injectable } from '@angular/core';
import { baseResponse } from '../../../dto/baseResponse';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ProductCreateDto, ProductViewDto } from '../../../dto/shop/ProductDto';
import { BaseService } from '../../utilities/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {
  private apiurl = Domain;

  constructor(private http: HttpClient, private toast: ToastService) {
    super();
  }


  /** دریافت لیست داده‌ها */
  getRecords(request: ListRequest): Observable<baseResponse<ProductViewDto>> {
    const requestPayload = request;



    return this.http.post<baseResponse<ProductViewDto>>(`${this.apiurl}/api/product/GetAll`, requestPayload, { headers: this.getJsonHeaders() }).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: 'خطا در تراکنش ' });

        return throwError(() => error);
      })
    )
      ;
  }


  /** افزودن محصول */
  insertRecord(productData: ProductCreateDto): Observable<baseResponse<ProductCreateDto>> {

    return this.http.post<baseResponse<any>>(`${this.apiurl}/api/product/create`, productData, { headers: this.getJsonHeaders() }).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: 'خطا در تراکنش ' });

        return throwError(() => error);
      })
    );
  }

  /** حذف محصول */
  deleteRecords(ids: number[]): Observable<baseResponse<any>> {

    return this.http.post<baseResponse<any>>(`${this.apiurl}/api/product/delete`, ids, { headers: this.getJsonHeaders() }).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: 'خطا در تراکنش ' });

        return throwError(() => error);
      })
    );
  }

  /** ویرایش محصول */
  updateRecord(productData: ProductCreateDto): Observable<baseResponse<ProductCreateDto>> {

    return this.http.post<baseResponse<ProductCreateDto>>(`${this.apiurl}/api/product/update`, productData, { headers: this.getJsonHeaders() }).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: 'خطا در تراکنش ' });

        return throwError(() => error);
      })
    );
  }
  /** دریافت محصول بر اساس شناسه */
  getRecordById(id: number): Observable<baseResponse<ProductCreateDto>> {

    return this.http.get<baseResponse<ProductCreateDto>>(`${this.apiurl}/api/product/getById/?id=${id}`, { headers: this.getJsonHeaders() }).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: 'خطا در تراکنش ' });

        return throwError(() => error);
      })
    );
  }


  getSelectOptions(serviceName: string): Observable<any[]> {
    return this.http.get<any>(`${serviceName}`).pipe(
      map(response => Array.isArray(response) ? response : [])
    );
  }

  /** جستجوی محصول با پارامترها */
  searchProducts(request: ListRequest): Observable<baseResponse<ProductViewDto>> {


    return this.http.post<baseResponse<ProductViewDto>>(`${this.apiurl}/api/product/search`, request, { headers: this.getJsonHeaders() }).pipe(
      catchError(error => {
        this.toast.showToast.error({ message: 'خطا در تراکنش ' });

        return throwError(() => error);
      })
    );
  }

}

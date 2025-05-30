import { ListRequest } from './../../dto/ListRequestDto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Domain } from './../../../utilities/path';
import { Injectable } from '@angular/core';
import {baseResponse} from '../../dto/baseResponse';
import { map, Observable } from 'rxjs';
import { ProductCreateDto, ProductViewDto } from '../../dto/shop/ProductDto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiurl = Domain;

  constructor(private http: HttpClient) { }


  /** دریافت لیست داده‌ها */
  getRecords(request :ListRequest): Observable<baseResponse<ProductViewDto>> {
    const requestPayload = request;
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.post<baseResponse<ProductViewDto>>(`${this.apiurl}/api/product/GetAll`, requestPayload, { headers })
      ;
  }


    /** افزودن محصول */
  insertRecord(productData: ProductCreateDto): Observable<baseResponse<any>> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'

    });
    return this.http.post<baseResponse<any>>(`${this.apiurl}/api/product/create`, productData, { headers });
  }

  /** حذف محصول */
  deleteRecords(ids: number[]): Observable<baseResponse<any>> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return this.http.post<baseResponse<any>>(`${this.apiurl}/api/product/delete`, ids, { headers });
  }

  /** ویرایش محصول */
  updateRecord(productData: ProductCreateDto): Observable<baseResponse<ProductCreateDto>> {
    const headers = new HttpHeaders({

      'accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return this.http.post<baseResponse<ProductCreateDto>>(`${this.apiurl}/api/product/update`, productData, { headers });
  }
  /** دریافت محصول بر اساس شناسه */
  getRecordById(id: number): Observable<baseResponse<ProductCreateDto>> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return this.http.get<baseResponse<ProductCreateDto>>(`${this.apiurl}/api/product/getById/?id=${id}`, { headers });
  }


  getSelectOptions(serviceName: string): Observable<any[]> {
    return this.http.get<any>(`${serviceName}`).pipe(
      map(response => Array.isArray(response) ? response : [])
    );
  }

}

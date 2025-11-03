// src/app/services/utilities/mock-base.service.ts
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable()
export class MockBaseService extends BaseService<any, any> {
  protected endpoint = '/api/test'; // فقط برای کامپایل شدن

  constructor() {
    super(null!, null!); // HttpClient و ToastService رو null می‌ذاریم چون تست واحد هست
  }
}
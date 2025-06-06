import { HttpHeaders } from '@angular/common/http';

export abstract class BaseService {
  protected getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }
}

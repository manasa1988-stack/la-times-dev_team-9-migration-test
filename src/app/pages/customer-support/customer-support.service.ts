
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseService} from "../../shared/base.service";
import { ICustomerSupport } from '../../models/customer-support.model';

@Injectable()
export class CustomerSupportService extends BaseService{

  constructor(private http: HttpClient) {
  super();
  }

  public getCustomerSupportDetails(buCode: string): Observable<any> {
    
   // const apiUrl = 'assets/data/customerSupport.json';
    const apiUrl = '/api/marketSetting/customerSupport/' + buCode;
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }

}


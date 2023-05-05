
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from "../../shared/base.service";
import { IUserDetails } from '../../models/user-details.model';

@Injectable()
export class UserAccountService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public updateUserDetails(user: IUserDetails): Observable<any> {
    let apiUrl = "/api/Account";
    return this.http.put(apiUrl, user).pipe(
      catchError(this.handleError));
  }

  public changePassword(value: any) {
    let apiUrl = "/api/account/updatecreds";
    return this.http.put(apiUrl, value).pipe(
      catchError(this.handleError));

  }

}
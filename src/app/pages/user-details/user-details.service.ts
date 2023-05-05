
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from "../../shared/base.service";
import { StorageService } from '../../shared/storage.service';
import { IUserDetails } from '../../models/user-details.model';

@Injectable()
export class UserDetailsService extends BaseService {

    private host: string = '';
    private userApi: string = this.host + '/api/user';
    constructor(private http: HttpClient,
        private storageService: StorageService) {
        super();
    }

    public getUserDetails(): Observable<IUserDetails['any']> {
        return this.http.get(this.userApi + '/detail').pipe(
            catchError(this.handleError));
    }

    public getUser(): Observable<IUserDetails['any']> {
        return this.http.get(this.userApi).pipe(
            catchError(this.handleError));
    }

    public storeUserDetails(userDetails) {
        this.storageService.setUserInfo({
            "userName": userDetails.CustomerName,
            "customerNumber": userDetails.CustomerNumber
        });
    }

}
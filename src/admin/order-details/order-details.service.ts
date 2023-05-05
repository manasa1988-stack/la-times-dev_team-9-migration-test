
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { AdminBaseService } from "../shared/admin-base.service";
import { IOrder } from '../../app/models/order-item.model';
import { IUserDetails } from '../../app/models/user-details.model';

@Injectable()
export class OrderDetailsService extends AdminBaseService {

    private isAdit: boolean;

    constructor(private http: HttpClient) {
        super();
    }
    
    public getOrderDetails(systemName, orderId): Observable<any> {
        const apiUrl = "/api/orderAdmin/order/" + systemName + "/" + orderId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public postPurgeId(id: number): Observable<any> {
        const apiUrl = "/api/orderAdmin/purge/" + id;
        return this.http.post(apiUrl, null).pipe(catchError(this.handleError));
    }
}
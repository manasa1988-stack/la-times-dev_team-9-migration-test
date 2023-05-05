
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFilter } from '../../models/filter.model';
import { BaseService } from '../../shared/base.service';
import { IOrderListData } from '../../models/order-data.model';
import { IOrder, IAdMaterial } from '../../models/order-item.model';
//import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class OrderHistoryService extends BaseService {

    private host: string = '';
    private orderApi: string = this.host + '/api/order';
    constructor(private http: HttpClient) {
        super();
    }

    public getOrders(filter: IFilter): Observable<IOrderListData['any']> {

        let apiUrl = this.orderApi + '?filter.pageSize=' + filter.pageSize + '&filter.pageNumber=' + filter.pageNumber;

        if (filter.from || filter.to)
            apiUrl += '&filter.dateFilter=' + filter.dateFilter;
        if (filter.from)
            apiUrl += '&filter.from=' + filter.from;
        if (filter.to)
            apiUrl += '&filter.to=' + filter.to;

        if (filter.orderId)
            apiUrl += '&filter.aditOrderId=' + filter.orderId;

        if (filter.status)
            apiUrl += '&filter.status=' + filter.status;

        return this.http.get(apiUrl).pipe(catchError(this.handleError));

    }

    public getOrderSummary(orderId: number, isCustomerSession: boolean = false): Observable<IOrder['any']> {
        let apiUrl = this.orderApi + '/' + orderId;
        if (isCustomerSession) {
            apiUrl +='?isForVideo=' + isCustomerSession;
        }

        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public cancelOrder(orderId: number): Observable<any> {
        let apiUrl = this.orderApi + '/cancel/' + orderId;
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
    }

    public getPrintProof(orderId: number): Observable<any> {
        let apiUrl = this.orderApi + '/printproof/' + orderId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));

    }

    public getAditOrder(orderId: number): Observable<IOrder['any']> {
        let apiUrl = this.orderApi + '/getOrderforEditAd?id=' + orderId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public exportOrders(filter: IFilter): any {

        let apiUrl = this.orderApi + '/history/export?filter.pageSize=' + 10000;

        if (filter.from || filter.to)
            apiUrl += '&filter.dateFilter=' + filter.dateFilter;
        if (filter.from)
            apiUrl += '&filter.from=' + filter.from;
        if (filter.to)
            apiUrl += '&filter.to=' + filter.to;

        if (filter.orderId)
            apiUrl += '&filter.aditOrderId=' + filter.orderId;

        if (filter.status)
            apiUrl += '&filter.status=' + filter.status;

        return this.http.get<Blob>(apiUrl, {  responseType: 'blob' as 'json'}).pipe(catchError(this.handleError));

    }

}


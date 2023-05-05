
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { BaseService } from "../../shared/base.service";
import { isNullOrUndefined } from 'util';
import { IFilter } from '../../models/filter.model';
import { IOrderListData } from '../../models/order-data.model';
import { IOrder } from '../../models/order-item.model';

@Injectable()
export class DraftOrdersService extends BaseService {


    private host: string = '';
    private draftApi: string = this.host + '/api/drafts';
    constructor(private http: HttpClient) {
        super();
    }

    public getDraftOrders(filter: IFilter): Observable<IOrderListData['any']> {

        let apiUrl = this.draftApi + '?filter.pageSize=' + filter.pageSize + '&filter.pageNumber=' + filter.pageNumber;

        if (filter.from || filter.to)
            apiUrl += '&filter.dateFilter=' + filter.dateFilter;
        if (filter.from)
            apiUrl += '&filter.from=' + filter.from;
        if (filter.to)
            apiUrl += '&filter.to=' + filter.to;

        return this.http.get(apiUrl).pipe(catchError(this.handleError));

    }

    public deleteOne(DraftOrderId: number) {
        let apiUrl = this.draftApi + '/' + DraftOrderId;
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
    }

    public deleteMany(DraftOrderIds: number[]) {
        let urlParams: URLSearchParams = new URLSearchParams();
        DraftOrderIds.forEach(n => urlParams.append('apiDeleteBulkDrafts', n.toString()));
        let apiUrl = this.draftApi + '/bulk?' + urlParams;
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
    }

  public getDraftSummary(orderId: number, orderItemId?: number): Observable<IOrder['any']> {

    var orderItem = orderItemId && orderItemId > 0 ? "?orderItemId=" + orderItemId : "";
    let apiUrl = this.draftApi + '/' + orderId + orderItem;
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }

}


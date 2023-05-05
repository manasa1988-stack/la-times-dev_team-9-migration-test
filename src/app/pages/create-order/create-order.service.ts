
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable ,  Subject } from 'rxjs';
import { ICreateOrderRequest } from '../../models/create-order.request.model';
import { IOrder, IVolumeDiscount } from '../../models/order-item.model';
import { IOrderItemPrice } from '../../models/order-item-price.model';
import { IAvailableDates } from '../../models/availabledates.model';
import { IImpression } from '../../models/impression.model';
import { IGetPriceRequest, IUpdateOrderState } from '../../models/getPrice.request.model';
import { ServerResponse } from '../../models/server.response.model';
import { isNullOrUndefined } from 'util';


@Injectable()
export class CreateOrderService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }
    public createOrder(request: ICreateOrderRequest[], packageCode?: string, isVendor?: boolean) {
        let apiUrl = "/api/order?ignoreProgressBar=true";
        if (!isNullOrUndefined(packageCode))
            apiUrl += "&package=" + packageCode;
        if (!isNullOrUndefined(isVendor)) {
            apiUrl += "&isVendor=" + isVendor;
        }

        return this.http.post(apiUrl, request).pipe(catchError(this.handleError));
    }

}
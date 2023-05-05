
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { BaseService } from "../../shared/base.service";
import { HttpClient } from "@angular/common/http";
import { ServerResponse } from "../../models/server.response.model";
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseOrderService extends BaseService {
  
    constructor(private http: HttpClient) {
        super();
    }

    public completePurchase(orderToBeSubmitted, id) {
        let apiUrl = "/api/purchase/completePurchase?orderId=" + id;        
        return this.http.post(apiUrl, orderToBeSubmitted).pipe(catchError(this.handleError));
    }

    public saveAndPurchaseLater(orderId): Observable<ServerResponse['Result']>{
        let apiUrl = "/api/purchase/saveAndCompletePurchaseLater?orderId=" + orderId;        
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public confirmOrder(orderId, isCreditCard): Observable<ServerResponse['Result']>{
        let apiUrl = "/api/Confirmation?orderId=" + orderId + "&isCreditCard=" + isCreditCard;        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }
}
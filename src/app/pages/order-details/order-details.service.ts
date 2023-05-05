
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { BaseService } from "../../shared/base.service";
import { HttpClient } from "@angular/common/http";
import { ServerResponse } from "../../models/server.response.model";
import { Observable } from 'rxjs';
import { isNullOrUndefined } from "util";

@Injectable()
export class OrderDetailsService extends BaseService {
  
    constructor(private http: HttpClient) {
        super();
    }

    public renewOrder(orderId, orderItemId?: number): Observable<ServerResponse['Result']>{
        let apiUrl = "/api/order/renew?orderId=" + orderId;  
        if(!isNullOrUndefined(orderItemId))
            apiUrl += "&orderItemId=" + orderItemId;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }
}
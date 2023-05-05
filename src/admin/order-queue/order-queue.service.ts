
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AdminBaseService } from "../shared/admin-base.service";
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { IQueueOrder, IOrderQueueList } from "../models/setting.model";
import { ServerResponse } from "../../app/models/server.response.model";
import { isNullOrUndefined } from "util";

@Injectable()
export class OrderQueueService extends AdminBaseService {

    constructor(private http: HttpClient) {
        super();
    }
    
    public getOrderQueues(pageNumber: number, pageSize: number, orderId: number): Observable<IOrderQueueList['any']> {       
        let apiUrl = "/api/OrderQueue?request.pageNumber=" + pageNumber;
        apiUrl += "&request.pageSize=" + pageSize;     
        apiUrl += "&request.orderId=" +  orderId;  
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public updateTimeZone(timeZone: string): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/orderQueue/updateTimeZone?selectedTimeZone=" + timeZone;        
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public processOrder(orderId: number): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/orderQueue/process/" + orderId;        
        return this.http.put(apiUrl,{}).pipe(catchError(this.handleError));
    }

}
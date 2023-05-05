
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { IMarketSettings } from "../app/models/market-settings.model";
import { AdminBaseService } from "./shared/admin-base.service";

@Injectable()
export class AdminService extends AdminBaseService {

    constructor(private http: HttpClient) {
        super();
    }

    public getPortalData(): Observable<IMarketSettings['any']> {
        const apiUrl = "/api/portal";        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getRegressionLinks(): Observable<any> {
        const apiUrl = "/api/portal/regression";        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

}
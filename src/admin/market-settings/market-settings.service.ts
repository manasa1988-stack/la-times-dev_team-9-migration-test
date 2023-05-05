
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AdminBaseService } from "../shared/admin-base.service";
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { IMarketSettings } from "../../app/models/market-settings.model";

@Injectable()
export class MarketSettingsService extends AdminBaseService {

    constructor(private http: HttpClient) {
        super();
    }

    public getMarketSettings(): Observable<IMarketSettings['any']> {
        const apiUrl = "/api/MarketSetting";        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public putMarketSettings(marketSettings: IMarketSettings) {
        const apiUrl = "/api/MarketSetting";        
        return this.http.put(apiUrl, marketSettings).pipe(catchError(this.handleError));
    }

    public postMarketSettings(marketSettings: IMarketSettings) {
        const apiUrl = "/api/MarketSetting";        
        return this.http.post(apiUrl, marketSettings).pipe(catchError(this.handleError));
    }

}
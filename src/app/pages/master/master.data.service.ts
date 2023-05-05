
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBusinessType } from '../../models/business-type.model';
import { IMarketSettings } from '../../models/market-settings.model';

@Injectable()
export class MasterDataService extends BaseService {

    private host: string = '';
    private valueApi: string = this.host + '/api/values';
    private accountApi: string = this.host + '/api/account';
    private marketApi: string = this.host + '/api/marketSetting';
    constructor(private http: HttpClient) {
        super();
    }

    public getSates(): Observable<any['any']> {
        const apiUrl = this.valueApi + '/states';
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getBusinessTypes(): Observable<IBusinessType['any']> {
        const apiUrl = this.accountApi + '/businessTypes';
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getMarkettingSettings(hostName: string): Observable<IMarketSettings['any']> {

        return this.http.get(this.marketApi + '/host?host=' + hostName).pipe(
            catchError(this.handleError));
    }
}
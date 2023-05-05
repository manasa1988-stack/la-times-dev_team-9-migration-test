
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AdminBaseService } from "../shared/admin-base.service";
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { IMarketSettings } from "../../app/models/market-settings.model";
import { IIdTypeName, IIdStyleName } from "../models/digital-settings.model";

@Injectable()
export class DigitalSettingsService extends AdminBaseService {

    constructor(private http: HttpClient) {
        super();
    }

    public getGeoTargetStates(): Observable<IIdTypeName['any']> {
        const apiUrl = "/api/digitalSettings/getDfpGeoTargetStates";
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getSelectedStates(buId: number): Observable<number[]> {
        const apiUrl = "api/digitalSettings/getSelectedStates?buId=" + buId;
        return this.http.get<|number[]>(apiUrl).pipe(catchError(this.handleError));
    }

    public getCities(stateId: number): Observable<IIdTypeName['any']> {
        const apiUrl = "api/digitalSettings/getCities?stateId=" + stateId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getSelectedCities(buId: number, stateId: number): Observable<|number[]> {
        const apiUrl = "api/digitalSettings/getSelectedCities?buId=" + buId + "&stateId=" + stateId;
        return this.http.get<|number[]>(apiUrl).pipe(catchError(this.handleError));
    }

    public saveSelectedStates(buId: number, selectedStates: number[]) {
        const apiUrl = "api/digitalSettings/saveSelectedStates?buId=" + buId;
        return this.http.post(apiUrl, selectedStates).pipe(catchError(this.handleError));
    }

    public saveSelectedCities(buId: number, stateId: number, selectedStates: number[]) {
        const apiUrl = "api/digitalSettings/saveSelectedCities?buId=" + buId + "&stateId=" + stateId;
        return this.http.post(apiUrl, selectedStates).pipe(catchError(this.handleError));
    }

    public getHtmlStyles(): Observable<IIdStyleName['any']> {
        const apiUrl = "/api/digitalSettings/getHtmlStyles";
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getSelectedStyles(buId: number) {
        const apiUrl = "/api/digitalSettings/getSelectedStyles?buId=" + buId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public saveStyleSelection(buEditorStyleMap) {
        const apiUrl = "api/digitalSettings/saveSelectedStyle";
        return this.http.post(apiUrl, buEditorStyleMap).pipe(catchError(this.handleError));
    }
}
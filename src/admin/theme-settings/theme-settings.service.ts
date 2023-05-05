
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AdminBaseService } from "../shared/admin-base.service";
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { ITheme } from "../models/setting.model";

@Injectable()
export class ThemeSettingsService extends AdminBaseService {

    constructor(private http: HttpClient) {
        super();
    }

    public getThemeSettings(): Observable<any> {
        const apiUrl = "/api/ThemeSettings";        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getThemeSetting(id: number): Observable<any> {
        const apiUrl = "/api/themeSettings/" + id;        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public putThemeSetting(theme: ITheme): Observable<any> {
        const apiUrl = "/api/ThemeSettings";        
        return this.http.put(apiUrl, theme).pipe(catchError(this.handleError));
    }

    public postThemeSetting(theme: ITheme): Observable<any> {
        const apiUrl = "/api/ThemeSettings";        
        return this.http.post(apiUrl, theme).pipe(catchError(this.handleError));
    }

    public deleteThemeSetting(id: number): Observable<any> {
        const apiUrl = "/api/ThemeSettings/" + id;        
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
    }

}
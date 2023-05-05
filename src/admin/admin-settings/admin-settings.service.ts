
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AdminBaseService } from "../shared/admin-base.service";
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { ISetting } from "../models/setting.model";
import { ServerResponse } from "../../app/models/server.response.model";

@Injectable()
export class AdminSettingsService extends AdminBaseService {

    constructor(private http: HttpClient) {
        super();
    }

    public getAdminSettings(): Observable<ServerResponse['Result']> {
        const apiUrl = "/api/Setting";        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public updateAdminSettings(setting: ISetting) {
        const apiUrl = "/api/setting/updateSettings";              
        return this.http.post(apiUrl, setting).pipe(catchError(this.handleError));
    }

}
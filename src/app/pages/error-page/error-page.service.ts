
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { BaseService } from "../../shared/base.service";
import { HttpClient } from "@angular/common/http";
import { ServerResponse } from "../../models/server.response.model";
import { Observable } from 'rxjs';
import { isNullOrUndefined } from "util";
import { ICustomErrorDetails } from "../../models/custom-error.details.model";

@Injectable()
export class ErrorDetailsService extends BaseService {
  
    constructor(private http: HttpClient) {
        super();
    }

    public getErrorDetails(code: string): Observable<ICustomErrorDetails['any']>{
        let apiUrl = "/api/errors?errorCode=" + code;         
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }
}
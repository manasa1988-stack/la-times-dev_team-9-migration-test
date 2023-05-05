
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AdminBaseService } from "../shared/admin-base.service";
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { ServerResponse } from "../models/server.response.model";

@Injectable()
export class CacheEntriesService extends AdminBaseService {

    constructor(private http: HttpClient) {
        super();
    }

    public getAllCache() {
        const apiUrl = "/api/cache/getAllCache";        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getCacheEntry(cacheKey: string): Observable<any> {
        const apiUrl = "/api/cache/all?cacheKey=" + cacheKey;        
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public deleteCache(cacheKey: string): Observable<any> {
        const apiUrl = "/api/cache/" + cacheKey;        
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
    }

    public cleanAll(): Observable<any> {
        const apiUrl = "/api/cache/cleanAll";        
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
    }
}
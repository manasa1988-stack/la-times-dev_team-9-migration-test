
import {catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { BaseService } from "../../shared/base.service";
import { Observable } from "rxjs";
import { IUploadDocExternal } from "../../models/upload-legal-doc.response.model";
import { HttpClient } from "@angular/common/http";



@Injectable()

export class EditUploadDocExternalService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    getUploadDocExternal(aditId: number, orderItemId: number, packageID: number): Observable<IUploadDocExternal['any']> {
        let apiUrl = '/api/order/EditUploadDocExternal?';
        apiUrl += 'aditId=' + aditId;
        apiUrl += '&orderItemId=' + orderItemId;
        apiUrl += '&packageID=' + packageID;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }
}

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Observable } from "rxjs";
import { BaseService } from '../../shared/base.service';
import { ServerResponse } from '../../../admin/models/server.response.model';
import { IGetDesignAdExternalRequest } from '../../models/designDocument.model';
import { isNullOrUndefined } from 'util';


@Injectable()
export class UploadDocService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    public getDesignAdMaterial(requestObject: IGetDesignAdExternalRequest): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/designAd/getDesignAdExternal";

        apiUrl += "?ignoreProgressBar=true";
        
        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }

    public uploadCSRDocument(file, designAdExternalRequest: IGetDesignAdExternalRequest): Observable<any> {
        let apiUrl = "/api/designAd/uploadCSRDocument";
        apiUrl += "?apiUploadCSRDocumentRequest.adTemplateDataFieldIDsName=" + "Photo1";
        // apiUrl += "&apiUploadCSRDocumentRequest.fileName=" + data.FileName;
        apiUrl += "&apiUploadCSRDocumentRequest.systemName=" + designAdExternalRequest.SystemName;
        apiUrl += "&apiUploadCSRDocumentRequest.sectionID=" + designAdExternalRequest.SectionID;    
        if(isNullOrUndefined(designAdExternalRequest.PositionID)){
            apiUrl += "&apiUploadCSRDocumentRequest.positionID=0"
        }
        else{
            apiUrl += "&apiUploadCSRDocumentRequest.positionID=" + designAdExternalRequest.PositionID;
        }
        
        apiUrl += "&apiUploadCSRDocumentRequest.orderID=" + designAdExternalRequest.OrderID;
        apiUrl += "&apiUploadCSRDocumentRequest.adMaterialID=" + designAdExternalRequest.AdMaterialID;
        apiUrl += "&apiUploadCSRDocumentRequest.externalMaterialID=" + designAdExternalRequest.ExternalMaterialID;
        apiUrl += "&apiUploadCSRDocumentRequest.adSizeID=" + designAdExternalRequest.AdSizeID;
        apiUrl + "&apiUploadCSRDocumentRequest.packageCode=" + designAdExternalRequest.PackageCode;
        apiUrl += "&apiUploadCSRDocumentRequest.isColor=" + designAdExternalRequest.IsColor;
        apiUrl += "&apiUploadCSRDocumentRequest.isEditing=" + designAdExternalRequest.IsEditing;
        return this.http.post(apiUrl, file).pipe(
            map(this.mapServerErrorResponse),
            catchError(this.handleError),);
    }

    public saveFinalCSRDocument(data): Observable<any> {
        let apiUrl = "/api/designAd/saveFinalCSRDocument";
        return this.http.post(apiUrl, data).pipe(catchError(this.handleError));
    }

    public submitAdMaterialUploadedFromDoc(data: IGetDesignAdExternalRequest): Observable<any> {
        let apiUrl = "/api/designAd/submitAdMaterialUploadedFromDoc";
        return this.http.post(apiUrl, data).pipe(catchError(this.handleError));
    }

}
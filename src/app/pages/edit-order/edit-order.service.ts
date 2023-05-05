
import {catchError} from 'rxjs/operators';
import { BaseService } from "../../shared/base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { isNullOrUndefined } from "util";

@Injectable()
export class EditOrderService extends BaseService {

    private host: string = '';
    private orderApi: string = this.host + '/api/order';

    constructor(private http: HttpClient) {
        super();
    }

    public getEditOrder(aditId: number, externalAdMaterialId, isRedirectedFromDesignAd, imageListAttributeId,
        systemName: string): Observable<any> {
        let apiUrl = this.orderApi + '/editAdMaterial?externalAdMaterialId=' + externalAdMaterialId
            + '&aditId=' + aditId + "&isRedirectedFromDesignAd=" + isRedirectedFromDesignAd;

        apiUrl = imageListAttributeId > 0 ? apiUrl + "&imageListAttributeId=" + imageListAttributeId : apiUrl

        // console.log("outside sysname ", systemName);

        apiUrl += '&systemName=' + systemName;


        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public updateOrderInvoiceNote(request): Observable<any>{
        let apiUrl = "/api/order/updateInvoiceNote";
        return this.http.post(apiUrl, request).pipe(catchError(this.handleError));
    }

    public updateImageListAttribute(request): Observable<any> {
        let apiUrl = "/api/order/updateImageListAttribute";
        return this.http.post(apiUrl, request).pipe(catchError(this.handleError));
    }

    public updateAttributeInputs(request): Observable<any> {
        let apiUrl = "/api/order/updateAttributeInputs";
        return this.http.post(apiUrl, request).pipe(catchError(this.handleError));
    }

    public updateAdMaterial(request): Observable<any> {
        let apiUrl = "/api/order/updateAdMaterial";
        return this.http.post(apiUrl, request).pipe(catchError(this.handleError));
    }

    public cancelEditMaterial(orderID, adMaterialID, externalAdMaterialID): Observable<any> {
        let apiUrl = '/api/order/cancelEditMaterial?externalAdMaterialID=' + externalAdMaterialID
            + '&orderID=' + orderID
            + '&adMaterialID=' + adMaterialID;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public cancelAttributeInputsAndUpsellImages(systemKey, systemName, imageListAttributeID): Observable<any> {
        let apiUrl = '/api/order/cancelAttributeInputsAndUpsellImages?imageListAttributeID=' + imageListAttributeID + '&systemKey=' + systemKey + '&systemName=' + systemName;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    
    public copyEditAdMaterialDirectory(updateMaterialDirectory): Observable<any> {
        let apiUrl = '/api/order/copyEditAdMaterialDirectory';
        return this.http.post(apiUrl,updateMaterialDirectory).pipe(catchError(this.handleError));
    }
}


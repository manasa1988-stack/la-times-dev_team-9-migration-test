
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  Subject } from 'rxjs';
import { ICreateOrderRequest } from '../../../models/create-order.request.model';
import { IOrder, IVolumeDiscount, ILegalDoc } from '../../../models/order-item.model';
import {  IOrderItemPrice } from '../../../models/order-item-price.model';
import { IAvailableDates } from '../../../models/availabledates.model';
import { IImpression } from '../../../models/impression.model';
import { IGetPriceRequest } from '../../../models/getPrice.request.model';
import { BaseService } from '../../../shared/base.service';
import { ServerResponse } from '../../../models/server.response.model';

@Injectable()
export class OtherInfoService extends BaseService {
    currentTabIndex: number = 0;
    tabIndexObservable: Subject<number> = new Subject<number>();

    constructor(private http: HttpClient) {
        super();
    }
 
    public getChildAttributeValues(parentAttributeName, parentAttributeValue, childAttributeName, sectionId, packageCode): Observable<any> {
        let apiUrl = "/api/configure/GetChildAttributeValues?parentAttrName="+parentAttributeName+"&parentAttrVal="+parentAttributeValue+"&childAttrName="+childAttributeName+"&sectionId="+sectionId+"&packageCode="+packageCode;

        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public uploadImageListAttribute(systemKey, systemName, attributeId, photoIndex, requestObject, isEditing): Observable<any>{
        let apiUrl = "/api/configure/UploadImageListAttribute";     
        apiUrl += "?systemKey="+systemKey+"&imageListAttributeId="+attributeId+"&imagePosition="+photoIndex+"&imageWidth=640&imageHeight=480&systemName="+systemName+"&isEditing=" + isEditing;
        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }

    public removeImageListAttributeItem(systemKey, systemName, attributeId, photoIndex): Observable<any>{
        let apiUrl = "/api/configure/RemoveImageListAttributeItem";     
        apiUrl += "?systemName="+systemName+"&systemKey="+systemKey + "&imageListAttributeId="+attributeId+"&imagePosition=" + photoIndex;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public saveCroppedImageListAttribute(data): Observable<any>{
        let apiUrl = "/api/configure/SaveCroppedImageListAttribute"; 
        return this.http.post(apiUrl, data).pipe(catchError(this.handleError));
    }

    public removeImageListAttributeFolder(systemKey, systemName, attributeId): Observable<any>{
        let apiUrl = "/api/configure/RemoveImageListAttributeFolder";          
        apiUrl += "?systemKey="+systemKey+"&imageListAttributeId="+attributeId+"&systemName="+systemName;           
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public uploadLegalDoc(orderId, orderItemId, file): Observable<ServerResponse['Result']> { 
        let apiUrl = '/api/configure/UploadLegalFile?';
        apiUrl += "orderId=" + orderId;
        apiUrl += "&orderItemId=" + orderItemId;
        return this.http.post(apiUrl,file).pipe(catchError(this.handleError));
      }

      public deleteLegalDoc(legalDoc:ILegalDoc): Observable<ServerResponse['Result']> { 
        let apiUrl = 'api/configure/DeleteLegalFile?';    
        apiUrl += "orderId=" + legalDoc.OrderId;
        apiUrl += "&orderItemId=" + legalDoc.OrderItemId;
        apiUrl += "&fileName=" + legalDoc.DocumentName;
        apiUrl += "&documentID=" + legalDoc.DocumentId;
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
      }

}

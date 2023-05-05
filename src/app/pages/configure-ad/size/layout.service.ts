
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILayoutCarouselItem } from '../../../models/layout.model';
import { IOrderItem, IOrder, IAdTemplate } from '../../../models/order-item.model';
import { IUploadImage } from '../../../models/upload-image.model';
import { isNullOrUndefined } from 'util';


@Injectable()
export class LayoutService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }
    public getLayouts(orderId: number, currentOrderItemId: number): Observable<ILayoutCarouselItem['any']> {
        let apiUrl = '/api/configure/applicableAdSizes';
        apiUrl += '?orderid=' + orderId + '&orderItemId=' + currentOrderItemId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getTemplates(adSizeId: number, sectionId: number, positionId: number, customerNumber: string): Observable<IAdTemplate['any']> {
        let apiUrl = '/api/configure/templates';
        apiUrl += '?adTemplateRequest.adSizeId=' + adSizeId;
        apiUrl += '&adTemplateRequest.sectionId=' + sectionId;

        if (!isNullOrUndefined(positionId))
            apiUrl += '&adTemplateRequest.positionId=' + positionId;

        apiUrl += '&adTemplateRequest.customerNumber=' + customerNumber;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }


    public uploadImage(file, orderId: number, sectionId: number, adSizeId: number, adMaterialId: number, externalAdMaterialId: number): Observable<any> {
        const apiUrl = "/api/configure/UploadImage?sectionId=" + sectionId + "&adSizeId=" + adSizeId + "&orderId=" + orderId + "&adMaterialId=" + adMaterialId + "&externalAdMaterialId=" + externalAdMaterialId;
        return this.http.post(apiUrl, file).pipe(catchError(this.handleError));
    }

    public uploadPhotoLibraryAd(orderId: number, sectionId: number, adSizeId: number, adMaterialId: number, externalAdMaterialId: number, fileName: string): Observable<any> {
        const apiUrl = "/api/configure/uploadPhotoLibraryAd?sectionId=" + sectionId + "&adSizeId=" + adSizeId + "&orderId=" + orderId + "&adMaterialId=" + adMaterialId + "&externalAdMaterialId=" + externalAdMaterialId + "&fileName=" + fileName;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public getTempImage(orderId: number, adMaterialId: number, externalAdMaterialId: number): Observable<any> {
        let apiUrl = '/api/configure/getTempImage';
        apiUrl += '?orderId=' + orderId + '&adMaterialId=' + adMaterialId + '&externalAdMaterialId=' + externalAdMaterialId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public saveUserUploadedImage(request: IUploadImage): Observable<any> {
        let apiUrl = "/api/configure/saveUserUploadedImageWithRotation";
        return this.http.post(apiUrl, request).pipe(catchError(this.handleError));
    }

    public deleteUploadedMaterial(orderId: number, orderItemId: number): Observable<any> {
        let apiUrl = "/api/configure/restartMaterialConfig";
        apiUrl += '?orderId=' + orderId + '&orderItemId=' + orderItemId + '&resetTemplateData=true';
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public getAdMaterialPreview(orderId: number, adMaterialId: number, externalAdMaterialId: number, isColor: boolean): Observable<any> {
        let apiUrl = '/api/configure/getAdMaterialPreview';
        apiUrl += '?orderId=' + orderId + '&adMaterialId=' + adMaterialId + '&externalAdMaterialId=' + externalAdMaterialId + '&isColor=' + isColor;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public isValidUrl(url: string): Observable<any> {
        let apiUrl = "/api/configure/isValidUrl?url=" + url;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public saveEditOrderUploadedImage(request: IUploadImage): Observable<any> {
        let apiUrl = "/api/configure/SaveUserUploadedImage";
        return this.http.post(apiUrl, request).pipe(catchError(this.handleError));
    }

}
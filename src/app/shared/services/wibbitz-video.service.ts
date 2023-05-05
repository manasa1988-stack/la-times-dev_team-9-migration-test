
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseService } from '../base.service';
import { StorageService } from "../../shared/storage.service";
import { IUploadCroppedImageParams } from '../interfaces/upload-cropped-image-params.interface';
import { IOrder } from '../../models/order-item.model';
import { Observable } from 'rxjs';

@Injectable()
export class WibbitzService extends BaseService {
    private apiUrl = '/api/wibbitz';
    constructor(private http: HttpClient, private storageService: StorageService) {
        super();
    }

    public getLayout(params = {}) {
        return  this.http.get(this.apiUrl, params);
    }

    public uploadDraft(oderItemId, aditId, params = {}) {
        params["StatusCode"] = null;
        params["StatusMessage"] = null;
        oderItemId = oderItemId ? oderItemId : 0;
        aditId = aditId ? aditId : 0;
        return this.http.post(`${this.apiUrl}/savedraft?itemId=${oderItemId}&aditId=${aditId}`, params);
    }

    public toggleVideoOnGallery(visible, orderId, params = {}) {
        let url: any = `${this.apiUrl}/togglevideoongallery?orderId=${orderId}&visible=${visible}`;
        return this.http.post(url, params);
    }

    public submitDraft(oderItemId, aditId, adLogin, isEditVideo, params = {}) {
        params["StatusCode"] = null;
        params["StatusMessage"] = null;
        oderItemId = oderItemId ? oderItemId : 0;
        aditId = aditId ? aditId : 0;
        let url: any = '';
        if(adLogin)
            url = `${this.apiUrl}/submit?itemId=${oderItemId}&aditId=${aditId}&userId=${adLogin}`;
        else
            url = `${this.apiUrl}/submit?itemId=${oderItemId}&aditId=${aditId}`;
        
         if(isEditVideo)
            url = url + `&isEditVideo=${isEditVideo}`;
        return this.http.post(url, params);
        
    }

    public getVideoOrder(draftId: any): Observable<IOrder['any']> {
        let apiUrl = `${this.apiUrl}/videoorder/${draftId}`;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));

    } 

    public validatePayload(oderItemId, params = {}) {
        return this.http.post(`${this.apiUrl}/validate?itemId=${oderItemId}`, params);
    }

    public validateCustomerVideoEditSession(draftId, params = {}) {
        var sessionId = this.storageService.getBrowserSession();
        return this.http.post(`${this.apiUrl}/validatecustomervideosession?draftId=${draftId}&sessionId=${sessionId}`, params);
    }

    public initiateCustomerVideoEditSession(draftId, params = {}) {
        var sessionId = this.storageService.getBrowserSession();
        return this.http.post(`${this.apiUrl}/initiatecustomervideosession?draftId=${draftId}&sessionId=${sessionId}`, params);
    }

    public getVideoDraft(videoDraftId) {
        return this.http.get(`${this.apiUrl}/draft?id=${videoDraftId}`);
    }

    public deleteScene(oderItemId, guid) {
        return this.http.get(`${this.apiUrl}/remove?draftId=${oderItemId}&layoutId=${guid}`);
    }

    public duplicateScene(oderItemId, guid) {
        return this.http.get(`${this.apiUrl}/clone?draftId=${oderItemId}&layoutId=${guid}`);
    }

    public createOrGetDraft(params = {}){
        return this.http.post(`${this.apiUrl}/createorgetdraft`, params);
    }

    public createDraft(params = {}){
        return this.http.post(`${this.apiUrl}/createdraft`, params);
    }

    public uploadRawImage({
        draftId,
        layoutId,
        attributeId,
        file,
    }) {
        const headers = new HttpHeaders();
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data' );
        const params = new HttpParams();
        const formData: FormData = new FormData();
        formData.append('myFile', file);

        return this.http.post(
            `${this.apiUrl}/uploadimage?draftId=${draftId}&layoutId=${layoutId}&attributeId=${attributeId}`,
            formData,
            { params, headers },
        );
    }

    public uploadVideoCover(videoDraftId,file) {
        const headers = new HttpHeaders();
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data' );
        const params = new HttpParams();
        const formData: FormData = new FormData();
        formData.append('myFile', file);

        return this.http.post(
            `${this.apiUrl}/uploadcoverimage?draftid=${videoDraftId}`,
            formData,
            { params, headers },
        );
    }

    public getImage(draftId, layoutId, attributeId, cropped = false) {
        return this.http.get(`${this.apiUrl}/getimage?draftId=${draftId}&layoutId=${layoutId}&attributeId=${attributeId}&isOriginal=${cropped}`);
    }

    public uploadCroppedImage(params: IUploadCroppedImageParams) {
        return this.http.post(
            `${this.apiUrl}/savecroppedimage`,
            params,
        );
    }

    public setVideoToPublic(videoDraftId) {
        return this.http.get(
            `${this.apiUrl}/youtubepublic?draftId=${videoDraftId}`,
            { responseType: 'text' },
        );
    }

    public downloadTrigger(videoDraftId) {
        return this.http.get(
            `${this.apiUrl}/download?draftId=${videoDraftId}`,
            {
                responseType: 'blob' as 'json',
            },
        );
    }

    public getVideoList({pageNumber, text, pageSize, productId}) {
        return this.http.get(
            `${this.apiUrl}/videogallery?pagenumber=${pageNumber}&text=${text}&pagesize=${pageSize}&productId=${productId}`,
        );
    }
}
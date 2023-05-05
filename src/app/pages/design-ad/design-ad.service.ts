
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  Subject } from 'rxjs';
import { BaseService } from '../../shared/base.service';
import { IGetDesignAdRequest, IGetDesignAdPreviewRequest, ISaveDesignAdRequest, IEmblem } from '../../models/designAd.model'
import { ServerResponse } from '../../models/server.response.model';
import { isNullOrUndefined } from 'util';


@Injectable()
export class DesignAService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }
    public getDesignAdMaterial(requestObject: IGetDesignAdRequest): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/designad/getDesignAd";

        apiUrl += "?ignoreProgressBar=true";

        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }

    public getDesignAdPreview(requestObject: IGetDesignAdPreviewRequest): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/designad/getDesignPreview";

        apiUrl += "?ignoreProgressBar=true";

        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }

    public saveDesignAdMaterial(requestObject: ISaveDesignAdRequest): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/designad/saveAndContinue";
        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }

    public getEmblem(buCode, subcategoryId): Observable<any> {
        let apiUrl = '/api/designAd/emblem?buCode=' + buCode + "&subCategoryId=" + subcategoryId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public saveEmblem(emblem: IEmblem): Observable<any> {
        let apiUrl = '/api/designad/SaveTemplateEmblem';
        apiUrl += '?systemName=' + emblem.SystemName + '&systemKey=' + emblem.SystemKey;
        apiUrl += '&adMaterialId=' + emblem.AdMaterialId + '&externalAdMaterialId=' + emblem.ExternalAdMaterialId;
        apiUrl += '&adTemplateDataFieldIdsName=' + emblem.AdTemplateDataFieldIdsName;
        apiUrl += '&buCode=' + emblem.BUCode + '&fileName=' + emblem.FileName;
        if (!isNullOrUndefined(emblem.PackageCode) && emblem.PackageCode !== '') {
            apiUrl += '&packageCode=' + emblem.PackageCode;
        }
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public saveLogo(emblem: IEmblem): Observable<ServerResponse['Result']> {
        let apiUrl = '/api/designAd/SaveTemplateLogo';
        apiUrl += '?systemName=' + emblem.SystemName + '&systemKey=' + emblem.SystemKey;
        apiUrl += '&adMaterialId=' + emblem.AdMaterialId + '&externalAdMaterialId=' + emblem.ExternalAdMaterialId;
        apiUrl += '&adTemplateDataFieldIdsName=' + emblem.AdTemplateDataFieldIdsName;
        apiUrl += '&fileName=' + emblem.FileName;
        apiUrl += '&customerNumber=' + emblem.CustomerNumber;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public saveCroppedTemplateImage(data): Observable<any> {
        let apiUrl = "/api/designAd/SaveCroppedTemplateImage";
        return this.http.post(apiUrl, data).pipe(catchError(this.handleError));
    }

    public uploadAdTemplateImage(file, systemName: string, orderId: number, adMaterialId: number, externalAdMaterialId: number, adTemplateDataFieldIdsName: string, displayWidth: number, displayHeight: number): Observable<any> {
        let apiUrl = "/api/designAd/UploadAdTemplateImage?systemName=" + systemName + "&systemKey=" + orderId + "&adMaterialId=" + adMaterialId + "&externalAdMaterialId=" + externalAdMaterialId + "&adTemplateDataFieldIdsName=" + adTemplateDataFieldIdsName;
        apiUrl += "&displayWidth=" + displayWidth + "&displayHeight=" + displayHeight
        return this.http.post(apiUrl, file).pipe(catchError(this.handleError));
    }

    public selectMediaAsAdTemplateImage(fileName, systemName: string, orderId: number, adMaterialId: number, externalAdMaterialId: number, adTemplateDataFieldIdsName: string, displayWidth: number, displayHeight: number, customerNumber: string): Observable<any> {
        let apiUrl = "/api/designAd/selectMediaAsAdTemplateImage?systemName=" + systemName + "&systemKey=" + orderId + "&adMaterialId=" + adMaterialId + "&externalAdMaterialId=" + externalAdMaterialId + "&adTemplateDataFieldIdsName=" + adTemplateDataFieldIdsName;
        apiUrl += "&displayWidth=" + displayWidth + "&displayHeight=" + displayHeight + '&fileName=' + fileName;
        apiUrl += "&customerNumber=" + customerNumber;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public getAdTemplateImage(pathType, systemName: string, orderId: number, adMaterialId: number, externalAdMaterialId: number, adTemplateDataFieldIdsName: string, isEmblem: boolean, isTemp: boolean): Observable<any> {
        let apiUrl = "/api/designAd/GetAdTemplateImage?systemName=" + systemName + "&systemKey=" + orderId + "&adMaterialId=" + adMaterialId + "&externalAdMaterialId=" + externalAdMaterialId + "&adTemplateDataFieldIdsName=" + adTemplateDataFieldIdsName;
        apiUrl += "&isEmblem=" + isEmblem + "&isTemp=" + isTemp + "&pathType=" + pathType;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

}
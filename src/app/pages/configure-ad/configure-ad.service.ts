
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable ,  Subject } from 'rxjs';
import { ICreateOrderRequest } from '../../models/create-order.request.model';
import { IOrder, IVolumeDiscount } from '../../models/order-item.model';
import { IOrderItemPrice } from '../../models/order-item-price.model';
import { IAvailableDates } from '../../models/availabledates.model';
import { IImpression } from '../../models/impression.model';
import { IGetPriceRequest, IUpdateOrderState } from '../../models/getPrice.request.model';
import { ServerResponse } from '../../models/server.response.model';
import { isNullOrUndefined } from 'util';
import { IOptOutSubscription } from '../../models/optoutsubscription.model';


@Injectable()
export class ConfigureAdService extends BaseService {

    currentTabIndex: number = 0;
    tabIndexObservable: Subject<number> = new Subject<number>();

    constructor(private http: HttpClient) {
        super();
    }

    public getVolumeDiscounts(orderId, orderItemId): Observable<IVolumeDiscount['any']> {
        let apiUrl = "/api/configure/volumeDiscounts";
        apiUrl += "?orderID=" + orderId + "&orderItemID=" + orderItemId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getAvailableDates(orderId, orderItemId): Observable<IAvailableDates['any']> {
        let apiUrl = "/api/configure/availabledates";
        apiUrl += "?orderid=" + orderId + "&currentOrderItemId=" + orderItemId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public setTabIndex(index: number) {
        this.tabIndexObservable.next(index);
    }

    public getTabIndex() {
        return this.currentTabIndex;
    }

    public getOrderItemPrice(requestObject: IGetPriceRequest): Observable<IOrderItemPrice['any']> {

        let apiUrl = "/api/order/getOrderItemPrice";
        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }
    public getImpressions(orderId: number, orderItemId: number): Observable<IImpression['any']> {
        let apiUrl = '/api/configure/impression?orderid=' + orderId + '&orderitemid=' + orderItemId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));

    }

    public savedraft(requestObject: IGetPriceRequest): Observable<any> {
        let apiUrl = "/api/configure/saveDraft";
        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }

    public reviewAndSubmit(requestObject: IGetPriceRequest): Observable<any> {
        let apiUrl = "/api/configure/reviewAndSubmit";
        return this.http.post(apiUrl, requestObject).pipe(
            map(this.mapServerErrorResponse),
            catchError(this.handleError),);
    }

    public getDFPOrderDetails(orderId: number, orderItemId: number): Observable<ServerResponse['Result']> {
        let apiUrl = '/api/configure/configureDFP?orderID=' + orderId + '&orderItemID=' + orderItemId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public deleteDfpOrderItem(orderItemId: number) {
        let apiUrl = '/api/order/deleteDFPOrderItem?orderItemID=' + orderItemId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public createNewDfpOrderItem(orderId: number, sectionId: number, adSizeId: number, itemLength: number): Observable<ServerResponse['Result']> {
        let apiUrl = '/api/order/createNewDfpOrderItem?orderID=' + orderId + '&sectionID=' + sectionId + '&adSizeID=' + adSizeId + '&itemLength=' + itemLength;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public deleteAdditionalOrderItem(orderItemId: number) {
        let apiUrl = '/api/order/deleteAdditionalOrderItem?orderItemID=' + orderItemId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public createNewAdditionalOrderItem(orderId: number, sectionId: number, productTypeId: number): Observable<ServerResponse['Result']> {
        let apiUrl = '/api/order/createNewAdditionalOrderItem?orderID=' + orderId + '&sectionID=' + sectionId + '&productTypeId=' + productTypeId;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public checkDfpInventory(orderId: number, orderItemId: number, quantity: number, isProductConfigured: boolean): Observable<ServerResponse['Result']> {
        let apiUrl = '/api/configure/checkDFPInventory?orderID=' + orderId + '&orderItemID='
            + orderItemId + '&quantity=' + quantity + '&isProductConfigured=' + isProductConfigured;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public getDfpCities(stateID: number): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/configure/getDFPLocations?stateID=" + stateID;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));
    }

    public updateOrderItem(requestObject: IUpdateOrderState): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/order/updateOrderState";
        return this.http.post(apiUrl, requestObject).pipe(catchError(this.handleError));
    }

    public applyCouponCode(id, code, ignore): Observable<ServerResponse> {
        let apiUrl = "/api/order/applyCouponCode?orderId=" + id + "&code=" + code;

        if(!isNullOrUndefined(ignore)) {
            apiUrl += "&ignoreProgressBar=" + ignore;
        }

        return this.http.post(apiUrl, {}).pipe(
            map(this.mapServerErrorResponse),
            catchError(this.handleError),);
    }

    public clearCoupon(id): Observable<ServerResponse['Result']> {
        let apiUrl = "/api/order/clearCoupon?orderId=" + id;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public getSubsections(orderId: number, orderItemId: number, sectionId: number): Observable<ServerResponse['Result']> {
        let apiUrl = "api/order/getSubsections?sectionId=" + sectionId + "&orderItemId=" + orderItemId + "&orderid=" + orderId;
        return this.http.post(apiUrl, {}).pipe(catchError(this.handleError));
    }

    public deleteSubOptOutFromCache(orderId: number) : Observable<ServerResponse['Result']>{
        let apiUrl = '/api/configure/deleteSubOptOutFromCache?orderId=' + orderId;
        return this.http.delete(apiUrl).pipe(catchError(this.handleError));
    }

    public saveSubOptOutInCache(requestObject: IOptOutSubscription): Observable<any> {
        let apiUrl = "/api/configure/saveSubOptOutInCache";
        console.log('request obj'+requestObject);
        return this.http.post(apiUrl,requestObject).pipe(map(this.mapServerErrorResponse),catchError(this.handleError),);
    }

    public getSubOptOutFromCache(orderId: number): Observable<ServerResponse['Result']> {
        let apiUrl = '/api/configure/getSubOptOutFromCache?orderId=' + orderId ;
        return this.http.get(apiUrl).pipe(catchError(this.handleError));

    }
}

import {catchError} from 'rxjs/operators';
import { BaseService } from "../../shared/base.service";
import { IUserDetails, ICustomer } from "../../models/user-details.model";
import { ICreditCard } from "../../models/credit-card.model";
import { HttpClient } from "@angular/common/http";
import { IPurchaseOrder } from "../../models/purchaseOrder.model";
import { Observable } from "rxjs";
import { IGooglePlaceSearchResponse, IGooglePlaceDetailResponse } from "../../models/address.modal";
import { Injectable } from "@angular/core";

@Injectable()
export class ReviewOrderService extends BaseService {

    private userDetail: IUserDetails = Object.assign({});
    private newCardDetails: ICreditCard = null;
    private saveCreditCardInfo: boolean = false;
    private cardId: number = null;
    private isPaymentFormValid: boolean = true;
    private isAccountFormValid: boolean = true;
    private CredituserSameAsBuyer: boolean = false;

    private soldToCustomer;

    private confirmedOrder;

    constructor(private http: HttpClient) {
        super();
    }

    public setUserDetails(passedUserDetails: IUserDetails) {
        this.userDetail = Object.assign({}, passedUserDetails);
        this.userDetail.ConfirmEmail = this.userDetail.AditEmail;
    }

    public getUserDetails(): IUserDetails {
        return this.userDetail;
    }

    public setNewCardDetails(passedCardDetails: ICreditCard) {
        this.newCardDetails = passedCardDetails;
    }

    public getNewCardDetails(): ICreditCard {
        return this.newCardDetails;
    }

    public setCardId(cardId) {
        this.cardId = cardId;
    }

    public getCardId() {
        return this.cardId;
    }

    public setSaveCreditCardInfo(saveCreditCardInfo) {
        this.saveCreditCardInfo = saveCreditCardInfo;
    }

    public getSaveCreditCardInfo() {
        return this.saveCreditCardInfo;
    }

    public setIsAccountFormValid(isFormValid: boolean) {
        this.isAccountFormValid = isFormValid;
    }

    public getIsAccountFormValid(): boolean {
        return this.isAccountFormValid;
    }

    public setIsPaymentFormValid(isFormValid: boolean) {
        this.isPaymentFormValid = isFormValid;
    }

    public getIsPaymentFormValid(): boolean {
        return this.isPaymentFormValid;
    }

    public setCredituserSameAsBuyer(credituserSameAsBuyer: boolean) {
        this.CredituserSameAsBuyer = credituserSameAsBuyer;
    }

    public getCredituserSameAsBuyer(): boolean {
        return this.CredituserSameAsBuyer;
    }

    public setConfirmedOrder(confirmedOrder) {
        this.confirmedOrder = Object.assign({}, confirmedOrder);
    }

    public getConfirmedOrder() {
        return this.confirmedOrder;
    }

    public setSoldToCustomer(soldToCustomer) {
        this.soldToCustomer = soldToCustomer;
    }

    public getSoldToCustomer() {
        return this.soldToCustomer;
    }
    
    public getGoogleAddressSuggestions(searchText: string): Observable<IGooglePlaceSearchResponse['any']>{
        const apiUrl = "/api/user/googleplaces?text=" + searchText;
        return this.http.get<Observable<IGooglePlaceSearchResponse[]>>(apiUrl).pipe(catchError(this.handleError));
    }

    public getGooglePlaceDetail(placeId: string): Observable<IGooglePlaceDetailResponse['any']> {
        const apiUrl = "/api/user/googleplacedetail?id=" + placeId;
        return this.http.get<Observable<IGooglePlaceDetailResponse>>(apiUrl).pipe(catchError(this.handleError));
    }
}
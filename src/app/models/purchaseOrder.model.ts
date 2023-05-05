import { ICreditCard } from "./credit-card.model";
import { IUserDetails } from "./user-details.model";
import { IAddress } from "./address.modal";
import { IBusinessType } from "./business-type.model";

export interface IPurchaseOrder {
    CouponCode: string;
    OrderNotes: string;
    FirstName: string;
    LastName: string;
    AditEmail: string;
    ConfirmEmailAddress: string;

    Address: IAddress;

    IsAdvertiser: boolean;
    SoldToCustomerID: string;
    
    PhoneNumber: string;
    BusinessName: string;
    BusinessType: IBusinessType;
    IsFullDiscount: boolean;

    CreditCard: ICreditCard;
    
    CreditCardType: IIDString;
    HasProofreadAd: boolean;

    CredituserSameAsBuyer: boolean,
    SaveCreditCardInfo: boolean;
    PaymentMethod: IIDString;
    AdItCustomerNumber: string;
    CreditCardId: number;
    IsDfpOrder: boolean;    
}

export interface IIDString {
    Id: number,
    Name: string;
}

import { ICreditCard } from './credit-card.model';
import { IAddress } from './address.modal';
import { IBusinessType } from './business-type.model';

export interface IUserDetails {

  BusinessType: IBusinessType;
  CustomerId: number;
  CustomerName: string;
  CustomerNumber: string;
  CustomerTypeId: number;
  FirstName: string;
  LastName: string;
  Phone: string;
  Address: IAddress;
  BusinessName: string;
  CreditCards: ICreditCard[];
  IsAdItInReadOnlyMode: boolean;
  IsBusinessUser: boolean;
  SelectedBusinessTypeValue: string;
  SsorEmail: string;
  AditEmail: string;
  ConfirmEmail?: string;
  IsLocAllowed: boolean;
  IsAdmin: boolean;
  CanPurchaseWithLineOfCredit: boolean;
  IsAdvertiser: boolean;
  SoldToCustmers: ICustomer[];
  any:any;
  
}

export interface ICustomer {
  CustomerID: number;
  CustomerName: string;
  CustomerNumber: string;
}

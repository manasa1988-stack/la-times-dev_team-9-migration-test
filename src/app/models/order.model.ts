import { IOrder } from './order-item.model';

export interface IOrderListItem {
  IsAdItInReadOnlyMode: boolean;
  AdSSId: number;
  AditId: number;
  IsExpiredInAdit: boolean;
  LastUpdated: Date;
  FirstRunDate: Date;
  LastRunDate: Date;
  OrderNotes: string;
  ServiceType: string;
  PackageDescription: string;
  Price: number;
  Status: IOrderStatus;
  StatusName: string;
  IsDraft: boolean;
  IsQueued: boolean;
  IsCreatedInAdSS: boolean;
  IsObitOrder: boolean;
  Description: string;
  PreventOrderUpdates: boolean;
  AllowOrderCancellation: boolean;
  AllowOrderRenewal: boolean;
  ShowCustomerProof: boolean;
  IsModifiedBeyondSupport: boolean;

  isCollapsed?: boolean;
  isChecked?: boolean;
  isActionClicked?: boolean;
  order?: IOrder;
  isSummaryLoaded: boolean;
}

export interface IOrderStatus {
    Id: number;
    Name: string;
}

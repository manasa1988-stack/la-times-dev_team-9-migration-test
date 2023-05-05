import { IEditOrderItem } from "./edit-order-item.model";

export interface IGetPriceRequest {
    ApiEditOrderItemData: IEditOrderItem;
    FormCollection: any;
}


export interface IUpdateOrderState {
    EditOrderItemData: IEditOrderItem;
    FormCollection: any;
}
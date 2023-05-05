import { IOrder, IAdMaterial } from "./order-item.model";

export interface IEditOrder {
        Order: IOrder;
        IsAdminUser: boolean;
        AllowEdits: boolean;
        ClickThroughUrl: string;
        IsOnlineClassifiedWithNoMaterial: boolean;
        NewAdMaterial: IAdMaterial;
}

export interface IOrderInvoiceNote {
        AditId: number,
        OrderNotes: string
}

export interface IUpdateImageListAttribute {
        SystemName: string;
        SystemKey: number;
        ImageListAttributeID: number;
        ImageListAttributeName: string,
        FormCollection: Object;
}

export interface IUpdateInputAttribute {
        SystemName: string;
        SystemKey: number;
        FormCollection: Object;
}

export interface IUpdateAdMaterial {
        SystemName: string;
        SystemKey: number;
        AdMaterialID: number;
        EffectiveDates: string[];
        ClickThroughURL: string;
        OldPrice: number;
}

export interface IUpdateMaterialDirectory
{
        source:IAdMaterial;
        target:IAdMaterial;
        orderId:number;
}
import { ILegalDoc } from "./order-item.model";

export interface IUploadLegalDocResponse {
    IsSuccessful: boolean;
    DocumentName: string;
    DocumentId: number;
}

export interface IUploadDocExternal {
    LstApiUploadLegalDoc: ILegalDoc[];
    OrderId:number;
    OrderItemId: number;
any:any;
}

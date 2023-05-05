import { IAttribute } from "./order-item.model";

export interface IUpsellOption extends IAttribute {
    IsChecked?: boolean;
    OrderId?: number;
    ImageList ?: ImageList[];  
    SubGroup:string;
}



export interface ImageList {
    isImageUploaded: boolean;
    imageUrl: any;
}

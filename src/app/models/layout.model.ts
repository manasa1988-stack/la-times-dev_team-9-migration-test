import { IAdSize, IAdTemplate } from "./order-item.model";
import { IEditOrderItem } from "./edit-order-item.model";

export interface ILayoutCarouselItem {
    ApiapplicableAdSize: ILayout[];
    EditOrderItemData: IEditOrderItem;
    isPrintOrderItem: boolean;
    ShowColorOption: boolean;
    IsColorOnly: boolean;
    AdMaterialStepText: string;
    IsDesignAdOnly: boolean;
    IsPrepopulated: boolean;
    any:any;
}

export interface ILayout {
    Ischecked: boolean;
    AdSizeImageURL: string;
    AdSize: IAdSize;
    FileTypesPermittedForUploadedAdForDisplay: string;
    MaxFileSizeForUploadedAd: string;
    MaximumDPI: string;
}

export interface ITemplateItem{
    AdTemplates: IAdTemplate;
    adSizePreview: string;
    isChecked: boolean;
    EditOrderItemDataAdTemplateCode: string;
    Ischecked?: boolean;
}

// export interface ITemplates{
//     apiConnectedTemplatedetails: ITemplateItem[];    
//     customerNumber: string;
//     AdSize: IAdSize;
    
// }
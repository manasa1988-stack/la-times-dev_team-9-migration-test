import { IAdTemplate, IAdMaterial, IAdSize, IAttribute } from "./order-item.model";

export interface IGetDesignAdRequest {
    OrderID: number;
    OrderItemID: number;
    AdMaterialID: number;
    ExternalMaterialID: number;
    AdSizeID: number;
    ID: string;
    PID: string;
    IsColor: boolean;
    PackageCode: string;
    HasEdited: boolean;
    ChangedAdSizeOnDesignAd: string;
    FormCollection: any;
}


export interface IDesignAdMaterial {
    IsDataTransferred: boolean;
    IsObit: boolean;
    IsVendorUser: boolean;
    IsRedirect: boolean;
    RedirectURL: string;
    CancelUrl: string;
    ExisitingLines: any;
    AdTemplate: IAdTemplate;
    AdTemplates: IAdTemplate[];
    AdMaterials: IAdMaterial[];
    ApplicableAdSizes: IAdSize[];
    OrderAttributes: IAttribute[];
    SubCategoryId: number;
    UseWebId: boolean;
    WebId: string;
    HtmlStyles: string[];
}

export interface IGetDesignAdPreviewRequest {
    OrderID: number;
    SystemName: string;
    OrderItemID: number;
    SectionId: number;
    AdMaterialId: number;
    ExternalAdMaterialId: number;
    AdSizeId: number;
    AdTemplateCode: string;
    IsColor: boolean;
    PackageCode: string;
    FormCollection: any;
}

export interface IDesignAdPreview {
    ImageUrlX2: string;
    NumberOfLine: number;
    AdMaterialHeight: number;
    AdMaterialHeightInPixels: number;
    OrderPrice: string;
    NetPrice: string;
    Commission: string;
}

export interface ISaveDesignAdRequest {
    SystemName: string;
    SystemKey: number;
    SectionID: number,
    PositionID: number;
    OrderID: number;
    OrderItemID: number;
    AdTemplateCode: string;
    AdMaterialID: number;
    ExternalAdMaterialID: number;
    AdSizeID: number;
    IsColor: boolean;
    FormCollection: any;
    CustomerNumber: string;
    PackageCode: string;
}

export interface ISaveDesignAd {
    IsRedirect: boolean;
    RedirectURL: string;
    CancelUrl: string;
    ExisitingLines: number;
}

export interface IEmblem {
    SystemKey: number;
    SystemName: string;
    AdMaterialId: number;
    ExternalAdMaterialId: number; 
    AdTemplateDataFieldIdsName: string;
    BUCode: string;
    FileName: string;
    PackageCode: string; 
    CustomerNumber: string;
  }

import { IGetDesignAdRequest } from "./DesignAd.model";
import { IAdSize, IAttribute, ISection, IAdTemplate, IAdMaterial } from "./order-item.model";

export interface IGetDesignAdExternalRequest extends IGetDesignAdRequest{
    SystemName: string,
    SectionID: number,
    PositionID: number,
    IsEditing: boolean,
    CSR: string,
    CustomerNumber: string,
    IsUpload: boolean,
    CopiedOrderID: number,
}

export interface IDocumentAdMaterial {
    IsSuccessfullySubmittedOrder: boolean;
    SelectedAdSize: IAdSize;
    Section : ISection;
    DownloadLink : string;
    FileExtensions:string;
    CSRFileExtensions: string;
    Material : IAdMaterial;
    UseMobileUploadPlugin : boolean;
    MaxFileSizeForUploadedAd: number;
    MobileTakePhotoMessage: string;
    UseNewCropper:boolean;
    PDFImageHorizontalDPIRatio: number;
    PDFImageVerticalDPIRatio: number;
    PackageCode: string;
    IsDataTransferred: boolean;
    IsVendorUser: boolean;
    IsRedirect: boolean;
    RedirectURL: string;
    CancelUrl: string;
    ExisitingLines: any;
    AdTemplate: IAdTemplate;
    AdTemplates: IAdTemplate[];
    AdMaterials: IAdMaterial[];
    ApplicableAdSizes : IAdSize[];
    OrderAttributes: IAttribute[];
    SubCategoryId: number;
    HtmlStyles: string[];
    UseWebId: boolean;
    WebId: string;
}
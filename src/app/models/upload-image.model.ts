export interface IUploadImage{
    OrderId: number;
    AdMaterialId: number;
    ExternalAdMaterialId: number;
    SectionId: number;
    AdSizeId: number;
    CropLeft: number;
    CropTop: number;
    CropWidth: number;
    CropHeight: number;
    CropX: number;
    CropY: number;
    CropScaleX: number;
    CropScaleY: number;
    CropRotate: number;
    LastUploadedFileExtension: string;
}
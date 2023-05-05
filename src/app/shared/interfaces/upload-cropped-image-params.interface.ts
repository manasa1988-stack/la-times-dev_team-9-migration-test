export interface IUploadCroppedImageParams {
    DraftId: string;
    LayoutId: string;
    AttributeId: string;
    CropX: number;
    CropY: number;
    CropScaleX: number;
    CropScaleY: number;
    CropRotate: number;
    CropWidth: number;
    CropHeight: number;
    IsRecropping: boolean;
    CropCropperImageWidth: number;
    CropCropperImageHeight: number;
}

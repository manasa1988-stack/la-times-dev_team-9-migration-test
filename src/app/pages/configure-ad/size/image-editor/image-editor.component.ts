import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPhoto } from '../../../../models/photo.model';
import { BaseClass } from '../../../../shared/base.class';
import { LayoutService } from '../layout.service';
import { IOrderItem, IOrder } from '../../../../models/order-item.model';
import { IUploadImage } from '../../../../models/upload-image.model';
import { OtherInfoService } from '../../other-info/other-info.service';
import { ILayout } from '../../../../models/layout.model';
import { isNullOrUndefined } from 'util';
import { PhotoLibraryService } from '../../../photo-library/photo-library.service';
import { DesignAService } from '../../../design-ad/design-ad.service';
import { UploadDocService } from '../../../upload-doc/upload-doc.service';
import { IGetDesignAdExternalRequest } from '../../../../models/designDocument.model';
import { FormControl } from '@angular/forms';
import { StorageService } from '../../../../shared/storage.service';
import { CookieService } from '../../../../shared/cookies.service';
import { ServerResponse } from '../../../../models/server.response.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html'
})
export class ImageEditorComponent extends BaseClass {

  @ViewChild('angularCropper',{static:true}) public angularCropper: AngularCropperjsComponent;

  imageUrl = 'wwwroot/assets/img/photo.jpg';
  photoInput = new FormControl();
  photoLibrary: IPhoto[] = [];

  showErrorMessage: boolean = false;
  errorMessage: string;
  flipValX: number = 1;
  flipValY: number = 1;
  fileExtension: string;
  saveAndUploadImage: IUploadImage = <IUploadImage>{};
  config: any = {
    checkCrossOrigin: false,
    zoomable: true,
    rotatable: true,
    scalable: true
  };
  isEditing: boolean = false;
  isEditImage: boolean = false;
  isEditUpsellImage: boolean = false;
  photoIndex: number = 0;
  attributeId: number = 0;
  allowedExtentions: string[] = ['pdf', 'jpeg', 'jpg', 'tiff', 'tif'];
  defaultWidth: any=0;
  actualWidth: any;
  actualHeight: any;
  isImageChanged: boolean = false;
  odrerId: number;
  systemName: string;
  currentOrderItemId: number;
  newAdMaterialId: number;
  newExternalMaterialId: number;
  adMaterialId: number;
  externalMaterialId: number;
  adSizeId: number;
  sectionId: number;
  isColor: boolean;
  isTemplateImage: boolean;
  dataFieldIdName: string;
  widthInPixels: number;
  heightInPixels: number;
  conversionUploadDocRatio: number;
  isCropperReady: boolean = true;

  imageUploadedWithError: boolean = false;
  showSaveToLogoLibCheckbox: boolean = false;
  isFromDesignAdTemplate: boolean = false;
  isDocumentUploaded: boolean = false;
  saveToLogoLib: boolean = false;
  documentUploadUrl: string = '';
  saveFinalCsrDocumentObject: IGetDesignAdExternalRequest;
  isEditOrder: boolean = false;
  customerNumber: string;
  imageType: string;
  isUploadingImage: boolean = false;
  showLoader: boolean = true;
  isRecropping: boolean = false;

  serverResponse: ServerResponse = null

  constructor(public activeModal: NgbActiveModal,
    private layoutService: LayoutService,
    private otherInfoService: OtherInfoService,
    private photoLibraryService: PhotoLibraryService,
    private designAService: DesignAService,
    private uploadDocService: UploadDocService,
    private storageService: StorageService,
    private cookieService: CookieService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {

    if (this.isFromDesignAdTemplate) {
      this.allowedExtentions = ['jpg', 'jpeg', 'pdf', 'png', 'gif'];
    }
    if (this.isDocumentUploaded) {
      this.config = {
        checkCrossOrigin: false,
        zoomable: false,
        autoCropArea: 0,
        rotatable: false,
        scalable: true,
        guides: false,
        highlight: false,
        aspectRatio: NaN,
        // minCropBoxWidth: this.widthInPixels,
        minCropBoxHeight: 1
      };
    }
    else {
      this.config = {
        autoCropArea: 0,
        viewMode: 0,
        checkCrossOrigin: false,
        zoomable: true,
        rotatable: true,
        scalable: true,
        guides: false,
        aspectRatio: this.widthInPixels / this.heightInPixels,
        // minCropBoxWidth: this.widthInPixels,
        // minCropBoxHeight: this.heightInPixels
      };
    }

    this.setEventListeners();
    if (isNullOrUndefined(this.customerNumber) || this.customerNumber == '') {
      this.customerNumber = isNullOrUndefined(this.storageService.getUserInfo()) ? null : this.storageService.getUserInfo().customerNumber;
    }
    if (!this.isEditImage && !this.isEditUpsellImage && !this.isDocumentUploaded && !isNullOrUndefined(this.customerNumber) && this.customerNumber !== '') //this.systemName != "adit"
    {
      this.getPhotoLibrary();
    }
    this.setExistingImage();
  }

  setEventListeners() {
    this.angularCropper.image.nativeElement.addEventListener('ready', (event) => {
      this.showLoader = true;
      if (this.isDocumentUploaded)
        this.calculateWidthForUploadDoc();
    });

    this.angularCropper.image.nativeElement.addEventListener('load', (event) => {
      // this.showLoader = true;
    });

    this.angularCropper.image.nativeElement.addEventListener('zoom', (event) => {
      ((this.isImageChanged) && (this.angularCropper.cropper.getData().width < this.widthInPixels || this.angularCropper.cropper.getData().width < this.heightInPixels)) ?
        (this.showErrorMessage = true, this.errorMessage = 'The cropped area selected is smaller than the required size', this.imageUploadedWithError = true)
        : (this.showErrorMessage = false, this.imageUploadedWithError = false)
    });

    this.angularCropper.image.nativeElement.addEventListener('crop', (event) => {
      // if (this.isDocumentUploaded) {
      //   this.calculateWidthForUploadDoc();
      // }
      // else {
      //   (this.isImageChanged && (event.detail.width < this.widthInPixels || event.detail.height < this.heightInPixels)) ?
      //     (this.showErrorMessage = true, this.errorMessage = 'The cropped area selected is smaller than the required size', this.imageUploadedWithError = true)
      //     : (this.showErrorMessage = false, this.imageUploadedWithError = false)
      // }
      if (!this.isDocumentUploaded) {
          (this.isImageChanged && (event.detail.width < this.widthInPixels || event.detail.height < this.heightInPixels)) ?
          (this.showErrorMessage = true, this.errorMessage = 'The cropped area selected is smaller than the required size', this.imageUploadedWithError = true)
          : (this.showErrorMessage = false, this.imageUploadedWithError = false)
      }
      else{        
          if ( event.detail.width != this.actualWidth) {
            this.angularCropper.cropper.setCropBoxData({
              width: this.defaultWidth
            });
          }       
      }
    });
  }

  cropperTouchStart(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  setExistingImage() {

    this.showLoader = false;

    if (this.isEditUpsellImage) {
      this.isImageChanged = true;
      this.imageUrl = 'api/configure/GetImageListAttributeImage?systemName=' + this.systemName + '&systemKey=' + this.odrerId + '&imagePosition=' + this.photoIndex + '&imageListAttributeId=' + this.attributeId + '&imageType=' + this.imageType + '&isEditing=' + this.isEditing + '&ts=' + new Date().getTime();

    }
    else if (this.isEditImage) {
      this.isImageChanged = true;
      this.imageUrl = 'api/configure/getTempImage?orderId=' + this.odrerId + '&adMaterialId=' + this.adMaterialId + '&externalAdMaterialId=' + this.externalMaterialId + '&pathType=original&ts=' + new Date().getTime();
    }
    else if (this.isDocumentUploaded) {
      this.isImageChanged = true;
      this.imageUrl = this.documentUploadUrl;
    }

    // this.showLoader = true;
  }

  cropperImageSetter(imageURL) {

    this.angularCropper.cropper.destroy();

    this.imageUrl = imageURL;

    this.angularCropper.cropper.replace();

  }


  getPhotoLibrary() {
    this.photoLibraryService.getPhotoLibrary(this.customerNumber)
      .subscribe(data => {
        this.photoLibrary = data;
        this.photoLibrary.forEach( data => {
          data.Ischecked = false;
        })
      })
  }

  uploadImage(event) {
    this.serverResponse = null;
    this.isUploadingImage = true;
    this.photoInput.disable();
    let inputValue = event.target.files[0];
    let fileName = inputValue['name'];
    let parts = fileName.split('.');
    this.fileExtension = parts[parts.length - 1];
    this.clearPictureAttachment();
    if (this.allowedExtentions.includes(this.fileExtension.toLowerCase())) {
      if (inputValue.size <= 10485760) {
        this.showErrorMessage = false;
        this.readFile(inputValue);
      }
      else {
        this.setDefaultImage();
        this.isImageChanged = false;
        this.showErrorMessage = true;
        this.isUploadingImage = false;
        this.photoInput.enable();
        this.errorMessage = "File is too large, maximum permitted file size is: 10MB.";
      }
    } else {
      this.setDefaultImage();
      this.showErrorMessage = true;
      this.isImageChanged = false;
      this.isUploadingImage = false;
      this.photoInput.enable();
      this.errorMessage = "File(s) has invalid extension, allowed extensions are - ";
      if (this.isFromDesignAdTemplate)
        this.errorMessage += "jpg, jpeg, pdf, png, gif";
      else
        this.errorMessage += "pdf, jpeg, tiff";
    }
  }

  readFile(inputValue: any): void {
    this.showLoader = false;
    var file: File = inputValue;
    let formData: FormData = new FormData();
    formData.append('myFile', file, file.name);
    if (this.isTemplateImage) {
      this.isRecropping = false;
      this.designAService.uploadAdTemplateImage(formData, this.systemName, this.odrerId, this.adMaterialId, this.externalMaterialId, this.dataFieldIdName, this.widthInPixels, this.heightInPixels)
        .subscribe((data) => {
          if (data.IsSuccessful) {
            this.isImageChanged = true;
            this.cropperImageSetter('api/designAd/GetAdTemplateImage?systemName=' + this.systemName + '&systemKey=' + this.odrerId + '&adMaterialId=' + this.adMaterialId + '&externalAdMaterialId=' + this.externalMaterialId + '&pathType=Original&adTemplateDataFieldIdsName=' + this.dataFieldIdName + '&isEmblem=false&isTemp=true&ts=' + new Date().getTime());
          } else {
            this.showLoader = true;
            this.showErrorMessage = true;
            this.errorMessage = data.ValidationResult.Errors[0].ErrorMessage;
            this.setDefaultImage();
          }

          this.isUploadingImage = false;
          this.photoInput.enable();
        });
    }
    else {
      this.layoutService.uploadImage(formData, this.odrerId, this.sectionId, this.adSizeId, this.adMaterialId, this.externalMaterialId)
        .subscribe((data) => {
          if (data.IsSuccessful) {
            this.isCropperReady = false;
            this.isImageChanged = true;
            if (!data.IsCroppingRequired) {
              this.activeModal.close({ data: 'acceptAndContinue' });
            }
            else
              this.cropperImageSetter('api/configure/getTempImage?orderId=' + this.odrerId + '&adMaterialId=' + this.adMaterialId + '&externalAdMaterialId=' + this.externalMaterialId + '&pathType=temporary&ts=' + new Date().getTime());
          } else {
            this.showErrorMessage = true;
            this.showLoader = true;
            this.errorMessage = data.ValidationResult.Errors[0].ErrorMessage;
            this.setDefaultImage();
          }

          this.isUploadingImage = false;
          this.photoInput.enable();
        });
    }
  }

  accept() {
    let croppedData = this.angularCropper.cropper.getData();
    this.serverResponse = null;
    if (this.isImageChanged) {
      this.isUploadingImage = true;
      if (this.isTemplateImage) {
        console.log('temp image');
        this.saveCroppedTemplateImage();
      }
      else if (this.isDocumentUploaded) {
        this.saveFinalCSRDocument();
      }
      else {
        if (!this.isEditUpsellImage) {

          let croppedData = this.angularCropper.cropper.getData();
          this.saveAndUploadImage.OrderId = this.odrerId;
          this.saveAndUploadImage.AdMaterialId = this.newAdMaterialId ? this.newAdMaterialId : this.adMaterialId;
          this.saveAndUploadImage.ExternalAdMaterialId = this.newExternalMaterialId ? this.newExternalMaterialId : this.externalMaterialId;
          this.saveAndUploadImage.SectionId = this.sectionId;
          this.saveAndUploadImage.AdSizeId = this.adSizeId;
          this.saveAndUploadImage.CropLeft = this.isEditOrder ? Number(croppedData.x.toFixed(0)) : 0;
          this.saveAndUploadImage.CropTop = this.isEditOrder ? Number(croppedData.y.toFixed(0)) : 0;;
          this.saveAndUploadImage.CropWidth = Number(croppedData.width.toFixed(0));
          this.saveAndUploadImage.CropHeight = Number(croppedData.height.toFixed(0));
          this.saveAndUploadImage.CropX = Number(croppedData.x.toFixed(0));
          this.saveAndUploadImage.CropY = Number(croppedData.y.toFixed(0));
          this.saveAndUploadImage.CropScaleX = croppedData.scaleX;
          this.saveAndUploadImage.CropScaleY = croppedData.scaleY;
          this.saveAndUploadImage.CropRotate = croppedData.rotate;
          this.saveAndUploadImage.LastUploadedFileExtension = "." + this.fileExtension;

          console.log('accept image');
          console.log(this.saveAndUploadImage);

          if (this.isEditOrder) {
            this.layoutService.saveUserUploadedImage(this.saveAndUploadImage)
              .subscribe(data => {
                this.isUploadingImage = false;
                this.activeModal.close({ data: 'acceptAndContinue', IsWarningMessageShown: this.imageUploadedWithError });
              },
                (error) => {
                  this.isUploadingImage = false;
                  this.errorFromServer();
                }
              );
          }
          else {
            this.layoutService.saveUserUploadedImage(this.saveAndUploadImage)
              .subscribe(data => {
                this.isUploadingImage = false;
                this.activeModal.close({ data: 'acceptAndContinue', IsWarningMessageShown: this.imageUploadedWithError });
              },
                (error) => {
                  this.isUploadingImage = false;
                  this.errorFromServer();
                });
          }
        }
        else
          this.saveCroppedImageListAttribute();
      }
    }

  }

  errorFromServer() {
    this.serverResponse = <ServerResponse>{};
    this.serverResponse.IsSuccess = false;
    this.serverResponse.ErrorMessage = [{
      Key: "ServerError",
      Value: "There is an error from Server. Please try again after some time."
    }];
  }

  zoomIn() {
    this.angularCropper.cropper.zoom(0.1);
  }

  zoomOut() {
    this.angularCropper.cropper.zoom(-0.1);
  }

  rotate() {
    this.angularCropper.cropper.rotate(45);
  }

  flipX() {
    this.flipValX = this.flipValX * -1;
    this.angularCropper.cropper.scaleX(this.flipValX);
  }

  flipY() {
    this.flipValY = this.flipValY * -1;
    this.angularCropper.cropper.scaleY(this.flipValY);
  }

  reset() {
    setTimeout(() => { this.angularCropper.cropper.reset() }, 20)
  }

  onNotify($event) {
    this.showLoader = false;
    this.serverResponse = null;
    this.isUploadingImage = true;
    this.photoInput.disable();

    let parts = $event.selectedTile.Url.split('.');
    this.fileExtension = $event.selectedTile.Url.split('.').slice(-1).pop();
    if (this.allowedExtentions.includes(this.fileExtension.toLowerCase())) {
      this.isCropperReady = false;
      this.showErrorMessage = false;
      for (let photo of this.photoLibrary) {
        photo.Ischecked = (photo.Url != $event.selectedTile.Url) ? false : true;
      }

      if (this.isTemplateImage) {
        this.isRecropping = false;
        this.designAService.selectMediaAsAdTemplateImage($event.selectedTile.Name, this.systemName, this.odrerId, this.adMaterialId, this.externalMaterialId, this.dataFieldIdName, this.widthInPixels, this.heightInPixels, this.customerNumber)
          .subscribe(data => {
            if (data.IsSuccessful) {
              this.isCropperReady = false;
              this.isImageChanged = true;
              this.cropperImageSetter('api/designAd/GetAdTemplateImage?systemName=' + this.systemName + '&systemKey=' + this.odrerId + '&adMaterialId=' + this.adMaterialId + '&externalAdMaterialId=' + this.externalMaterialId + '&pathType=Original&adTemplateDataFieldIdsName=' + this.dataFieldIdName + '&isEmblem=false&isTemp=true&ts=' + new Date().getTime());
            }
            else {
              this.photoLibrary.find(data => data.Name == $event.selectedTile.Name).Ischecked = false;
              this.showLoader = true;
              this.showErrorMessage = true;
              this.errorMessage = data.ValidationResult.Errors[0].ErrorMessage;
              this.setDefaultImage();
            }

            this.isUploadingImage = false;
            this.photoInput.enable();
          })
      }
      else {
        this.layoutService.uploadPhotoLibraryAd(this.odrerId, this.sectionId, this.adSizeId, this.adMaterialId, this.externalMaterialId, $event.selectedTile.Name)
          .subscribe(data => {
            if (data.IsSuccessful) {
              this.isCropperReady = false;
              this.isImageChanged = true;
              if (!data.IsCroppingRequired) {
                this.activeModal.close({ data: 'acceptAndContinue' });
              }
              else {
                this.cropperImageSetter('api/configure/getTempImage?orderId=' + this.odrerId + '&adMaterialId=' + this.adMaterialId + '&externalAdMaterialId=' + this.externalMaterialId + '&pathType=temporary&ts=' + new Date().getTime())
              }
            }
            else {
              this.photoLibrary.find(data => data.Name == $event.selectedTile.Name).Ischecked = false;
              this.showLoader = true;
              this.showErrorMessage = true;
              this.errorMessage = data.ValidationResult.Errors[0].ErrorMessage;
              this.setDefaultImage();
            }

            this.isUploadingImage = false;
            this.photoInput.enable();
          })
      }

    } else {
      this.photoLibrary.find(data => data.Name == $event.selectedTile.Name).Ischecked = false;
      this.showLoader = true;
      this.showErrorMessage = true;
      this.isUploadingImage = false;
      this.photoInput.enable();
      this.setDefaultImage();
      this.errorMessage = "File(s) has invalid extension, allowed extensions are - pdf, jpeg, tiff";
    }
  }


  setDefaultImage() {
    if (this.isImageChanged) {
      this.cropperImageSetter('wwwroot/assets/img/photo.jpg');
      this.isImageChanged = false;
    };
  }

  saveCroppedImageListAttribute() {
    let croppedData = this.angularCropper.cropper.getData();
    let data = {
      "SystemKey": this.odrerId,
      "Orderitemid": this.currentOrderItemId,
      "ImageListAttributeId": this.attributeId,
      "ImagePosition": this.photoIndex,
      "ImageWidth": 640,
      "ImageHeight": 480,
      "CropX": Number(croppedData.x.toFixed(0)),
      "CropY": Number(croppedData.y.toFixed(0)),
      "CropScaleX": croppedData.scaleX,
      "CropScaleY": croppedData.scaleY,
      "CropRotate": croppedData.rotate,
      "CropWidth": Number(croppedData.width.toFixed(0)),
      "CropHeight": Number(croppedData.height.toFixed(0)),
      "SystemName": this.systemName,
      "IsEditing": this.isEditing,
      "LastUploadedFileExtension": this.fileExtension
    }
    this.otherInfoService.saveCroppedImageListAttribute(data)
      .subscribe(data => {
        this.isUploadingImage = false;
        if (data.IsSuccessful)
          this.activeModal.close({ data: 'acceptAndContinue' });
      },
        (error) => {
          this.isUploadingImage = false;
        })
  }

  saveCroppedTemplateImage() {
    let croppedData = this.angularCropper.cropper.getData();
    let data = {
      "SystemKey": this.odrerId,
      "AdMaterialId": this.adMaterialId,
      "ExternalAdMaterialId": this.externalMaterialId,
      "AdTemplateDataFieldIdsName": this.dataFieldIdName,
      "CropX": Number(croppedData.x.toFixed(0)),
      "CropY": Number(croppedData.y.toFixed(0)),
      "CropScaleX": croppedData.scaleX,
      "CropScaleY": croppedData.scaleY,
      "CropRotate": croppedData.rotate,
      "CropWidth": Number(croppedData.width.toFixed(0)),
      "CropHeight": Number(croppedData.height.toFixed(0)),
      "SaveLogoToCustomerLib": this.saveToLogoLib,
      "IsDealsOnTap": false,
      "SystemName": this.systemName,
      "IsRecropping": this.isRecropping,
      "CustomerNumber": this.customerNumber
    }
    this.designAService.saveCroppedTemplateImage(data)
      .subscribe(data => {
        this.isUploadingImage = false;
        if (data.IsSuccess)
          this.activeModal.close({ data: 'acceptAndContinue' });
      },
        (error) => {
          this.isUploadingImage = false;
        })
  }

  saveFinalCSRDocument() {
    let croppedData = this.angularCropper.cropper.getData();
    let data = {
      "AdTemplateDataFieldIDsName": "",
      "LastUploadedFileExtension": this.fileExtension,
      "IsRecropping": false,
      "CropLeft": Number(croppedData.x.toFixed(0)),
      "CropTop": Number(croppedData.y.toFixed(0)),
      "CropWidth": Number(croppedData.width.toFixed(0)),
      "CropHeight": Number(croppedData.height.toFixed(0)),
      "SystemName": this.saveFinalCsrDocumentObject.SystemName,
      "SectionID": this.saveFinalCsrDocumentObject.SectionID,
      "PositionID": this.saveFinalCsrDocumentObject.PositionID,
      "IsEditing": this.saveFinalCsrDocumentObject.IsEditing,
      "OrderID": this.saveFinalCsrDocumentObject.OrderID,
      "AdMaterialID": this.saveFinalCsrDocumentObject.AdMaterialID,
      "ExternalMaterialID": this.saveFinalCsrDocumentObject.ExternalMaterialID,
      "AdSizeID": this.saveFinalCsrDocumentObject.AdSizeID,
      "IsColor": this.saveFinalCsrDocumentObject.IsColor,
      "PackageCode": this.saveFinalCsrDocumentObject.PackageCode,
      "IsUpload": this.saveFinalCsrDocumentObject.IsUpload
    }
    this.uploadDocService.saveFinalCSRDocument(data)
      .subscribe(data => {
        this.isUploadingImage = false;
        if (data.IsSuccess)
          this.activeModal.close({ data: 'acceptAndContinue', response: data.Result });
      },
        (error) => {
          this.isUploadingImage = false;
        })
  }

  saveToLogoLibrary($event) {
    this.saveToLogoLib = $event.checked;
  }

  clearPictureAttachment() {
    this.photoInput.setValue('');
  }

  calculateWidthForUploadDoc() {
   let imageData = this.angularCropper.cropper.getImageData();
    this.defaultWidth = imageData.width / imageData.naturalWidth * this.conversionUploadDocRatio * this.widthInPixels;
    this.angularCropper.cropper.setCropBoxData({
      width: this.defaultWidth
    });

    this.actualWidth = this.angularCropper.cropper.getData().width;
    this.actualHeight = this.angularCropper.cropper.getData().height;
  }

}

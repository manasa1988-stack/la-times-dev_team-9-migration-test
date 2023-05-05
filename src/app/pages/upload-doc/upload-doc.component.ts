import { Component, OnInit } from '@angular/core';
import { BaseClass } from '../../shared/base.class';
import { UploadDocService } from './upload-doc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageEditorComponent } from '../configure-ad/size/image-editor/image-editor.component';
import { PreviewImageComponent } from '../configure-ad/size/preview-image/preview-image.component';
import { IGetDesignAdExternalRequest, IDocumentAdMaterial } from '../../models/designDocument.model';
import { ActivatedRoute, Params } from '@angular/router';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { isNullOrUndefined, isNull } from 'util';
import { FormControl } from '@angular/forms';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css'],
  providers: [DiscardModalService]
})
export class UploadDocComponent extends BaseClass {

  fileExtension: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string;
  allowedExtentions: string[] = ['doc', 'docx', 'pdf'];

  date: number;
  isMaterialUploaded: boolean = false;
  adMaterialUrl: string = '';
  uploadDocumentObject: any;
  isWhite: boolean = true;
  adSizeWidth: number;
  adSizeHeight: number;
  hideUploadedMaterial: boolean = false;
  croppedMaterialUrl: string;
  height: number = 0;

  designAdExternalRequest: IGetDesignAdExternalRequest;
  documentAdMaterial: IDocumentAdMaterial;
  isDataReady: boolean = false;
  orderId: number;
  adSizeId: number;
  adMaterialId: number;
  externalMaterialId: number;
  isColor: boolean;
  packageCode: string;
  sectionId: number;
  positionID: number;
  PubDatesCsv:string;
  isEditing: boolean;
  csr: string;
  CustomerNumber: string;
  upload: boolean
  photoInput = new FormControl();
  constructor(private uploadDocService: UploadDocService,
    private modalService: NgbModal,
    private currentRoute: ActivatedRoute,
    private discardModalService: DiscardModalService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.currentRoute.params.subscribe((params: Params) => {
      this.orderId = params['orderId'] ? params['orderId'] : null;
    });

    this.currentRoute.queryParams.subscribe((params: Params) => {
      this.adSizeId = params['adSizeId'] ? params['adSizeId'] : 0;
      this.isColor = params['isColor'] ? params['isColor'] : false;
      this.externalMaterialId = params['externalMaterialId'] ? params['externalMaterialId'] : 0;
      this.sectionId = params['sectionId'] ? params['sectionId'] : 0;
      //this.positionID = params['positionId'] ? params['positionId'] : 0;
      this.positionID = params['positionId'] ? params['positionId'] : null;
      this.PubDatesCsv = params['selectedPubDate'] ? params['selectedPubDate'] : null;
      this.isEditing = params['isEditing'] ? params['isEditing'] : false;
      this.packageCode = params['packageCode'] ? params['packageCode'] : '';
      this.csr = params['csr'] ? params['csr'] : '';
      this.CustomerNumber = params['CustomerNumber'] ? params['CustomerNumber'] : '';
      this.adMaterialId = params['adMaterialId'] ? params['adMaterialId'] : 0;
      this.upload = params['upload'] ? params['upload'] : false;
    });
    this.getDesignAdMaterial();
    this.date = new Date().getTime();
  }

  getDesignAdMaterial() {
    this.designAdExternalRequest = <IGetDesignAdExternalRequest>{};
    this.designAdExternalRequest.SystemName = "adit";
    this.designAdExternalRequest.SectionID = this.sectionId;
    this.designAdExternalRequest.PositionID = this.positionID;    
    //console.log("this.designAdExternalRequest.PositionID ", this.designAdExternalRequest.PositionID);
    this.designAdExternalRequest.IsEditing = this.isEditing;
    this.designAdExternalRequest.CSR = this.csr;
    this.designAdExternalRequest.CustomerNumber = this.CustomerNumber;
    this.designAdExternalRequest.IsUpload = this.upload;
    this.designAdExternalRequest.CopiedOrderID = 0;
    this.designAdExternalRequest.OrderID = this.orderId;
    this.designAdExternalRequest.OrderItemID = 0;
    this.designAdExternalRequest.AdMaterialID = this.adMaterialId;
    this.designAdExternalRequest.ExternalMaterialID = this.externalMaterialId;
    this.designAdExternalRequest.AdSizeID = this.adSizeId;
    this.designAdExternalRequest.ID = "";
    this.designAdExternalRequest.PID = '';
    this.designAdExternalRequest.IsColor = this.isColor;
    this.designAdExternalRequest.FormCollection = {};
    this.designAdExternalRequest.PackageCode = this.packageCode;
    this.designAdExternalRequest.HasEdited = true;
    this.designAdExternalRequest.ChangedAdSizeOnDesignAd = "";
    this.uploadDocService.getDesignAdMaterial(this.designAdExternalRequest).subscribe(data => {
      if (data.IsSuccess) {
        this.documentAdMaterial = data.Result;
        if (this.documentAdMaterial.DownloadLink.length > 0)
        {
          this.documentAdMaterial.DownloadLink = 'api' + this.documentAdMaterial.DownloadLink;
          if(this.documentAdMaterial.Material != null && this.documentAdMaterial.Material.UploadedFile != null && this.documentAdMaterial.Material.UploadedFile.Extension.length > 0)
          {
            this.fileExtension = "." + this.documentAdMaterial.Material.UploadedFile.Extension;  
          }
        }
        else
          this.documentAdMaterial.DownloadLink = '';
        this.designAdExternalRequest.AdMaterialID = !isNullOrUndefined(this.documentAdMaterial.Material) ? this.documentAdMaterial.Material.Id : 0;
        this.designAdExternalRequest.ExternalMaterialID = !isNullOrUndefined(this.documentAdMaterial.Material) ? this.documentAdMaterial.Material.ExternalId : this.designAdExternalRequest.ExternalMaterialID;
        this.height = !isNullOrUndefined(this.documentAdMaterial.Material) ? Number(this.documentAdMaterial.Material.Height.toFixed(4)) : 0;
        // this.height = !isNullOrUndefined(this.documentAdMaterial.Material) ? Number(this.documentAdMaterial.Material.Height) : 0;
        this.adMaterialUrl = "api/designAd/getCSRImage?systemName=" + this.designAdExternalRequest.SystemName + "&systemKey=" + this.designAdExternalRequest.OrderID + "&adMaterialId=" + this.designAdExternalRequest.AdMaterialID + "&externalAdMaterialId=" + this.designAdExternalRequest.ExternalMaterialID + "&isTemp=false" + "&ts=" + this.date;
        //this.getCurrentAdMaterialValue();
      }
      this.isDataReady = true;
    });

  }

  getCurrentAdMaterialValue() {
    if (!isNullOrUndefined(this.documentAdMaterial.Material)) {
      let currentMaterial = this.documentAdMaterial.AdMaterials.find(data => data.Id == this.documentAdMaterial.Material.Id);
      if (!isNullOrUndefined(currentMaterial)) {
        this.designAdExternalRequest.AdMaterialID = currentMaterial.Id;
        this.height = Number(currentMaterial.Height.toFixed(4));
        // this.height = Number(currentMaterial.Height);
      }
    }

  }

  uploadImage(event) {
    this.errorMessage = '';
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
        this.showErrorMessage = true;
        this.errorMessage = "File is too large, maximum permitted file size is: 10MB.";
      }
    } else {
      this.showErrorMessage = true;
      this.errorMessage = "File has invalid extension, allowed extensions are - DOC, DOCX or PDF.";

    }
  }

  readFile(inputValue: any): void {
    var file: File = inputValue;
    let formData: FormData = new FormData();
    formData.append('myFile', file, file.name);
    this.uploadDocService.uploadCSRDocument(formData, this.designAdExternalRequest)
      .subscribe((response) => {
        if (response.Result.IsCroppingRequired) {
          this.fileExtension = response.Result.FileExtension;
          this.adMaterialUrl = '/api' + response.Result.AdTemplateImageURL + "&ts=" + this.date;
          this.adSizeHeight = response.Result.AdSizeHeight;
          this.adSizeWidth = response.Result.AdSizeWidth;
          this.openImageEditor();
        }
        else if (response.IsSuccess) {
          this.date = new Date().getTime();
          this.documentAdMaterial.IsSuccessfullySubmittedOrder = true;
          this.croppedMaterialUrl = 'api/ad-material/preview/' + this.designAdExternalRequest.SystemName + '/' + this.designAdExternalRequest.OrderID + '/' + this.documentAdMaterial.AdMaterials[0].Id + '/' + this.designAdExternalRequest.ExternalMaterialID + '?isColor=' + this.designAdExternalRequest.IsColor + "&ts=" + this.date;
          this.documentAdMaterial.DownloadLink = '/api/designAd/getExternalOriginalImage?systemName=' + this.designAdExternalRequest.SystemName + '&systemKey=' + this.designAdExternalRequest.OrderID + '&adMaterialID=' + this.designAdExternalRequest.AdMaterialID + '&externalAdMaterialID=' + this.designAdExternalRequest.ExternalMaterialID + '&fileExtension=' + this.fileExtension;
        }
        else {
          this.showErrorMessage = true;
          response.ValidationMessage.length > 0 ? this.assignErrorMessage(response.ValidationMessage) : this.assignErrorMessage(response.ErrorMessage)
        }
      });
  }

  assignErrorMessage(messages: any[]) {
    for (let message of messages)
      this.errorMessage += message.Value;
  }

  openImageEditor(existingImage?: boolean) {
    const modalRef = this.modalService.open(ImageEditorComponent, {
      size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
    });
    modalRef.componentInstance.isDocumentUploaded = true;
    modalRef.componentInstance.saveFinalCsrDocumentObject = this.designAdExternalRequest;

    if (isNullOrUndefined(this.adSizeWidth)) {
      this.adSizeWidth = this.documentAdMaterial.SelectedAdSize.WidthInPixels;
    }
    modalRef.componentInstance.widthInPixels = this.adSizeWidth;

    if (isNullOrUndefined(this.adSizeHeight)) {
      this.adSizeHeight = this.documentAdMaterial.SelectedAdSize.HeightInPixels;
    }
    
    modalRef.componentInstance.heightInPixels = this.adSizeHeight;
    modalRef.componentInstance.fileExtension = this.fileExtension;
    modalRef.componentInstance.documentUploadUrl = this.adMaterialUrl;
    if(existingImage) {
      modalRef.componentInstance.documentUploadUrl = "api/designAd/getCSRImage?systemName=" + this.designAdExternalRequest.SystemName + "&systemKey=" + this.designAdExternalRequest.OrderID + "&adMaterialId=" + this.designAdExternalRequest.AdMaterialID + "&externalAdMaterialId=" + this.designAdExternalRequest.ExternalMaterialID + "&isTemp=false" + "&ts=" + this.date;
    }
    modalRef.componentInstance.conversionUploadDocRatio = this.documentAdMaterial.PDFImageHorizontalDPIRatio;
    modalRef.result.then(result => {
      if (result !== undefined && result.data && result.data == "acceptAndContinue") {
        this.date = new Date().getTime();
        this.documentAdMaterial.IsSuccessfullySubmittedOrder = true;
        this.height = Number(result.response.DimensionInInches.Height.toFixed(4));
        // this.height = Number(result.response.DimensionInInches.Height);
        this.croppedMaterialUrl = 'api/ad-material/preview/' + this.designAdExternalRequest.SystemName + '/' + this.designAdExternalRequest.OrderID + '/' + this.documentAdMaterial.AdMaterials[0].Id + '/' + this.designAdExternalRequest.ExternalMaterialID + '?isColor=' + this.designAdExternalRequest.IsColor + "&ts=" + this.date;
        this.documentAdMaterial.DownloadLink = '/api/designAd/getExternalOriginalImage?systemName=' + this.designAdExternalRequest.SystemName + '&systemKey=' + this.designAdExternalRequest.OrderID + '&adMaterialID=' + this.designAdExternalRequest.AdMaterialID + '&externalAdMaterialID=' + this.designAdExternalRequest.ExternalMaterialID + '&fileExtension=' + this.fileExtension;
      }
    })
  }

  preview() {
    let dialogRefPopup = this.modalService.open(PreviewImageComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.imageUrl = 'api/ad-material/preview/' + this.designAdExternalRequest.SystemName + '/' + this.designAdExternalRequest.OrderID + '/' + this.documentAdMaterial.Material.Id + '/' + this.designAdExternalRequest.ExternalMaterialID + '?isColor=' + this.designAdExternalRequest.IsColor + "&ts=" + this.date + "&adPreviewSizeId=0";
    // console.log("this.adSizeWidth", this.adSizeWidth);

    if (isNullOrUndefined(this.adSizeWidth)) {
      this.adSizeWidth = this.documentAdMaterial.SelectedAdSize.WidthInPixels;
    }
    dialogRefPopup.componentInstance.height = this.adSizeWidth;
    dialogRefPopup.componentInstance.min = this.adSizeWidth / 2;
    dialogRefPopup.componentInstance.max = this.adSizeWidth * 2;

  }

  startOver() {
    let body = "By starting over, you may lose any uploaded images or content. Do you wish to proceed?";
    let header = "Starting Over";
    let startOverPopup = this.discardModalService.deleteOrCancel(body, header);
    startOverPopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.documentAdMaterial.IsSuccessfullySubmittedOrder = false;
        this.hideUploadedMaterial = true;
        if(this.documentAdMaterial.Material != null)
        {
        this.documentAdMaterial.Material.UploadedFile=null;
        }
      }
    });

  }

  saveAndContinue() {
    this.uploadDocService.submitAdMaterialUploadedFromDoc(this.designAdExternalRequest)
      .subscribe(data => {
        if (data.IsSuccess) {
          let body = "Ad material successfully created. You will now be returned to Order Entry.";
          let confirmPopup = this.discardModalService.showAditMessage(body);
          window.parent && window.parent.postMessage('uploadAd', "*");
        }
      })
  }

  clearPictureAttachment() {
    this.photoInput.setValue('');
  }

}

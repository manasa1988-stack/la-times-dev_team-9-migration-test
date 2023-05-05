
import {tap} from 'rxjs/operators';
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { IOrder, IOrderItem, IAttribute, ILegalDoc } from '../../../models/order-item.model';
import * as adssMetadata from '../../../shared/adss.metadata';
import { FormGroup, FormControlName, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { isNullOrUndefined } from "util";
import { EmailValidator, DecimalNumberValidator, DateValidator, ZipCodeValidator, PhoneNumberValidator } from "../../../shared/custom-validators";
import { IUpsellOption, ImageList } from "../../../models/upsells-option.model";
import { OtherInfoService } from "./other-info.service";
import { DiscardModalService } from "../../../shared/discard-modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageEditorComponent } from "../size/image-editor/image-editor.component";
import { DateFormatPipe } from "../../../filters/dateformat.pipe";
import { IUploadLegalDocResponse } from "../../../models/upload-legal-doc.response.model";
//import { forEach } from "@angular/router/src/utils/collection";
import {ViewEncapsulation} from "@angular/core";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "other-info",
  templateUrl: "./other-info.component.html",
  styles: [`
  mat-tab-group.configure-ad #mat-tab-content-0-2.mat-tab-body-active
    {
        overflow-x: visible !important;
        overflow-y: visible !important;
    }
    `],
  encapsulation: ViewEncapsulation.None,
  providers: [DiscardModalService]
})
export class OtherInfoComponent extends BaseClass {
  icon: boolean = false;
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() passREquiredFieldEvent: EventEmitter<any> = new EventEmitter<any>();
  photoInput = new FormControl();
  fieldType = adssMetadata.FieldType;
  otherInfoForm: FormGroup;
  upsellInfoForm: FormGroup;
  upsellVisible: boolean = false;
  otherInfoFormArray: {
    formgrp: FormGroup,
    name: string,
    attributes: any[]
  }[] = [];
  upsellAttributes: IUpsellOption[] = [];
  imageTypeUpsells: IUpsellOption[] = [];
  booleanTypeUpsells: IUpsellOption[] = [];
  booleanTypeUpsellsWithNullSubGroup: IUpsellOption[] = [];
  groupBooleanTypeUpsells: {
    name: string,
    upsellArray: IUpsellOption[]
  }[] = [];

  imageUpsellArray = [];

  isErrorMessageShown: boolean = false;
  errorMessage: string = '';
  date: any;
  hasChildAtrribute: boolean = false;
  childAttributeName: string = '';
  ChildOptions: any[] = [];
  fileExtension: string;
  imageTypeUpsellForm: FormGroup;
  childAttributes = {};
  systemName: string = '';
  systemKey: number = 0;
  allowedExtentions: string[] = ['jpeg', 'jpg', 'pdf', 'doc', 'docx'];
  showUploadDocErrorMessage: boolean = false;
  uploadDocErrorMessage = [];
  uploadLegalDocResponse: IUploadLegalDocResponse;
  LstLegalDocs: ILegalDoc[] = [];
  UploadDocumentHeading: string;
  UpgradeListingHeading: string;
  HighlightAdHeading: string;
  focusOut = {};
  subscriptionTermsUrl: string;

  click() {
    this.icon = !this.icon;
  }
  constructor(private formBuilder: FormBuilder,
    private otherInfoService: OtherInfoService,
    private discardModalService: DiscardModalService,
    private dateFormatPipe: DateFormatPipe,
    private modalService: NgbModal,
     _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.date = new Date().getTime();
    this.systemName = this.order.IsCreatedInAdSS ? 'adss' : 'adit';
    this.systemKey = this.order.IsCreatedInAdSS ? this.order.AdSSId : this.order.AditId;
    this.LstLegalDocs = this.currentOrderItem.LstLegalDocs;
    this.order.AttributeDisplayGroups.forEach(grp => {
      this.createForm(grp);
    });

    this.assignFocus();

    this.notify();
    let upsellFormGroup = {};
    this.UploadDocumentHeading = (this.order.UploadDocumentHeading == null || this.order.UploadDocumentHeading =='')? "Upload document for ad approval process.":this.order.UploadDocumentHeading;
    this.UpgradeListingHeading = (this.order.UpgradeListingHeading == null || this.order.UpgradeListingHeading =='')? "Upgrade your online lisitng":this.order.UpgradeListingHeading;
    this.HighlightAdHeading = (this.order.HighlightAdHeading == null || this.order.HighlightAdHeading =='')? "Highlight your ad:":this.order.HighlightAdHeading;
        
    this.order.OrderItems.forEach(orderItem => {
      if (!isNullOrUndefined(orderItem.UpsellAttributes) && orderItem.UpsellAttributes.length > 0) {
        this.upsellVisible = true;
        for (let attribute of orderItem.UpsellAttributes) {
          let upsell: IUpsellOption = <IUpsellOption>{};
          upsell = attribute;
          if (upsell.Type.Id == this.fieldType['ImageList']) {
            upsell.IsChecked = !isNullOrUndefined(this.order.AttributeValues[attribute.Name].Value) && this.order.AttributeValues[attribute.Name].Value != '' ? true : false;
            upsellFormGroup[attribute.Name] = new FormControl(this.order.AttributeValues[attribute.Name].Value);
            if (upsell.IsChecked)
              this.imageUpsellArray = this.order.AttributeValues[attribute.Name].Value.split(',');
          }
          else {
            if(attribute.Name === 'Legacy_lite'){
              upsell.IsChecked  = attribute.DefaultValue === '1' ? true : false;
            }else{
              upsell.IsChecked = this.order.AttributeValues[attribute.Name].Value == 'true' ? true : false;
            }            
            upsellFormGroup[attribute.Name] = new FormControl(upsell.IsChecked);
          }
          upsell.OrderId = this.systemKey;
          this.upsellAttributes.push(upsell);
        }
        this.upsellInfoForm = new FormGroup(upsellFormGroup);
        setTimeout(() => {
          this.passEvent.emit({ fromChild: "OtherInfo", formGroup: this.otherInfoFormArray, upsellFormGroup: this.upsellInfoForm, currentOrderItem: this.currentOrderItem })
        }, 3000);

        this.getUpsellData();
      }
    })
  }

  getUpsellData() {
    this.upsellAttributes.forEach(i => {
      if (i.IsImageListType)
        this.imageTypeUpsells.push(i);
      if (i.IsBooleanType)
        this.booleanTypeUpsells.push(i);
    });

    let imageTypeUpsellFormGroup = {};
    this.imageTypeUpsells.forEach(data => {
      data.ImageList = [];
      imageTypeUpsellFormGroup[data.Name] = new FormControl(data.IsChecked);
      for (let i = 0; i < data.MaxLength; i++) {
        let imageList: ImageList = <ImageList>{};
        imageList.imageUrl = 'wwwroot/assets/img/photo.jpg';
        // imageList.isImageUploaded = this.order.AttributeValues[data.Name].Value.split(',')[i] ? true : false;
        imageList.isImageUploaded = (!isNullOrUndefined(this.order.AttributeValues[data.Name].Value) && (this.order.AttributeValues[data.Name].Value != '' && !this.order.AttributeValues[data.Name].Value.includes('blank'))) ? (this.order.AttributeValues[data.Name].Value.split(',')[i] ? true : false) : false;
        data.ImageList.push(imageList);
      }
    })

    this.imageTypeUpsellForm = new FormGroup(imageTypeUpsellFormGroup);
    this.booleanTypeUpsellsWithNullSubGroup = this.booleanTypeUpsells.filter(data => data.SubGroup == null);
    let groupArray = this.booleanTypeUpsells.map(data => data.SubGroup).filter((x, i, a) => x && a.indexOf(x) === i);
    for (let d of groupArray) {
      this.groupBooleanTypeUpsells.push({ name: d, upsellArray: this.booleanTypeUpsells.filter(data => data.SubGroup == d) });
    }
  }


  createForm(grp) {
    let attributeGroup: any[] = [];
    for (let attribute of grp.Attributes) {
      if (attribute.Type['Id'] == this.fieldType['TermsUrl']) {
        this.subscriptionTermsUrl = attribute.DefaultValue;
      }

      if ((attribute.Type['Id'] != this.fieldType['Image'] || attribute.IsOnlineClassifiedAttribute) && !attribute.IsForMaterial && (!attribute.IsForVerification || (attribute.IsForVerification && !this.order.IsVendor))) {
        attributeGroup.push(attribute);
      }
    }
    attributeGroup = attributeGroup.filter(data => data.ChargeTypeId == null);
    attributeGroup = attributeGroup.filter(data => data.Type['Id'] != this.fieldType['Image']).sort((n1, n2) => n1.DisplayOrder - n2.DisplayOrder);
    let formGroup = {};
    let tempAttributeGroup = [];
    for (let attribute of attributeGroup) {
      tempAttributeGroup.push(attribute);

      if(attribute.Name === "SubscribeTC") {
        this.order.AttributeValues[attribute.Name].Value = this.order.AttributeValues[attribute.Name].Value == "true";
      }

      formGroup[attribute.Name] = new FormControl(!isNullOrUndefined(this.order.AttributeValues[attribute.Name]) ? isNullOrUndefined(this.order.AttributeValues[attribute.Name].Value) ? '' : this.order.AttributeValues[attribute.Name].Value : '', this.mapValidators(attribute))
      if(attribute.Type['Id'] == this.fieldType['Date']){
        formGroup[attribute.Name+'_ngbdate'] = new FormControl();
      }
      if (attribute.Options.length > 0 && attribute.Options[0].HasChildAttributes) {
        for (let data of attribute.Options[0].Attributes) {
          data.Type.Id = 10;
          data.ParentId = attribute.Name;
          this.onSelectingOption(this.order.AttributeValues[attribute.Name].Value, attribute, grp.DisplayName);
          tempAttributeGroup.push(data);
          formGroup[data.Name] = new FormControl(!isNullOrUndefined(this.order.AttributeValues[attribute.Name]) ? isNullOrUndefined(this.order.AttributeValues[data.Name]) ? '' : this.order.AttributeValues[data.Name].Value : '', this.mapValidators(data));
        }
      }
    }
    if (attributeGroup.length > 0) {
      this.otherInfoFormArray.push({ formgrp: new FormGroup(formGroup), name: grp.DisplayName, attributes: tempAttributeGroup });
    }
  }

  private mapValidators(attribute) {
    const formValidators = [];
    if (attribute.IsRequired)
      formValidators.push(Validators.required);
    if (attribute.Type['Id'] == this.fieldType['TermsAndCondition'])
      formValidators.push(Validators.requiredTrue);
    if (attribute.Type['Id'] == this.fieldType['Email'])
      formValidators.push(EmailValidator);
    if (attribute.Type['Id'] == this.fieldType['Number'])
      formValidators.push(DecimalNumberValidator);
    if (attribute.Type['Id'] == this.fieldType['Date'])
      formValidators.push(DateValidator);
    if (!isNullOrUndefined(attribute.MaxLength))
      formValidators.push(Validators.maxLength(attribute.MaxLength));
    if (!isNullOrUndefined(attribute.MinLength))
      formValidators.push(Validators.minLength(attribute.MinLength));
    if (attribute.Name.toLowerCase().includes('zip'))
      formValidators.push(ZipCodeValidator);
    if (attribute.Name.toLowerCase().includes('subscriber phone'))
      formValidators.push(PhoneNumberValidator);
    return formValidators

  }

  onSelectingOption(event, attribute, groupName) {
    let option = attribute.Options.find(data => data.Value == event)
    if (!isNullOrUndefined(option) && option.HasChildAttributes) {
      this.otherInfoService.getChildAttributeValues(attribute.Name, event, option.Attributes[0].Name, this.currentOrderItem.SectionId, this.order.PackageCode)
        .subscribe(data => {
          this.childAttributes[attribute.Name] = data;
          for (let i = 0; ; i++) {
            if (!isNullOrUndefined(this.otherInfoFormArray[i])) {
              if (this.otherInfoFormArray[i].name == groupName) {
                this.otherInfoFormArray[i].formgrp.controls[option.Attributes[0].Name].setValue(this.childAttributes[attribute.Name][0]);
                this.notify();
                break;
              }
            }
            else {
              break;
            }
          }
        })
    }
    else {
      this.childAttributes[attribute.Name] = [];
    }
    this.notify();
  }



  checkBoxGroupOneClicked(index, upsell) {
    this.groupBooleanTypeUpsells[index].upsellArray = this.groupBooleanTypeUpsells[index].upsellArray.map(data => {
      return data.Name === upsell.Name ? { ...data, IsChecked: !upsell.IsChecked } : { ...data, IsChecked: false }
    })
    this.groupBooleanTypeUpsells[index].upsellArray.forEach(data => {
      this.upsellInfoForm.controls[data.Name].setValue(data.IsChecked);
    })

    console.log('checkbox group');
    console.log(this.groupBooleanTypeUpsells);
    console.log(this.upsellInfoForm);
    this.upsellCheckboxPriceUpdate();

  }

  counter(i: number) {
    return new Array(i);
  }

  photosCheckboxClicked(imageUpsell, index, event) {

    let oldImage = Object.assign(imageUpsell);
    let imageId = imageUpsell.Id;

    if (event.checked === true) {
      if (this.imageTypeUpsells.length > 1) {
        oldImage = this.imageTypeUpsells.find(upsell => upsell.Id != imageUpsell.Id);
        if (!isNullOrUndefined(oldImage))
          imageId = oldImage.Id;
      }

    }
    if (event.checked === false) {
      oldImage = this.imageTypeUpsells.find(upsell => upsell.Id == imageUpsell.Id);
      imageId = oldImage.Id;
    }
    if (imageUpsell.ImageList.filter(data => data.isImageUploaded === true).length == 0 && oldImage.ImageList.filter(data => data.isImageUploaded === true).length == 0) {
      this.imageTypeUpsells = this.imageTypeUpsells.map(data => {
        if (data.Name !== imageUpsell.Name) {
          this.imageTypeUpsellForm.controls[data.Name].setValue(false);
        }
        return data.Name === imageUpsell.Name ? { ...data, IsChecked: !imageUpsell.IsChecked } : { ...data, IsChecked: false }
      })
    }
    else {
      let body = "This action will remove all the images. Please confirm to continue?";
      let header = "Confirmation";
      let deletePopup = this.discardModalService.deleteOrCancel(body, header);
      deletePopup.result.then(result => {
        if (result !== undefined && result.data && result.data == "continue") {
          this.otherInfoService.removeImageListAttributeFolder(this.systemKey, this.systemName, imageId)
            .subscribe(data => {
              if (data.IsSuccess) {
                this.imageTypeUpsells.find(upsell => upsell.Id === imageId).ImageList.forEach(image => {
                  image.isImageUploaded = false;
                })
                this.imageTypeUpsells = this.imageTypeUpsells.map(data => {
                  if (data.Name !== imageUpsell.Name) {
                    this.imageTypeUpsellForm.controls[data.Name].setValue(false);
                  }
                  return data.Name === imageUpsell.Name ? { ...data, IsChecked: !imageUpsell.IsChecked } : { ...data, IsChecked: false }
                })
                this.upsellInfoForm.controls[oldImage.Name].setValue("");
                this.imageUpsellArray = [];
                this.upsellCheckboxPriceUpdate(oldImage.Name);
              }
            })
        }
        else {
          this.imageTypeUpsellForm.controls[imageUpsell.Name].setValue(!event.checked);
          this.imageTypeUpsells.find(data => data.Id == imageUpsell.Id).IsChecked = !event.checked;
        }
      });
    }
  }

  fileUpload(event, attribute, index) {
    this.isErrorMessageShown = false;
    let inputValue = event.target.files[0];
    var file: File = inputValue;
    let fileName = inputValue['name'];
    let parts = fileName.split('.');
    this.fileExtension = parts[parts.length - 1];
    let formData: FormData = new FormData();
    formData.append('myFile', file, file.name);
    this.clearPictureAttachment();
    this.otherInfoService.uploadImageListAttribute(this.systemKey, this.systemName, attribute.Id, index, formData, false)
      .subscribe((data) => {
        if (data.IsCroppingRequired) {
          this.openImageEditor(index, attribute, 'temporary');
        }
        else if (data.IsSuccessful) {
          this.date = new Date().getTime();
          this.imageTypeUpsells.find(data => data.Id == attribute.Id).ImageList[index].isImageUploaded = true;
          this.imageUpsellArray[index] = this.getUpsellUrlString(attribute.Id, index);
          this.upsellCheckboxPriceUpdate(attribute.Name);
        }
        else {
          this.isErrorMessageShown = true;
          this.errorMessage = data.ValidationResult.Errors[0].ErrorMessage;
        }

      })
  }

  getUpsellUrlString(attributeId, index) {
    return "/orders/GetImageListAttributeImage/" + this.systemName + "/" + this.systemKey + "/" + attributeId + "/" + index;
  }

  removeImageListAttributeItem(attribute, index) {
    this.otherInfoService.removeImageListAttributeItem(this.systemKey, this.systemName, attribute.Id, index)
      .subscribe(data => {
        if (data.IsSuccess) {
          this.imageTypeUpsells.find(data => data.Id == attribute.Id).ImageList[index].imageUrl = '../../../../../../../wwwroot/assets/img/photo.jpg';
          this.imageTypeUpsells.find(data => data.Id == attribute.Id).ImageList[index].isImageUploaded = false;
          this.imageUpsellArray[index] = "";
          this.upsellCheckboxPriceUpdate(attribute.Name);
        }
      })
  }

  deletePhoto(attribute, index) {
    let photoNumber = index + 1;
    let body = "Are you sure you want to remove Photo " + photoNumber + "?";
    let header = "Confirmation";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue")
        this.removeImageListAttributeItem(attribute, index);
    });
  }

  deletePopUp(index) {

  }


  onSelectingChildOption(option) {
    this.notify();
  }

  openImageEditor(index, attribute, imageType) {

    const modalRef = this.modalService.open(ImageEditorComponent, {
      size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
    });
    modalRef.componentInstance.isEditUpsellImage = true;
    modalRef.componentInstance.odrerId = this.systemKey;
    modalRef.componentInstance.currentOrderItemId = this.currentOrderItem.Id;
    modalRef.componentInstance.adMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].Id : 0;
    modalRef.componentInstance.externalMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].ExternalId : 0;
    modalRef.componentInstance.adSizeId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSizeId : 0;
    modalRef.componentInstance.sectionId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.SectionId : 0;
    modalRef.componentInstance.isColor = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.IsColor : false;
    modalRef.componentInstance.widthInPixels = attribute.ImageWidth;
    modalRef.componentInstance.heightInPixels = attribute.ImageHeight;
    modalRef.componentInstance.photoIndex = index;
    modalRef.componentInstance.attributeId = attribute.Id;
    modalRef.componentInstance.systemName = this.systemName;
    modalRef.componentInstance.fileExtension = this.fileExtension;
    modalRef.componentInstance.imageType = imageType;
    modalRef.componentInstance.isImageChanged = true;
    modalRef.result.then(result => {
      if (result !== undefined && result.data && result.data == "acceptAndContinue") {
        this.date = new Date().getTime();
        this.imageTypeUpsells.find(data => data.Id == attribute.Id).ImageList[index].isImageUploaded = true;
        this.imageUpsellArray[index] = this.getUpsellUrlString(attribute.Id, index);
        this.upsellCheckboxPriceUpdate(attribute.Name);
      }
    })
  }

  subGroupCheckboxClicked(value) {
    value.IsChecked = !value.IsChecked;
    this.upsellInfoForm.controls[value.Name].setValue(value.IsChecked);
    console.log('sub group');
    console.log(this.upsellInfoForm);
    this.upsellCheckboxPriceUpdate();
  }

  notify() { 
    let callUpdateOrderState = false;
    setTimeout(() => {
      this.passEvent.emit({
        fromChild: "OtherInfo",
        formGroup: this.otherInfoFormArray,
        currentOrderItem: this.currentOrderItem,
        callUpdateOrderState: callUpdateOrderState,
        skipPriceCalulcation: true
      })
    }, 3000);

  }

  upsellCheckboxPriceUpdate(name?: string) {
    let callUpdateOrderState = false;
    if (!isNullOrUndefined(name)) {
      let count = 0;
      this.imageUpsellArray.forEach(imageItem => {
        if (imageItem != "")
          count += 1;
      })
      if (count == 0)
        this.imageUpsellArray = [];
      this.upsellInfoForm.controls[name].setValue(this.imageUpsellArray.toString());
      callUpdateOrderState = count > 1;
    }
    this.passEvent.emit({
      fromChild: "OtherInfo",
      formGroup: this.otherInfoFormArray,
      upsellFormGroup: this.upsellInfoForm,
      currentOrderItem: this.currentOrderItem,
      callUpdateOrderState: callUpdateOrderState
    });
  }

  clearPictureAttachment() {
    this.photoInput.setValue('');
  }

  onDateChange(date, formGrp, attributeName){
    let selectedDate = new Date(date.year, date.month - 1, date.day);    
    formGrp.formgrp.controls[attributeName].setValue(this.dateFormatPipe.transform(selectedDate, "MM/dd/yyyy"));
  }

  isValidWindowsFileName(fileName){
    var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    var rg2=/^\./; // cannot start with dot (.)
    var rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
      return rg1.test(fileName);
  }

  uploadLegalDoc($event) {
    let inputValue = $event.target.files[0];
    let fileName = inputValue['name'];
    let parts = fileName.split('.');
    this.fileExtension = parts[parts.length - 1];
    this.showUploadDocErrorMessage = false;
    this.uploadDocErrorMessage = [];
    
    if(this.isValidWindowsFileName(parts[0])) 
    {
      if (this.allowedExtentions.includes(this.fileExtension.toLowerCase())) {
        if (inputValue.size <= 10485760) {
          this.readFile(inputValue);
        }
        else {
          this.showUploadDocErrorMessage = true;
          this.uploadDocErrorMessage.push("File is too large, maximum permitted file size is: 10MB.");
        }
      } else {

        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("File has invalid extension, allowed extensions are: JPG,JPEG,PDF,DOC,DOCX");
      }
  }
  else
    {
        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("File name cannot contain the following characters  \\ / : * ? \" < > |");
    }
   }

  readFile(inputValue: any): void {
    var file: File = inputValue;
    let formData: FormData = new FormData();
    formData.append('myFile', file, file.name);
    let legalDoc = <ILegalDoc>{};

    this.otherInfoService.uploadLegalDoc(this.order.AdSSId, this.currentOrderItem.Id, formData).pipe(tap(data => {
    })).subscribe((data) => {
      if (data.IsSuccess) {
        this.uploadLegalDocResponse = data.Result;
        legalDoc.DocumentName = this.uploadLegalDocResponse.DocumentName;
        legalDoc.DocumentId = this.uploadLegalDocResponse.DocumentId;
        legalDoc.OrderId = this.order.AdSSId;
        legalDoc.OrderItemId = this.currentOrderItem.Id;
        if (isNullOrUndefined(this.currentOrderItem.LstLegalDocs)) {
          this.currentOrderItem.LstLegalDocs = [];
        }
        this.currentOrderItem.LstLegalDocs.push(legalDoc);
        setTimeout(() => {
          this.passEvent.emit({
            fromChild: "OtherInfo",
            grandChild: "UploadLegalDoc",
            currentOrderItem: this.currentOrderItem,
            skipPriceCalulcation: true
          })
        }, 3000);
      }
      else {
        this.showUploadDocErrorMessage = true;
        data.ValidationMessage.forEach(validationMesg => {
          this.uploadDocErrorMessage.push(validationMesg.Value);
        });
        data.ErrorMessage.forEach(validationMesg => {
          this.uploadDocErrorMessage.push(validationMesg.Value);
        });
      }
    },
      (error) => {
        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("There is an error from Server. Please try again.");
      });
  }

  removeLegalDoc(legalDoc: ILegalDoc) {
    this.showUploadDocErrorMessage = false;
    this.uploadDocErrorMessage = [];
    let body = "Are you sure you want to delete this document?";
    let header = "Confirmation";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.otherInfoService.deleteLegalDoc(legalDoc).pipe(tap(data => {
        })).subscribe((data) => {
          if (data.IsSuccess) {
            let index = this.currentOrderItem.LstLegalDocs.findIndex(o => o.DocumentId == legalDoc.DocumentId);
            if (index > -1) {
              this.currentOrderItem.LstLegalDocs.splice(index, 1);
            }
            setTimeout(() => {
              this.passEvent.emit({
                fromChild: "OtherInfo",
                grandChild: "UploadLegalDoc",
                currentOrderItem: this.currentOrderItem,
                skipPriceCalulcation: true
              })
            }, 3000);
          }
          else {
            this.showUploadDocErrorMessage = true;
            data.ValidationMessage.forEach(validationMesg => {
              this.uploadDocErrorMessage.push(validationMesg.Value);
            });
            data.ErrorMessage.forEach(validationMesg => {
              this.uploadDocErrorMessage.push(validationMesg.Value);
            });
          }
        },
          (error) => {
            this.showUploadDocErrorMessage = true;
            this.uploadDocErrorMessage.push("There is an error from Server. Please try again.");
          });
      }
    });
  }

  assignFocus() {
    this.otherInfoFormArray.forEach(formGrp => {
      formGrp.attributes.forEach(attribute => {
        if (attribute.Type['Id'] == this.fieldType['Text']) {
          this.focusOut[attribute.Name] = true;
        }
      });
    });
  }

  updateFormValidity() {
    this.otherInfoFormArray.forEach(otherInfoForm => {
      // console.log(otherInfoForm);
      Object.keys(otherInfoForm.formgrp.controls).forEach(controlName => {
        otherInfoForm.formgrp.controls[controlName].markAsTouched();
      });
    });
  }

  isDocumentUploaded()
  {
    if(this.order.IsDocumentUploadRequired && this.currentOrderItem.LstLegalDocs.length <= 0)
    {
        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage =[];
        this.uploadDocErrorMessage.push("Please upload document for ad approval process");
        return false;
    }
    return true;
  }

}

import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { DiscardModalService } from "../../../shared/discard-modal.service";
import { LayoutService } from "./layout.service";
import { ILayoutCarouselItem, ILayout } from "../../../models/layout.model";
import { IOrder, IOrderItem, IAdTemplate } from '../../../models/order-item.model';
import { PhotoLibraryService } from "../../photo-library/photo-library.service";
import { IPhoto } from "../../../models/photo.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageEditorComponent } from "./image-editor/image-editor.component";
import { PreviewImageComponent } from "./preview-image/preview-image.component";
import * as adssMetadata from '../../../shared/adss.metadata';
import { isNullOrUndefined } from "util";
import { GuidelinesComponent } from "./guidelines/guidelines.component";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: "size",
  templateUrl: "./size.component.html",
  providers: [DiscardModalService] 
})
export class SizeComponent extends BaseClass {
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() layoutData: ILayoutCarouselItem;
  @Input() selectedAdSize: ILayout;

  adSizeList: ILayout[];
  isComponentReady: boolean = false;
  templates: IAdTemplate[];
  isWhite: boolean = true;
  clickThroughURLForm: FormGroup;
  photoLibrary: IPhoto[] = [];
  orderItemTypes = adssMetadata.OrderItemType;
  imageUrl: any;
  selectedColor: FormControl;
  selectedCategoryOption: string = '';
  IsWarningMessageShown: boolean = false;
  categoryOption = new FormControl();
  positionHeaderFormControl = new FormControl();
  systemName: string = "adss";

  constructor(private discardModalService: DiscardModalService,
    private layoutService: LayoutService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    if (this.currentOrderItem.ClassCodeGroup && this.currentOrderItem.ClassCodeGroup.ClassCodeHeaderName) {
      if (this.currentOrderItem.ClassCodeValue) {
        this.categoryOption.setValue(this.currentOrderItem.ClassCodeValue);
      }
    }   
    if (this.currentOrderItem.TypeId == this.orderItemTypes['PrintDisplayOrderItem'] && this.currentOrderItem.Position != null && this.currentOrderItem.Position.HasHeaders) {
      if (!isNullOrUndefined(this.currentOrderItem.PositionHeaderId))
        this.positionHeaderFormControl.setValue(this.currentOrderItem.PositionHeaderId);
    }

    if (!this.order.IsCreatedInAdSS) {
      this.systemName = "adit";
    }
  }

  ngOnChanges() {
    this.getLayoutsData();
    if (this.currentOrderItem.HasAdMaterialDefined)
      this.currentOrderItem.AdMaterialUrl = "/api/ad-material/preview/" + this.systemName + "/" + this.order.AdSSId + "/" + this.currentOrderItem.AdMaterial[0].Id + "/" + this.currentOrderItem.AdMaterial[0].ExternalId + "?isColor=" + this.currentOrderItem.IsColor + "&ts=" + new Date().getTime();
    if (this.currentOrderItem.TypeId == this.orderItemTypes['OnlineDisplayOrderItem'])
      this.createClickThroughUrlForm();
  }

  onNotify($event: any) {
    switch ($event.operationToPerform) {
      case "bindTemplates":
        this.selectedAdSize = $event.selectedTile;
        this.getTemplates();
        break;
      case "startOver":
          this.startOver($event.selectedTile);
        break;
      case "openDesignMaterial":
        this.openDesignMaterial($event);
        break;
      default:
    }

  }

  openDesignMaterial($event) {
    this.passEvent.emit({ fromChild: "Layout", grandChild: "selectTemplate", routerDetails: $event, currentOrderItem: this.currentOrderItem });
  }

  getTemplates() {
    if (this.selectedAdSize) {
      this.currentOrderItem.AdSize = this.selectedAdSize.AdSize;
      this.currentOrderItem.AdSizeId = this.selectedAdSize.AdSize.Id;

      this.templates = this.selectedAdSize.AdSize.AdTemplates;
      setTimeout(() => {
        this.passEvent.emit({ fromChild: "Layout", currentOrderItem: this.currentOrderItem });
      }, 1000);
    }

  }

  getLayoutsData() {
    if (this.layoutData) {
      this.adSizeList = this.layoutData.ApiapplicableAdSize
      if (this.layoutData.ShowColorOption)
        this.selectedColor = new FormControl(this.currentOrderItem.IsColor);
      if (!isNullOrUndefined(this.selectedAdSize)) {
        this.getTemplates();
      }
    }
  }


  openImageEditorModal(editImage?: string) {

    const modalRef = this.modalService.open(ImageEditorComponent, {
      size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
    });
    modalRef.componentInstance.odrerId = this.order.AdSSId;
    modalRef.componentInstance.currentOrderItemId = this.currentOrderItem.Id;
    modalRef.componentInstance.adMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].Id : 0;
    modalRef.componentInstance.externalMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].ExternalId : 0;
    modalRef.componentInstance.adSizeId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSizeId : 0;
    modalRef.componentInstance.sectionId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.SectionId : 0;
    modalRef.componentInstance.isColor = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.IsColor : false;
    modalRef.componentInstance.widthInPixels = this.selectedAdSize.AdSize.WidthInPixels;
    modalRef.componentInstance.heightInPixels = this.selectedAdSize.AdSize.HeightInPixels;
    modalRef.componentInstance.fileExtension = 'jpg';

    if (!isNullOrUndefined(editImage) && editImage == 'editUploadedImage')
      modalRef.componentInstance.isEditImage = true;
    modalRef.result.then(result => {
      if (result !== undefined && result.data && result.data == "acceptAndContinue") {
        this.IsWarningMessageShown = result.IsWarningMessageShown;
        this.currentOrderItem.AdMaterialUrl = "/api/ad-material/preview/" + this.systemName + "/" + this.order.AdSSId + "/" + this.currentOrderItem.AdMaterial[0].Id + "/" + this.currentOrderItem.AdMaterial[0].ExternalId + "?isColor=" + this.currentOrderItem.IsColor + "&ts=" + new Date().getTime();
        this.currentOrderItem.HasAdMaterialDefined = true;
        this.currentOrderItem.HasUploadedAd = true;
        this.passEvent.emit({ fromChild: "Layout", currentOrderItem: this.currentOrderItem });
      }
    })
  }

  preview() {
    let dialogRefPopup = this.modalService.open(PreviewImageComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.imageUrl = this.currentOrderItem.AdMaterialUrl + "&adPreviewSizeId=0";
    dialogRefPopup.componentInstance.height = this.selectedAdSize.AdSize.WidthInPixels;
    dialogRefPopup.componentInstance.min = this.selectedAdSize.AdSize.WidthInPixels / 2;
    dialogRefPopup.componentInstance.max = this.selectedAdSize.AdSize.WidthInPixels * 2;

  }

  startOver(selectedTile?) {   
      this.passEvent.emit({ fromChild: "Layout", action: 'startOver', currentOrderItem: this.currentOrderItem, selectedTile: selectedTile, skipPriceCalulcation: true });
  }

  openGuidelinesComponent() {
    const modalRef = this.modalService.open(GuidelinesComponent, {
      size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
    });
  }

  createClickThroughUrlForm() {
    this.clickThroughURLForm = this.formBuilder.group({
      'Url': [(!isNullOrUndefined(this.currentOrderItem.ClickThroughUrl) && this.currentOrderItem.ClickThroughUrl.length != 0) ? this.currentOrderItem.ClickThroughUrl : 'http://', Validators.required]
    });

    this.clickThroughURLForm.controls.Url.valueChanges.subscribe(data => {
      if (data.length > 7) {
        if (!/^https?:\/\//i.test(data)) {
          this.clickThroughURLForm.controls.Url.setValue('http://' + data);
        }
      }
    });
  }

  isValidUrl(url: string) {
    this.layoutService.isValidUrl(url)
      .subscribe(result => {
        if (result.IsSuccess) {
          this.clickThroughURLForm.controls.Url.setErrors(null);
        }
        else {
          this.clickThroughURLForm.controls.Url.setErrors({
            invalid: true
          });
        }

        this.currentOrderItem.IsValidClickThroughUrl = result.IsSuccess;
        this.passEvent.emit({ fromChild: "Layout", grandChild: "nonMaterialLayoutFields", currentOrderItem: this.currentOrderItem });
      })
  }

  urlChanged($event) {
    if (!isNullOrUndefined($event.target.value))
      this.currentOrderItem.ClickThroughUrl = $event.target.value.toLowerCase();
    this.currentOrderItem.IsValidClickThroughUrl = false;

    if ($event.target.value.length > 7) {
      this.isValidUrl(this.currentOrderItem.ClickThroughUrl);
    }
    else {
      if ($event.target.value.length != 0) {
        this.clickThroughURLForm.controls.Url.setErrors({
          invalid: true
        });
      }
      this.passEvent.emit({ fromChild: "Layout", grandChild: "nonMaterialLayoutFields", currentOrderItem: this.currentOrderItem });
    }
  }

  openUrl() {
    //let urlReg: RegExp = new RegExp('^https?\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{1,3}(/\S*)?$');
    //if (urlReg.test(this.clickThroughURLForm.controls.Url.value)) {
    if (this.currentOrderItem.IsValidClickThroughUrl) {
      window.open(this.clickThroughURLForm.controls.Url.value, '_blank');
    }
  }

  onSelectCategory(value) {
    this.currentOrderItem.ClassCodeValue = value;
    this.passEvent.emit({ fromChild: "Layout", currentOrderItem: this.currentOrderItem }); //, skipPriceCalulcation: true, grandChild: "nonMaterialLayoutFields"
  }

  onSelectPositionHeader(value) {
    this.currentOrderItem.PositionHeaderId = value;
    this.passEvent.emit({ fromChild: "Layout", currentOrderItem: this.currentOrderItem }); //, skipPriceCalulcation: true , grandChild: "nonMaterialLayoutFields"
  }

  onChangeColor() {
    this.currentOrderItem.IsColor = this.selectedColor.value;
    if (this.currentOrderItem.HasAdMaterialDefined) {
      this.currentOrderItem.AdMaterialUrl = "/api/ad-material/preview/" + this.systemName + "/" + this.order.AdSSId + "/" + this.currentOrderItem.AdMaterial[0].Id + "/" + this.currentOrderItem.AdMaterial[0].ExternalId + "?isColor=" + this.currentOrderItem.IsColor + "&ts=" + new Date().getTime();
    }
    this.passEvent.emit({ fromChild: "Layout", currentOrderItem: this.currentOrderItem });
  }

  updateDropdownValidity(){
    this.categoryOption.markAsTouched();
    this.positionHeaderFormControl.markAsTouched();
  }

  updateValidity() {
    this.clickThroughURLForm.controls['Url'].markAsTouched();
    if (!this.clickThroughURLForm.controls.Url.hasError("invalid") && this.clickThroughURLForm.controls.Url.value == 'http://') {
      this.clickThroughURLForm.controls.Url.setErrors({
        invalid: true
      });
    }
  }


}

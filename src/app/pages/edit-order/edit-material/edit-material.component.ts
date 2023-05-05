import { Component, Input, Output, EventEmitter, NgModuleRef } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { DiscardModalService } from "../../../shared/discard-modal.service";
import { ImageEditorComponent } from "../../configure-ad/size/image-editor/image-editor.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { isNullOrUndefined } from "util";
import { Router, ActivatedRoute } from "@angular/router";
import { IOrder, IOrderItem, IAdSize, IAdMaterial } from "../../../models/order-item.model";
import { FormControl } from "@angular/forms";
import * as adssMetadata from '../../../shared/adss.metadata';
import { PreviewImageComponent } from "../../configure-ad/size/preview-image/preview-image.component";
import { IEditOrder } from "../../../models/edit-order.model";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'edit-material',
    templateUrl: './edit-material.component.html'
})

export class EditMaterialComponent extends BaseClass {

    @Input() editableOrder: IEditOrder;
    @Input() orderItemId: number;
    @Input() externalId: number;
    @Input() hasUploadedNewMaterial: boolean;
    @Input() isCallFromAdit: boolean;

    @Output() passUpdatedAdMaterial: EventEmitter<any> = new EventEmitter<any>();

    order: IOrder;
    currentOrderItem: IOrderItem;
    newAdMaterial: IAdMaterial;
    newAdMaterialUrl: string;

    orderItemTypes = adssMetadata.OrderItemType;

    invalidURL: string;

    selectAll = new FormControl();
    selectedDate = new FormControl();
    clickThroughUrl = new FormControl();
    availableRunDates = [];
    selectedRunDates = [];

    IsWarningMessageShown: string;

    dateNow: Date = new Date();

    buCode: string;

    constructor(private router: Router,
        private modalService: NgbModal,
        private route: ActivatedRoute,_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {

        this.order = this.editableOrder.Order;
        this.currentOrderItem = this.order.OrderItems.find(orderItem => orderItem.Id == this.orderItemId);

        //console.log(" this.currentOrderItem ", this.currentOrderItem);

        this.newAdMaterial = this.editableOrder.NewAdMaterial;
        
        //console.log(this.currentOrderItem.AllSubmittedAdMaterial[0].ExternalId); 
        //console.log(this.newAdMaterial.ExternalId);

        this.availableRunDates = this.currentOrderItem.RunDates;

        this.clickThroughUrl.setValue(this.currentOrderItem.ClickThroughUrl);

        this.buCode = this.currentOrderItem.Section.Product.BusinessUnit.Code;

        if(this.hasUploadedNewMaterial) {
            //console.log("In hasUploadedNewMaterial");
            this.newAdMaterialUrl = this.getMaterialUrlString();
            //this.sendAdMaterialData();
        }

        this.clickThroughUrl.valueChanges.subscribe(value => {
            if (this.currentOrderItem.ClickThroughUrl !== value)
                this.sendAdMaterialData();
        })

        this.selectAll.valueChanges.subscribe(data => {
            if (data) {
                this.selectedRunDates = Object.assign([], this.currentOrderItem.RunDates);
            }
            else {
                this.selectedRunDates = Object.assign([], []);
            }
        });
    }

    // checkForUnsubmittedMaterial() {
    //     if (this.newAdMaterial.Id == this.currentOrderItem.FirstOfUnsubmittedAdMaterial.Id &&
    //         this.newAdMaterial.ExternalId == this.currentOrderItem.FirstOfUnsubmittedAdMaterial.ExternalId) {
    //         this.hasUploadedNewMaterial = true;
    //         this.newAdMaterialUrl = this.getMaterialUrlString();
    //     }
    // }

    getMaterialUrlString(): string {

        let systemName;
        let systemKey;

        if (this.order.IsCreatedInAdSS) {
            systemName = this.order.IsCreatedInAdSS ? 'adss' : 'adit';
            systemKey = this.order.IsCreatedInAdSS ? this.order.AdSSId : this.order.AditId;
        }

        return "/api/ad-material/preview/"
            + systemName + "/" + systemKey + "/"
            + this.newAdMaterial.Id + "/"
            + this.newAdMaterial.ExternalId + "?isColor=" + this.currentOrderItem.IsColor
            + "&ts=" + new Date().getTime();
    }

    checkboxChange(newRunDate, $event) {
        let index = this.selectedRunDates.indexOf(newRunDate)
        index == -1 ? this.selectedRunDates.push(newRunDate) : this.selectedRunDates.splice(index, 1);
        this.sendAdMaterialData();
    }

    selectAllChange($event) {
        if ($event.target.checked) {
            this.selectedRunDates = Object.assign([], this.availableRunDates);
        }
        else {
            this.selectedRunDates = Object.assign([], []);
        }

        this.sendAdMaterialData();
    }

    openUrl() {
        this.invalidURL = "";
        let urlReg: RegExp = new RegExp('^https?\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{1,3}(/\S*)?$');
        //console.log(urlReg.test(this.clickThroughUrl.value))
        if (urlReg.test(this.clickThroughUrl.value)) {
            window.open(this.clickThroughUrl.value, '_blank');
        }
        else {
            this.invalidURL = "Please Enter Valid URL";
        }
    }

    sendAdMaterialData(adMaterial? : any) {
        this.passUpdatedAdMaterial.emit({
            updatedAdMaterialId: this.newAdMaterial.Id,
            effectiveDates: this.selectedRunDates,
            clickThroughUrl: this.clickThroughUrl.value
        })
        console.log('pass udpated material');
    }

    sendCroppedAdmaterialData(source:any , target:any, orderId:number)
    {
        this.passUpdatedAdMaterial.emit({
            sourceAdmaterial: source,
            targetAdmaterial: target,
            orderId: orderId,
            request:'CroppedAdmaterailData'
        })
    }

    adMaterialPreview(adMaterialUrl, adSize?: IAdSize) {
        let dialogRefPopup = this.modalService.open(PreviewImageComponent, {
            backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
        });
        dialogRefPopup.componentInstance.imageUrl = adMaterialUrl + "&adPreviewSizeId=0";
        dialogRefPopup.componentInstance.height = !isNullOrUndefined(adSize) ? adSize.WidthInPixels : 250;
        dialogRefPopup.componentInstance.min = !isNullOrUndefined(adSize) ? adSize.WidthInPixels / 2 : 120;
        dialogRefPopup.componentInstance.max = !isNullOrUndefined(adSize) ? adSize.WidthInPixels * 2 : 500;
    }

    isNotAllowedToChangeTemplate() {
        return this.currentOrderItem.TypeId == this.orderItemTypes['PrintClassifiedsOrderItem'];
    }


    openImageEditorModal(editImage?: string, adMaterial?: any) {
        console.log('open crop' + editImage);
        console.log(adMaterial);
        let orderId = this.order.IsCreatedInAdSS ? this.order.AdSSId : this.order.AditId;
        if(this.editableOrder.NewAdMaterial && adMaterial)
        this.sendCroppedAdmaterialData(adMaterial,this.editableOrder.NewAdMaterial,orderId);
        //console.log('material added');
        if (!isNullOrUndefined(editImage)) {
            (<any>window)._trackEvent('Edit Material Crop', 'Crop Material Click', 'Crop Material', 'Cropping Material');
        } else {
            (<any>window)._trackEvent('Edit Material Upload', 'Upload Material Click', 'Upload Material', 'Uploading Material');
        }

        

        const modalRef = this.modalService.open(ImageEditorComponent, {
            size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
        });
        modalRef.componentInstance.odrerId = orderId;
        modalRef.componentInstance.currentOrderItemId = this.currentOrderItem.Id;
        modalRef.componentInstance.adMaterialId = adMaterial && adMaterial.Id ? adMaterial.Id : this.newAdMaterial.Id;
        modalRef.componentInstance.externalMaterialId = adMaterial && adMaterial.ExternalId ? adMaterial.ExternalId : this.newAdMaterial.ExternalId;
        modalRef.componentInstance.newAdMaterialId = this.newAdMaterial.Id;
        modalRef.componentInstance.newExternalMaterialId = this.newAdMaterial.ExternalId;

        modalRef.componentInstance.adSizeId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSizeId : 0;
        modalRef.componentInstance.sectionId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.SectionId : 0;
        modalRef.componentInstance.isColor = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.IsColor : false;
        modalRef.componentInstance.widthInPixels = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSize.WidthInPixels : 0;
        modalRef.componentInstance.heightInPixels = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSize.HeightInPixels : 0;
        modalRef.componentInstance.fileExtension = 'jpg';
        modalRef.componentInstance.isEditOrder = true;
        console.log('model open');
        console.log(modalRef.componentInstance);
       
        if (!isNullOrUndefined(editImage) && editImage == 'editUploadedImage')
        {
            modalRef.componentInstance.isEditImage = true;
            //console.log('inside editUploadedImage')
        }
            

        modalRef.result.then(result => {
            if (result !== undefined && result.data && result.data == "acceptAndContinue") {
               
                this.IsWarningMessageShown = result.IsWarningMessageShown;
                //this.currentOrderItem.AdMaterialUrl = 'api/configure/getAdMaterialPreview?orderId=' + orderId + '&adMaterialId=' + this.newAdMaterial.Id + '&externalAdMaterialId=' + this.newAdMaterial.ExternalId + '&isColor=' + this.currentOrderItem.IsColor + "&ts=" + new Date().getTime();
                this.newAdMaterialUrl = this.getMaterialUrlString();
                this.currentOrderItem.HasAdMaterialDefined = true;
                this.currentOrderItem.HasUploadedAd = true;
                this.hasUploadedNewMaterial = true;
                //console.log('model accept close');
                //console.log(adMaterial);
               this.sendAdMaterialData();
                
                
            }
        })
    }
}

import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { DiscardModalService } from "../../../shared/discard-modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageEditorComponent } from "../../configure-ad/size/image-editor/image-editor.component";
import { isNullOrUndefined } from "util";
import { IOrder, IOrderItem, IAttribute } from "../../../models/order-item.model";
import { OtherInfoService } from "../../configure-ad/other-info/other-info.service";
import { FormControl } from "@angular/forms";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'edit-upsell',
    templateUrl: './edit-upsell.component.html'
})

export class EditUpsellComponent extends BaseClass {

    @Input() order: IOrder;
    @Input() currentOrderItem: IOrderItem;
    @Input() upsellId: number;
    @Input() upsellImageList: string[];
    @Input() isCallFromAdit: boolean;
    @Output() passUpdatedImageList: EventEmitter<any> = new EventEmitter<any>();

    photoInput = new FormControl();
    orderId: number;
    systemName: string;
    attribute: IAttribute;

    isErrorMessageShown: boolean = false;
    errorMessage: string = '';

    constructor(private discardModalService: DiscardModalService,
        private modalService: NgbModal,
        private otherInfoService: OtherInfoService,_configSvc: RuntimeConfigLoaderService,) {
        super(_configSvc);
    }

    validationInit() {
        this.orderId = this.order.IsCreatedInAdSS ? this.order.AdSSId : this.order.AditId;
        this.systemName = this.order.IsCreatedInAdSS ? 'adss' : 'adit';
        console.log(this.currentOrderItem.UpsellAttributes);
        console.log(this.upsellId);
        this.attribute = this.currentOrderItem.UpsellAttributes.find(upsellAttribute => upsellAttribute.Id == this.upsellId);
        console.log(this.attribute);
    }

    getUpsellUrlString(attributeId, index) {
        let url = "/orders/GetImageListAttributeImage/" + this.systemName + "/" + this.orderId + "/" + attributeId + "/" + index + "?ts=" + new Date().getTime();
        if(this.isCallFromAdit) {
            url += "&isEditing=" + this.isCallFromAdit;
        }
        return url;
    }

    openImageEditor(index, imageType) {
        const modalRef = this.modalService.open(ImageEditorComponent, {
            size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
        });
        modalRef.componentInstance.isEditUpsellImage = true;
        modalRef.componentInstance.odrerId = this.orderId;
        modalRef.componentInstance.systemName = this.systemName;
        modalRef.componentInstance.currentOrderItemId = this.currentOrderItem.Id;
        
        modalRef.componentInstance.adMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].Id : 0;
        
        modalRef.componentInstance.externalMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].ExternalId : 0;
        modalRef.componentInstance.adSizeId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSizeId : 0;
        modalRef.componentInstance.sectionId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.SectionId : 0;
        modalRef.componentInstance.isColor = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.IsColor : false;

        modalRef.componentInstance.widthInPixels = !isNullOrUndefined(this.attribute) ? this.attribute.ImageWidth : 640;
        modalRef.componentInstance.heightInPixels = !isNullOrUndefined(this.attribute) ? this.attribute.ImageHeight : 480;
        modalRef.componentInstance.photoIndex = index;
        modalRef.componentInstance.attributeId = this.upsellId;
        modalRef.componentInstance.fileExtension = 'jpg';
        modalRef.componentInstance.imageType = imageType;
        modalRef.componentInstance.isEditing = this.isCallFromAdit;
        modalRef.result.then(result => {
            if (result !== undefined && result.data && result.data == "acceptAndContinue") {
                this.upsellImageList[index] = this.getUpsellUrlString(this.upsellId, index);
                this.updatedImageList();
            }
        })
    }

    deletePhoto(index) {
        let photoNumber = index + 1;
        let body = "Are you sure you want to remove Photo " + photoNumber + "?";
        let header = "Confirmation";
        let deletePopup = this.discardModalService.deleteOrCancel(body, header);
        deletePopup.result.then(result => {
            if (result !== undefined && result.data && result.data == "continue") {
                this.removeImageListAttributeItem(index);
            }
        });
    }

    removeImageListAttributeItem(index) {
        this.otherInfoService.removeImageListAttributeItem(this.orderId, this.systemName, this.upsellId, index)
            .subscribe(data => {
                if (data.IsSuccess) {
                    this.upsellImageList[index] = null;
                    this.updatedImageList();
                }
            });
    }

    fileUpload(event, index) {
        this.isErrorMessageShown = false;
        let inputValue = event.target.files[0];
        var file: File = inputValue;
        let fileName = inputValue['name'];
        let parts = fileName.split('.');

        let formData: FormData = new FormData();
        formData.append('myFile', file, file.name);
        this.clearPictureAttachment();
        this.otherInfoService.uploadImageListAttribute(this.orderId, this.systemName, this.upsellId, index, formData, this.isCallFromAdit)
            .subscribe((data) => {
                if (data.IsCroppingRequired) {
                    this.openImageEditor(index, 'temporary');
                }
                else if (data.IsSuccessful) {
                    this.upsellImageList[index] = this.getUpsellUrlString(this.upsellId, index);
                    this.updatedImageList();
                }
                else {
                    this.isErrorMessageShown = true;
                    this.errorMessage = data.ValidationResult.Errors[0].ErrorMessage;
                }

            })

    }

    updatedImageList() {
        this.passUpdatedImageList.emit({
            updatedUpsellImageList: this.upsellImageList
        })
    }

    clearPictureAttachment() {
        this.photoInput.setValue('');
    }

}
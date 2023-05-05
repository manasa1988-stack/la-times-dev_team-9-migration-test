import { Component } from '@angular/core';
import { BaseClass } from '../../shared/base.class';
import { IOrder, IOrderItem, IAttributeDisplayGroup } from '../../models/order-item.model';
import { OrderHistoryService } from '../order-history/order-history.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import * as adssMetadata from '../../shared/adss.metadata';
import { isNullOrUndefined } from 'util';
import { ILayout } from '../../models/layout.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditOrderService } from './edit-order.service';
import { IUpdateImageListAttribute, IUpdateInputAttribute, IUpdateAdMaterial, IEditOrder, IUpdateMaterialDirectory } from '../../models/edit-order.model';
import { EmailValidator, DecimalNumberValidator, DateValidator } from '../../shared/custom-validators';
import { ReviewOrderService } from '../review-order/review-order.service';
import { ConfirmationService } from '../order-confirmation/order-confirmation.service';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { getUpsellImageListArray } from '../../shared/common.functions';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'edit-order',
    templateUrl: './edit-order.component.html'
})

export class EditOrderComponent extends BaseClass {

    editableOrder: IEditOrder;
    order: IOrder;
    orderId: number;
    orderItemId: number;
    externalAdMaterialId: number;
    currentOrderItem: IOrderItem;
    errorMessage: string;

    orderItemTypes = adssMetadata.OrderItemType;

    imageListAttributeId: number;

    isRedirectedFromDesignAd: boolean;

    editExternalAdMaterialId: number;
    editAdMaterialId: number;

    isOrderReady: boolean = false;

    fieldType = adssMetadata.FieldType;

    postUpdateImageListUpdatedCompleted: boolean = false;
    postUpdateInputAttributeCompleted: boolean = false;
    postUpdateAdMaterialCompleted: boolean = false;

    cancelledAdMaterial: boolean = false;
    cancelledUpsell: boolean = false;

    isEdited: boolean = false;
    systemName: string = "adss";

    classCodeGroupId: number = 0;

    upsellImage = {};

    editTextForms: {
        name: string,
        attributeFormGroup: FormGroup,
        attributes: any[]
    }[] = [];

    updatedInputAttributeList;

    updateImageAttributeRequest: IUpdateImageListAttribute = <IUpdateImageListAttribute>{};
    updateInputRequest: IUpdateInputAttribute = <IUpdateInputAttribute>{};
    updateAdMaterialRequest: IUpdateAdMaterial = <IUpdateAdMaterial>{};
    upsellSaved = false;
    materialUpdated = false;
    updateMaterialDirectory : IUpdateMaterialDirectory = <IUpdateMaterialDirectory>{};

    constructor(private route: ActivatedRoute,
        private editOrderService: EditOrderService,
        private router: Router,
        private reviewOrderService: ReviewOrderService,
        private confirmationService: ConfirmationService,
        private orderHistoryService: OrderHistoryService,
        private discardModalService: DiscardModalService,_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
        (<any>window)._trackPage('ADSS - Edit - Material', this.route.snapshot.url);
    }

    validationInit() {
        this.route.params.subscribe((params: Params) => {
            this.orderId = params['orderId'] ? params['orderId'] : null;
            this.orderItemId = params['orderItemId'] ? params['orderItemId'] : null;
            this.externalAdMaterialId = params['externalAdMaterialId'] ? params['externalAdMaterialId'] : 0;

            this.systemName = params['systemName'] ? params['systemName'] : 'adss';

            // if(this.router.url.includes('material')) {
            //     this.systemName = 'adit';
            // }

            this.imageListAttributeId = params['imageListAttributeId'] ? params['imageListAttributeId'] : 0;
            this.classCodeGroupId = params['classCodeGroupId'] ? params['classCodeGroupId'] : 0;
        });

        this.route.queryParams.subscribe((params: Params) => {
            if (this.classCodeGroupId <= 0) {
                this.imageListAttributeId = params['imageListAttributeId'] ? params['imageListAttributeId'] : 0;
            }
            this.isRedirectedFromDesignAd = params['isRedirectedFromDesignAd'] ? params['isRedirectedFromDesignAd'] : false;
        });

        this.editOrderService.getEditOrder(this.orderId, this.externalAdMaterialId, this.isRedirectedFromDesignAd, this.imageListAttributeId, this.systemName)
            .subscribe(data => {
                this.editableOrder = data.Result;
                if (data.Result) {
                    this.order = data.Result ? data.Result.Order : null;
                    this.editExternalAdMaterialId = this.editableOrder.NewAdMaterial ? this.editableOrder.NewAdMaterial.ExternalId : 0;
                    this.editAdMaterialId = this.editableOrder.NewAdMaterial ? this.editableOrder.NewAdMaterial.Id : 0;
                    this.orderItemId = this.editableOrder.NewAdMaterial && this.imageListAttributeId == 0
                        ? this.editableOrder.NewAdMaterial.OrderItemId :
                        this.editableOrder.Order.OrderItems.find(orderItem => orderItem.UpsellAttributes.length > 0) ?
                            this.editableOrder.Order.OrderItems.find(orderItem => orderItem.UpsellAttributes.length > 0).Id : 0;

                    // console.log(this.orderItemId);

                    this.currentOrderItem = this.orderItemId > 0 ?
                        this.order.OrderItems.find(orderItem => orderItem.Id == this.orderItemId) : this.order.OrderItems[0];

                    this.updateAdMaterialRequest.EffectiveDates = [];

                    if (this.isRedirectedFromDesignAd) {
                        this.getUpdatedMaterialFromDesignAd();
                    }

                    if (this.imageListAttributeId > 0)
                        this.getUpsellAttributes();

                    if (this.classCodeGroupId <= 0)
                        this.getEditTextAttributes();
                }
                this.isOrderReady = true;
            },
                (err) => {
                    this.isOrderReady = true;
                });
    }

    getUpsellAttributes() {
        let upsellAttribute = this.currentOrderItem.UpsellAttributes.find(upsellAttribute => upsellAttribute.Id == this.imageListAttributeId);

        if ((!isNullOrUndefined(this.order.AttributeValues[upsellAttribute.Name].Value) && this.order.AttributeValues[upsellAttribute.Name].Value.length > 0)
            || (this.classCodeGroupId > 0)) {
            this.upsellImage['id'] = upsellAttribute.Id;
            this.upsellImage['name'] = upsellAttribute.Name;

            this.upsellImage['upsellImageList'] = getUpsellImageListArray(this.order.AttributeValues[upsellAttribute.Name], upsellAttribute.MaxLength);
        }
        console.log("this.upsellImage['upsellImageList'] ", this.upsellImage['upsellImageList']);
    }

    getEditTextAttributes() {
        this.order.AttributeDisplayGroups.forEach(attributeDisplayGroup => {
            this.createFormForEachGroup(attributeDisplayGroup);
        });
    }

    isCallFromAdit() {
        return this.classCodeGroupId > 0 || this.router.url.includes('material');
    }

    createFormForEachGroup(attributeDisplayGroup: IAttributeDisplayGroup) {
        let hasEditableAttributes = false;
        let attributes = [];
        let formGroup = {};

        attributeDisplayGroup.Attributes.forEach(attribute => {
            if (attribute.IsExternal) {
                attributes.push(attribute);
                formGroup[attribute.Name] = new FormControl(this.order.AttributeValues[attribute.Name].Value, this.mapValidators(attribute));
                hasEditableAttributes = true;
            }
        });

        if (hasEditableAttributes) {
            this.editTextForms.push({
                name: attributeDisplayGroup.Name,
                attributeFormGroup: new FormGroup(formGroup),
                attributes: attributes
            });
        }
    }

    private mapValidators(attribute) {
        const formValidators = [];
        if (attribute.IsRequired)
            formValidators.push(Validators.required);
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
        return formValidators

    }

    submit() {
        this.errorMessage = null;
        (<any>window)._trackEvent('Edit Design Material', 'Submit Click', 'Submit Order', 'Submit Order');

        (this.currentOrderItem.HasAdMaterial && !isNullOrUndefined(this.updateAdMaterialRequest.AdMaterialID)) ? this.postUpdateAdMaterial() : this.postUpdateAdMaterialCompleted = true;
        (this.currentOrderItem.UpsellAttributes.length > 0 && !isNullOrUndefined(this.updateImageAttributeRequest.ImageListAttributeID)) ? this.postUpdateImageListAttribute() : this.postUpdateImageListUpdatedCompleted = true;
        (this.editTextForms.length > 0 && this.updatedInputAttributeList) ? this.postUpdateInputAttribute() : this.postUpdateInputAttributeCompleted = true;
    }

    getUpdatedImageList($event) {
        this.upsellImage['upsellImageList'] = !isNullOrUndefined($event.updatedUpsellImageList) ? $event.updatedUpsellImageList : this.upsellImage['upsellImageList'];

        this.updateImageAttributeRequest.ImageListAttributeID = this.upsellImage['id'];
        this.updateImageAttributeRequest.ImageListAttributeName = this.upsellImage['name'];

        if (!isNullOrUndefined($event.updatedUpsellImageList))
            this.isEdited = true;
    }

    getUpdatedInputAttributes($event) {
        this.updatedInputAttributeList = $event.updatedInputAttributes;

        if (!isNullOrUndefined($event.updatedInputAttributes))
            this.isEdited = true;
        else
            this.isEdited = false;
    }

    isEffectiveDatesShown() {
        return this.currentOrderItem.TypeId != this.orderItemTypes['OnlineDisplayOrderItem'] && this.currentOrderItem.AllSubmittedAdMaterial[0].ExternalId != this.editableOrder.NewAdMaterial.ExternalId
    }

    getUpdatedMaterialFromDesignAd() {
        this.updateAdMaterialRequest.AdMaterialID = this.editableOrder.NewAdMaterial.Id;

        if (!isNullOrUndefined(this.currentOrderItem.ClickThroughUrl))
            this.updateAdMaterialRequest.ClickThroughURL = this.currentOrderItem.ClickThroughUrl;

        this.isEdited = true;
    }

    getUpdatedMaterial($event) {
      //  console.log('inside getUpdatedMaterial');
        if($event.request && $event.request == 'CroppedAdmaterailData')
        {
           this.updateMaterialDirectory.source=$event.sourceAdmaterial;
           this.updateMaterialDirectory.target=$event.targetAdmaterial;
           this.updateMaterialDirectory.orderId=$event.orderId;
          // console.log('calling inside editadmaterial');
            this.editOrderService.copyEditAdMaterialDirectory(this.updateMaterialDirectory).subscribe(result => {
              // console.log('inside editadmaterial');
            });
            return;
        }
     //   console.log('in else getUpdatedMaterial')
        this.updateAdMaterialRequest.AdMaterialID = $event.updatedAdMaterialId;
        this.updateAdMaterialRequest.EffectiveDates = $event.effectiveDates;
        this.updateAdMaterialRequest.ClickThroughURL = $event.clickThroughUrl;

        if ((!isNullOrUndefined($event.updatedAdMaterialId) && !isNullOrUndefined(this.updateAdMaterialRequest.EffectiveDates)
            && this.updateAdMaterialRequest.EffectiveDates.length > 0) ||
            (!isNullOrUndefined($event.updatedAdMaterialId) && !this.isEffectiveDatesShown())
            || !isNullOrUndefined($event.clickThroughUrl)) {
            // console.log("In Edited");
            this.isEdited = true;
        }
        else
            this.isEdited = false;
    }

    postUpdateImageListAttribute() {

        this.updateImageAttributeRequest.SystemName = this.order.IsCreatedInAdSS ? 'adss' : 'adit';
        this.updateImageAttributeRequest.SystemKey = this.order.IsCreatedInAdSS ? this.order.AdSSId : this.order.AditId;
        this.updateImageAttributeRequest.ImageListAttributeID = this.upsellImage['id'];
        this.updateImageAttributeRequest.ImageListAttributeName = this.upsellImage['name'];

        this.updateImageAttributeRequest.FormCollection = {};
        this.updateImageAttributeRequest.FormCollection[this.upsellImage['name']] = "";

        this.upsellImage['upsellImageList'].forEach(upsellImageItem => {
            if (isNullOrUndefined(upsellImageItem)) {
                this.updateImageAttributeRequest.FormCollection[this.upsellImage['name']] += ",";
            }
            else {
                let imgItem = upsellImageItem.indexOf('?') > 0 ? upsellImageItem.substring(0, upsellImageItem.indexOf('?')) : upsellImageItem;
                this.updateImageAttributeRequest.FormCollection[this.upsellImage['name']] += imgItem + ",";
            }
        });

        this.editOrderService.updateImageListAttribute(this.updateImageAttributeRequest).subscribe(result => {
            if (result.IsSuccess) {
                this.postUpdateImageListUpdatedCompleted = result.IsSuccess;
                this.upsellSaved = true;
                this.redirectAfterApiCompletion();
            }
            else {
                this.errorMessage = "Error from Server. Please Try again after some time.";
            }
        });
    }

    postUpdateInputAttribute() {

        this.updateInputRequest.SystemName = this.order.IsCreatedInAdSS ? 'adss' : 'adit';
        this.updateInputRequest.SystemKey = this.order.IsCreatedInAdSS ? this.order.AdSSId : this.order.AditId;
        this.updateInputRequest.FormCollection = {};
        this.updateInputRequest.FormCollection = this.updatedInputAttributeList;

        // console.log("this.updateInputRequest ", this.updateInputRequest);

        this.editOrderService.updateAttributeInputs(this.updateInputRequest).subscribe(result => {
            if (result.IsSuccess) {
                this.postUpdateInputAttributeCompleted = result.IsSuccess;
                this.redirectAfterApiCompletion();
            }
            else {
                this.errorMessage = "Error from Server. Please Try again after some time.";
            }
        });
    }

    postUpdateAdMaterial() {

        this.updateAdMaterialRequest.SystemName = this.order.IsCreatedInAdSS ? 'adss' : 'adit';
        this.updateAdMaterialRequest.SystemKey = this.order.IsCreatedInAdSS ? this.order.AdSSId : this.order.AditId;

        // this.updateAdMaterialRequest.OldPrice = this.currentOrderItem.Price;
        this.updateAdMaterialRequest.OldPrice = this.editableOrder.Order.Price;

        console.log("this.updateAdMaterialRequest ", this.updateAdMaterialRequest);

        this.editOrderService.updateAdMaterial(this.updateAdMaterialRequest).subscribe(result => {
            if (result.IsSuccess) {
                this.postUpdateAdMaterialCompleted = result.IsSuccess;
                this.materialUpdated = true;
                this.redirectAfterApiCompletion();
            }
            else {
                this.errorMessage = "Error from Server. Please Try again after some time.";
            }
        });
    }

    redirectAfterApiCompletion() {

        // console.log("this.postUpdateImageListUpdatedCompleted ", this.postUpdateImageListUpdatedCompleted);
        // console.log("this.postUpdateAdMaterialCompleted ", this.postUpdateAdMaterialCompleted);
        // console.log("this.postUpdateInputAttributeCompleted ", this.postUpdateInputAttributeCompleted);

        if (this.postUpdateImageListUpdatedCompleted && this.postUpdateAdMaterialCompleted && this.postUpdateInputAttributeCompleted) {
            if (this.isCallFromAdit()) {
                let body = "You will be returned to Order Entry.";
                let confirmPopup = this.discardModalService.showAditMessage(body);
                if (this.upsellSaved) {
                    console.log("This is upsellSaved");
                    window.parent && window.parent.postMessage('upsellSaved', "*");
                }
                else if (this.materialUpdated) {
                    console.log("This is materialUpdated");
                    window.parent && window.parent.postMessage('materialUpdated', "*");
                }
            }
            else {
                this.reviewOrderService.setConfirmedOrder({});
                this.getOrderDetails(this.editableOrder.Order.AditId);
            }
        }
    }

    getOrderDetails(orderId) {
        this.orderHistoryService.getOrderSummary(orderId)
            .subscribe(data => {
                this.confirmationService.setConfirmedOrder(data);
                this.router.navigateByUrl("/order/confirmation/" + this.editableOrder.Order.AditId)
            },
                (error) => {

                });
    }

    cancel() {
        (<any>window)._trackEvent('Edit Design Material', 'Cancel Click', 'Cancel Order', 'Cancel Order');
        this.cancelEditOrder();
    }

    cancelEditOrder() {

        // console.log(this.updateAdMaterialRequest.AdMaterialID);

        if (this.updateAdMaterialRequest.AdMaterialID) {
            this.cancelAdMaterial();
        }

        if (this.updateImageAttributeRequest.ImageListAttributeID) {
            this.cancelAttributesAndUpsell();
        }

        // console.log("this.updateAdMaterialRequest.AdMaterialID ", this.updateAdMaterialRequest.AdMaterialID);
        // console.log("this.updateImageAttributeRequest.ImageListAttributeID ", this.updateImageAttributeRequest.ImageListAttributeID);

        if (!this.updateAdMaterialRequest.AdMaterialID && !this.updateImageAttributeRequest.ImageListAttributeID)
            this.router.navigateByUrl("/orders/" + this.editableOrder.Order.AditId);
    }

    redirectAfterCancel() {
        if ((this.updateAdMaterialRequest && this.cancelledAdMaterial) ||
            (this.cancelledUpsell && !isNullOrUndefined(this.updateImageAttributeRequest.ImageListAttributeID)))
            this.router.navigateByUrl("/orders/" + this.editableOrder.Order.AditId);
    }

    cancelAdMaterial() {
        this.editOrderService.cancelEditMaterial(this.order.IsCreatedInAdSS == true ? this.order.AdSSId : this.order.AditId,
            this.editAdMaterialId,
            this.editExternalAdMaterialId)
            .subscribe(result => {
                // console.log("result ", result);
                if (result.IsSuccess) {
                    this.cancelledAdMaterial = result.IsSuccess;
                    this.redirectAfterCancel();
                }
            });
    }

    cancelAttributesAndUpsell() {
        this.editOrderService.cancelAttributeInputsAndUpsellImages(this.order.IsCreatedInAdSS == true ? this.order.AdSSId : this.order.AditId,
            this.order.IsCreatedInAdSS ? 'adss' : 'adit',
            this.updateImageAttributeRequest.ImageListAttributeID ? this.updateImageAttributeRequest.ImageListAttributeID : 0)
            .subscribe(result => {
                // console.log("cancelAttributeInputsAndUpsellImages ", result);
                if (result.IsSuccess) {
                    this.cancelledUpsell = result.IsSuccess;
                    this.redirectAfterCancel();
                }
            });
    }

}

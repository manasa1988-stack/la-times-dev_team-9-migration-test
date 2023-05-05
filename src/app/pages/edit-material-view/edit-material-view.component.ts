import { Component } from "@angular/core";
import { BaseClass } from "../../shared/base.class";
import { ActivatedRoute, Params } from "@angular/router";
import { OrderHistoryService } from "../order-history/order-history.service";
import { IOrder, IAdMaterial, IOrderItem } from "../../models/order-item.model";
import { isNullOrUndefined } from "util";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'edit-material-view',
    templateUrl: './edit-material-view.component.html'
})

export class EditMaterialViewComponent extends BaseClass {

    orderId: number;
    externalAdMaterialId: number;
    systemName: string;

    order: IOrder;
    currentAdMaterial: IAdMaterial;

    availableAdMaterials: IAdMaterial[] = [];

    currentOrderItem: IOrderItem;

    isOrderReady: boolean = false;

    constructor(private route: ActivatedRoute,
        private orderHistoryService: OrderHistoryService,_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
        this.route.params.subscribe((params: Params) => {
            this.orderId = params['orderId'] ? params['orderId'] : null;
            this.externalAdMaterialId = params['externalAdMaterialId'] ? params['externalAdMaterialId'] : 0;
            this.systemName = params['systemName'] ? params['systemName'] : null;
        });

        this.getOrderDetails();
    }

    getOrderDetails() {
        if (this.orderId && this.orderId > 0) {
            this.orderHistoryService.getAditOrder(this.orderId)
                .subscribe(data => {
                    this.order = data;
                    this.isOrderReady = true;
                    this.getAdMaterialForExternalAdMaterialId();
                },
                    (error) => {
                        this.isOrderReady = true;
                    });
        }
        else {
            this.isOrderReady = true;
            this.order = null;
        }
    }

    getAdMaterialForExternalAdMaterialId() {
        let cAdMaterial;
        let systemMaterials = this.order.IsCreatedInAdSS ? 'AllToBePublishedAdMaterial' : 'AllSubmittedAdMaterial';
        this.order.OrderItems.forEach(orderItem => {
            orderItem[systemMaterials].forEach(material => {
                this.availableAdMaterials[material.ExternalId] = material;
            });
            cAdMaterial = orderItem[systemMaterials].find(adMaterial => adMaterial.ExternalId == this.externalAdMaterialId);
            if (!isNullOrUndefined(cAdMaterial)) {
                this.currentAdMaterial = cAdMaterial;
                this.currentOrderItem = orderItem;
            }
        });

        if(isNullOrUndefined(this.currentOrderItem)) {
            this.currentOrderItem = this.order.OrderItems.find(orderItem => orderItem.AdMaterial.length > 0);
        }
        //console.log("this.availableAdMaterials ", this.availableAdMaterials);
    }

    showNextMaterial() {
        let externalId = this.currentAdMaterial.ExternalId + 1;
        this.currentAdMaterial = this.availableAdMaterials[externalId];
        this.setCurrentOrderItem();
    }

    showPrevMaterial() {
        let externalId = this.currentAdMaterial.ExternalId - 1;
        this.currentAdMaterial = this.availableAdMaterials[externalId];
        this.setCurrentOrderItem();
    }

    setCurrentOrderItem() {
        let systemMaterials = this.order.IsCreatedInAdSS ? "AllToBePublishedAdMaterial" : "AllSubmittedAdMaterial";
        this.order.OrderItems.forEach(oi => {
            oi[systemMaterials].forEach(am => {
                if (am.ExternalId == this.currentAdMaterial.ExternalId) {
                    this.currentOrderItem = oi;
                }
            })
        });
    }
}

import { Component, HostListener, ElementRef, ViewChild } from "@angular/core";
import { BaseClass } from "../../shared/base.class";
import { IOrder } from "../../models/order-item.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { OrderHistoryService } from "../order-history/order-history.service";
import { IMarketSettings } from "../../models/market-settings.model";
import { StorageService } from "../../shared/storage.service";
import { UserDetailsService } from "../user-details/user-details.service";
import { IUserDetails } from "../../models/user-details.model";
import { ICreditCard } from "../../models/credit-card.model";
import { PurchaseOrderService } from "../review-order/purchase-order.service";
import { ReviewOrderService } from "../review-order/review-order.service";
import { IPurchaseOrder } from "../../models/purchaseOrder.model";
import { isNullOrUndefined } from "util";
import { DraftOrdersService } from "../draft-orders/draft-orders.service";
import { ConfirmationService } from "./order-confirmation.service";
import { IDiscountedOrder } from "../../models/discountedOrder-model";
import { ProductSummaryService } from "../product-summary/product-summary.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "confirmation",
  templateUrl: "./order-confirmation.component.html",
  styleUrls: ["./order-confirmation.component.css"]
})

export class OrderConfirmationComponent extends BaseClass {

  isOrderLoaded: boolean = false;
  isDataReady: boolean = false;
  errorMessage: string;
  order: IOrder;
  orderId: number;
  marketSettings: IMarketSettings = null;
  confirmedOrder;
  discountedOrder: IDiscountedOrder;
  maxDeadline: string;

  previousUrl: boolean = false;

  upsellProcessed: any[] = [];
  // checkIfInProcessing: boolean = false;

  constructor(private route: ActivatedRoute,
    private orderHistoryService: OrderHistoryService,
    private storageService: StorageService,
    private reviewOrderService: ReviewOrderService,
    private draftOrdersService: DraftOrdersService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private productSummaryService: ProductSummaryService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    (<any>window)._trackPage('ADSS - Confirmation', this.route.snapshot.url);
    route.params.subscribe((params: Params) => {
      this.orderId = params['orderId'] ? params['orderId'] : null;
    });
  }

  validationInit() {

    this.marketSettings = <IMarketSettings>this.storageService.getHOST();

    if (!this.order) {
      this.getConfirmationData();
      this.getOrderDetails();
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    window.history.forward();
  }

  getConfirmationData() {
    this.confirmedOrder = this.reviewOrderService.getConfirmedOrder();
    // console.log("This this.confirmedOrder", this.confirmedOrder);
    if (!this.confirmedOrder)
      this.router.navigateByUrl("/queued/" + this.orderId);
  }

  getOrderDetails() {
    this.order = this.confirmationService.getConfirmedOrder();
    this.upsellProcessed = this.productSummaryService.processUpsellIfPresent(this.order);
    // console.log("this.order ", this.order);
    this.isOrderLoaded = true;
  }

  readFrom($event) {
    this.maxDeadline = $event.maxDeadline !== undefined ? $event.maxDeadline : this.maxDeadline;
    this.discountedOrder = $event.discountedOrder != undefined ? $event.discountedOrder : this.discountedOrder;
  }

}

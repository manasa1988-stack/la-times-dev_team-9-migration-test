import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { Router, ActivatedRoute } from "@angular/router";
import { IOrderItem, IOrder } from "../../../models/order-item.model";
import { IGetPriceRequest } from "../../../models/getPrice.request.model";
import { isNullOrUndefined } from "util";
import { ConfigureAdService } from "../configure-ad.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "product-toggle",
  templateUrl: "./product-toggle.component.html",
  styleUrls: ["./product-toggle.component.css"]
})
export class ProductToggleComponent extends BaseClass {
  currentPage: string;
  orderNumber: number = 0;
  orderItemIdPrev: number = 0;
  orderItemIdNext: number = 0;

  @Input() isOnConfigure: boolean;
  @Input() currentOrderItem: IOrderItem;
  @Input() order: IOrder;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
    private configureAdService: ConfigureAdService,
     _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {


  }

  ngOnChanges() {
    for (var i = 0; i < this.order.OrderItems.length; i++) {
      if (this.order.OrderItems[i].Id == this.currentOrderItem.Id) {
        this.orderNumber = i;
        this.previousProduct(this.orderNumber);
        this.nextProduct(this.orderNumber);
      }
    }
  }

  previousProduct(index) {
    if (index > 0) {
      this.orderItemIdPrev = this.order.OrderItems[index - 1].Id;
    }
  }

  nextProduct(indexJ) {
    if (indexJ < (this.order.OrderItems.length - 1)) {
      this.orderItemIdNext = this.order.OrderItems[indexJ + 1].Id;
    }
  }

  clickPrevious() {
    this.passEvent.emit({ nextOrderItemId: this.orderItemIdPrev});
   }

  clickNext() {
    this.passEvent.emit({ nextOrderItemId: this.orderItemIdNext});
  }

}

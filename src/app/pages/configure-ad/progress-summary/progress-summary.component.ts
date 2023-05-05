import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BaseClass } from '../../../shared/base.class';
import { ConfigureAdService } from '../../configure-ad/configure-ad.service';
import { IOrder, IOrderItem } from '../../../models/order-item.model';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'progress-summary',
  templateUrl: './progress-summary.component.html',
  styleUrls: ['./progress-summary.component.css'],
})
export class ProgressSummaryComponent extends BaseClass {
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Input() currentOrderItemId: number;
  @Input()  completed:  number;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  orderItems: IOrderItem[] = [];
  
  @ViewChild('top',{static:true}) public top: ElementRef;

  constructor(private configureAdService: ConfigureAdService,
    private router: Router,
    _configSvc: RuntimeConfigLoaderService ) {
    super(_configSvc);
  }

  validationInit() { }

  ngOnChanges() {
    this.orderItems = this.order.OrderItems.filter(data => data.IsOrderItemComplete == true && data.IsOrderItemConfigurable == true);
  }

  switchTab(index: number) {
    this.configureAdService.setTabIndex(index);
  }

  navigateProduct(orderId, tabIndex?) {
    if (!isNullOrUndefined(tabIndex))
      this.passEvent.emit({ nextOrderItemId: orderId, selectedTab: tabIndex });
    else
      this.passEvent.emit({ nextOrderItemId: orderId });
  }

  moveToTopView() {
    setTimeout(() => {
      if (!isNullOrUndefined(this.top)) {
        this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 100);
    this.switchTab(0);
  }

  public scrollTop(id) {
    if (this.currentOrderItemId == id) {
      this.moveToTopView();
    }
    else {
      this.moveToTopView();
      this.router.navigateByUrl("/drafts/" + this.order.AdSSId + "/" + id + "/configure");
    }
  }

  isWibbitzProduct() {
    return this.order.OrderItems.some((orderItem) => orderItem.IsWibbitzProduct);
  }

  saveDraft() {
    console.log('save draft from child');
    this.passEvent.emit();
  }
}

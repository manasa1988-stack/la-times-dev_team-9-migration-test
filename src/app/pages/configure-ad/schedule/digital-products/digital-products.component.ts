import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseClass } from '../../../../shared/base.class';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ConfigureAdService } from '../../configure-ad.service';
import { IOrder, IOrderItem, ISubsection } from '../../../../models/order-item.model';
import { IOrderItemPrice } from '../../../../models/order-item-price.model';
import { DiscardModalService } from '../../../../shared/discard-modal.service';
import { IConfigureDFPData } from '../../../../models/dfp-data.model';
import { isNullOrUndefined } from 'util';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: 'digital-products',
  templateUrl: './digital-products.component.html',
  styleUrls: ['./digital-products.component.css']
})
export class DigitalProductsComponent extends BaseClass {
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  orderItems: IOrderItem[];
  @Input() configureDFPData: IConfigureDFPData;
  @Input() currentOrderItemId: number;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  //selectedOrderItemId: number;
  IsProductConfigured: boolean = true;
  constructor(private route: Router,
    private currentRoute: ActivatedRoute,
    private discardModalService: DiscardModalService,
    private configureAdService: ConfigureAdService,
     _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  ngOnChanges() {
    this.orderItems = undefined;
    this.orderItems = this.order.OrderItems;
    
  }

  removeProduct(currentOrderItem) {
    if (this.configureDFPData.DfpOrderItems.length > 1) {
      this.removeOrderItemData(currentOrderItem);
    } else {
      let body = "There must be atleast one order item for the order.";
      let header = "Alert!";
      this.discardModalService.showMessage(body, header);
    }
  }

  addNewItem() {
    this.configureAdService.createNewDfpOrderItem(this.order.AdSSId, this.currentOrderItem.SectionId, this.currentOrderItem.AdSizeId, this.configureDFPData.DfpOrderItems.length).subscribe(data => {
      if (data.IsSuccess) {
        this.route.navigate(['/drafts/' + this.order.AdSSId + '/' + data.Result.OrderItemID + '/configure']);
      }
    },
      (error) => {        
      });
  }

  switchTab(index: number) {    
    this.configureAdService.setTabIndex(index);
  }

  validationInit() {
  }

  loadOrderDetails(Id, selectedTab): any {
    this.route.navigate(['/drafts/' + this.order.AdSSId + '/' + Id + '/configure'], { queryParams: { selectedTab: selectedTab } });
  }

  orderChanged(Id): any {
    this.route.navigate(['/drafts/' + this.order.AdSSId + '/' + Id + '/configure']);
  }

  updateSection(orderItemId, $event) {
    this.configureAdService.getSubsections(this.order.AdSSId, this.currentOrderItem.Id, $event.target.value).subscribe(data => {
      if (data.IsSuccess) {
       this.passEvent.emit({ fromChild: "updateSection" });       
      }
    });
    
  }

  removeOrderItemData(currentOrderItem) {
    let body = "Are you sure to delete this order item?";
    let header = "Confirmation";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.configureAdService.deleteDfpOrderItem(currentOrderItem.Id).subscribe((data:any) => {
          if (data.IsSuccess) {            
            this.currentOrderItemId = this.order.OrderItems.find(item => item.Id != currentOrderItem.Id).Id;
            this.route.navigate(['/drafts/' + this.order.AdSSId + '/' + this.currentOrderItemId + '/configure']);
          }
        },
          (error) => { 
          });
      }
    });
  }

  updateSubsection($event) {
    this.currentOrderItem.Subsection = this.currentOrderItem.Section.Subsections.find(e => e.Id == $event.target.value);
    this.currentOrderItem.SubsectionId = $event.target.value;
    this.passEvent.emit({ fromChild: "dfpDigitalProduct", currentOrderItem: this.currentOrderItem });
  }


}

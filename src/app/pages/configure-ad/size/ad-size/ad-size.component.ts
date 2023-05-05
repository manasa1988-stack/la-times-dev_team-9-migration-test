import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from "../../../../shared/base.class";
import { DiscardModalService } from "../../../../shared/discard-modal.service";
import { LayoutService } from "../layout.service";
import { ILayoutCarouselItem, ILayout } from "../../../../models/layout.model";
import { IOrder, IOrderItem, IAdTemplate } from '../../../../models/order-item.model';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as adssMetadata from '../../../../shared/adss.metadata';
import { isNullOrUndefined } from "util";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "ad-size",
  templateUrl: "./ad-size.component.html",
  providers: [DiscardModalService]
})
export class AdSizeComponent extends BaseClass {

  @Input() adSizeList: ILayout[];
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  selectedAdSize: ILayout;

  constructor(private discardModalService: DiscardModalService,
    private layoutService: LayoutService,_configSvc: RuntimeConfigLoaderService ) {
    super(_configSvc);
  }

  validationInit() {
    if (this.adSizeList) {
      if (!isNullOrUndefined(this.currentOrderItem.AdSizeId) && this.currentOrderItem.AdSizeId != 0) {
        this.selectedAdSize = this.adSizeList.find(elm => elm.AdSize.Id == this.currentOrderItem.AdSizeId);
      }
      if (isNullOrUndefined(this.selectedAdSize) || this.adSizeList.length == 1) {
        this.selectedAdSize = this.adSizeList[0];
      }
      this.updateSelectedAdSize();     
    }
  }

  onNotify($event: any) {
    (<any>window)._trackEvent('Configure Ad AD Size', 'AD Size Click', 'AD Size Change', 'AD Size Change');
    if ($event.selectedTile.AdSize.Id != this.currentOrderItem.AdSizeId && this.currentOrderItem.HasAdMaterialDefined) {
      this.startOver($event.selectedTile);
    }
    else {
      this.selectedAdSize = $event.selectedTile;
      this.updateSelectedAdSize();      
    }

  }

  updateSelectedAdSize() {
    if (!isNullOrUndefined(this.selectedAdSize)){
      this.adSizeList.forEach(size => {
        if (size.AdSize.Id != this.selectedAdSize.AdSize.Id)
          size.Ischecked = false;
        else
          size.Ischecked = true;
      });
      this.passEvent.emit({ currentOrderItem: this.currentOrderItem, selectedTile: this.selectedAdSize, operationToPerform: 'bindTemplates', fromChild: 'adSize' });
    }       
  }

  startOver(selectedTile?) {
    this.passEvent.emit({ currentOrderItem: this.currentOrderItem, selectedTile: selectedTile, operationToPerform: 'startOver', fromChild: 'adSize' });
  }

}

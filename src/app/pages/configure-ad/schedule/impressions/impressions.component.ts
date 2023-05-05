import { Component, Output, EventEmitter, Input } from "@angular/core";
import { BaseClass } from "../../../../shared/base.class";
import { IImpression } from "../../../../models/impression.model";
import { isNullOrUndefined } from "util";
import { IOrderItem } from "../../../../models/order-item.model";
import { ConfigureAdService } from "../../configure-ad.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: "impressions",
  templateUrl: "./impressions.component.html",
  styleUrls: ["./impressions.component.scss"]
})
export class ImpressionsComponent extends BaseClass {
  @Input() impressions: IImpression[] = [];
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() orderId : number;
  @Input() currentOrderItem: IOrderItem;

  constructor(private configureAdService: ConfigureAdService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
  } 

  selectImpression(impression){
     this.passEvent.emit({ fromChild: "impressions", impression: impression});
  }
}

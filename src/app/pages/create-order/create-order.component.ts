import { Component } from "@angular/core";
import { BaseClass } from "../../shared/base.class";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ICreateOrderRequest } from '../../models/create-order.request.model';
import { IOrder, IOrderItem, IVolumeDiscount } from '../../models/order-item.model';
import { CreateOrderService } from './create-order.service';
import { isNullOrUndefined } from "util";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: "crate-order",
  templateUrl: "./create-order.component.html",

})
export class CreateOrderComponent extends BaseClass {

  request: ICreateOrderRequest[] = [];
  showError: boolean = false;
  packageCode: string;
  isVendor: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private createOrderService: CreateOrderService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  createOrderRequest() {

    this.route.queryParams.subscribe((params: Params) => {
      let adsizeid = ".adsizeid";
      let AdTemplateCode = ".AdTemplateCode";
      let ClassCodeGroupId = ".ClassCodeGroupId";
      let Package = "package";
      let positionid = ".positionid";
      let ProductId = ".ProductId";
      let sectionid = ".sectionid";
      let TargetTypeId = ".TargetTypeId";
      let UsePrimaryDates = ".UsePrimaryDates";
      let ZoneIds = ".zoneids";
      let openBracket = "[";
      let closeBracket = "]";
      let isvendor = "isvendor";

      if (Object.keys(params) && Object.keys(params).length > 0) {

        if (params[Package])
          this.packageCode = params[Package];
        if (params[isvendor])
          this.isVendor = params[isvendor];

        for (let i = 0; i < 10; i++) {
          let adsizeidParam = openBracket + i + closeBracket + adsizeid;
          let AdTemplateCodeParam = openBracket + i + closeBracket + AdTemplateCode;
          let ClassCodeGroupIdParam = openBracket + i + closeBracket + ClassCodeGroupId;
          let positionidParam = openBracket + i + closeBracket + positionid;
          let ProductIdParam = openBracket + i + closeBracket + ProductId;
          let sectionidParam = openBracket + i + closeBracket + sectionid;
          let TargetTypeIdParam = openBracket + i + closeBracket + TargetTypeId;
          let UsePrimaryDatesParam = openBracket + i + closeBracket + UsePrimaryDates;
          let ZoneIdsParam = openBracket + i + closeBracket + ZoneIds;
          if (params[adsizeidParam] || params[AdTemplateCodeParam] || params[ClassCodeGroupIdParam] || params[positionidParam] || params[ProductIdParam] || params[sectionidParam] || params[TargetTypeIdParam] || params[UsePrimaryDatesParam] || params[ZoneIdsParam]) {

            let requestParam = <ICreateOrderRequest>{};
            if (params[adsizeidParam])
              requestParam.AdSizeId = params[adsizeidParam] ? params[adsizeidParam] : null;
            if (params[AdTemplateCodeParam])
              requestParam.AdTemplateCode = params[AdTemplateCodeParam] ? params[AdTemplateCodeParam] : null;
            if (params[ClassCodeGroupIdParam])
              requestParam.ClassCodeGroupId = params[ClassCodeGroupIdParam] ? params[ClassCodeGroupIdParam] : null;

            if (params[positionidParam])
              requestParam.PositionId = params[positionidParam] ? params[positionidParam] : null;
            if (params[ProductIdParam])
              requestParam.ProductId = params[ProductIdParam] ? params[ProductIdParam] : null;
            if (params[sectionidParam])
              requestParam.SectionId = params[sectionidParam] ? params[sectionidParam] : null;
            if (params[TargetTypeIdParam])
              requestParam.TargetTypeId = params[TargetTypeIdParam] ? params[TargetTypeIdParam] : null;
            if (params[UsePrimaryDatesParam])
              requestParam.UsePrimaryDates = params[UsePrimaryDatesParam] ? params[UsePrimaryDatesParam] : true;
            if (params[ZoneIds])
              requestParam.ZoneIds = params[ZoneIdsParam] ? params[ZoneIdsParam] : null;

            this.request.push(requestParam);
          }
          else
            break;
        }

        this.createOrder();
      }

    });
  }

  validationInit() {
    this.createOrderRequest();
  }

  createOrder() {
    if (this.request.length > 0 || !isNullOrUndefined(this.packageCode) || !isNullOrUndefined(this.isVendor))
      this.createOrderService.createOrder(this.request, this.packageCode, this.isVendor).subscribe((data:any) => {
        this.showError = false;
        if (data) {
          if(data.IsObitOrder) {
            console.log("Tracking Obit Order Package");
            (<any>window)._trackEvent('Configure Ad', 'Create Obit Order Package', 'Create', 'Obit Order Package');
          }
          this.router.navigate(['/drafts/' + data.OrderId + '/configure']);
        }
      },
        (error) => {
          this.showError = true;
        });
  }

}

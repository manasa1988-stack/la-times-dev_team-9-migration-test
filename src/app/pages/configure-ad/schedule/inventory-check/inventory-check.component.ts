import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseClass } from '../../../../shared/base.class';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigureAdService } from '../../configure-ad.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IConfigureDFPData, IInventoryData } from '../../../../models/dfp-data.model';
import { DraftOrdersService } from '../../../draft-orders/draft-orders.service';
import { IOrder, IOrderItem } from '../../../../models/order-item.model';
import { isNullOrUndefined } from 'util';
import { IUpdateOrderState } from '../../../../models/update-order-state.model';
import { IEditOrderItem } from '../../../../models/edit-order-item.model';
import { DateFormatPipe } from '../../../../filters/dateformat.pipe';
import * as adssMetadata from '../../../../shared/adss.metadata';
import { IGetPriceRequest } from '../../../../models/getPrice.request.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'inventory-check',
  templateUrl: './inventory-check.component.html',
  styleUrls: ['./inventory-check.component.css']
})
export class InventoryCheckComponent extends BaseClass {

  updateOrderState: IGetPriceRequest;
  errorMessage: string;
  showMessage: boolean = false;
  currentOrderItemId: number;
  adssId: number;
  inventoryCheckForm: FormGroup;
  receivedInventoryData: IConfigureDFPData = <IConfigureDFPData>{};
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentorderItemPrice: number;
  InventoryData: IInventoryData;
  configureDfp: IConfigureDFPData;
  orderItemTypes = adssMetadata.OrderItemType;
  constructor(private formBuilder: FormBuilder,
    private draftOrderService: DraftOrdersService,
    private configureAdService: ConfigureAdService,
    private route: Router,
    private dateFormatPipe: DateFormatPipe,
    private currentRoute: ActivatedRoute,
    _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  ngOnChanges() {
    this.errorMessage = '';
    this.showMessage = false;
    if (!isNullOrUndefined(this.inventoryCheckForm)) {      
      this.inventoryCheckForm.controls['Impressions'].setValue(this.currentOrderItem.NumImpressions);
      this.inventoryCheckForm.controls['ImpressionsAvailable'].setValue(this.currentOrderItem.AvailableUnits == 0 ? '' : this.currentOrderItem.AvailableUnits);
      this.inventoryCheckForm.controls['Price'].setValue('$' + (this.currentorderItemPrice).toFixed(2));
      this.inventoryCheckForm.controls['PricingModel'].setValue(this.currentOrderItem.DFPCostModel == 'CPM' ? 'Cost Per Thousand [CPM]' : this.currentOrderItem.DFPCostModel);

    }
  }

  formBuilderFunction() {
    this.inventoryCheckForm = this.formBuilder.group({
      'Impressions': [!isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.NumImpressions : 0, Validators.compose([Validators.required])],
      'PricingModel': [!isNullOrUndefined(this.currentOrderItem) ? (this.currentOrderItem.DFPCostModel == 'CPM' ? 'Cost Per Thousand [CPM]' : this.currentOrderItem.DFPCostModel) : ''],
      'ImpressionsAvailable': [!isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AvailableUnits : 0],
      'Price': ['$' + (this.currentorderItemPrice).toFixed(2)]
    });
  }

  checkInventory() {

    this.errorMessage = '';
    this.showMessage = false;
    let isDateRangeValid = this.validateRunDates();

    if (!isDateRangeValid) {
      this.errorMessage = "Please select valid date range to check available DFP impression.";
      this.showMessage = true;
    }

    if (isNaN(this.inventoryCheckForm.controls.Impressions.value) || this.inventoryCheckForm.controls.Impressions.value <= 0) {
      if (this.errorMessage) {
        this.errorMessage = 'Please select valid date range and impression to book.';
        this.showMessage = true;
      }
      else {
        this.errorMessage = 'Please enter a valid impression to book.';
        this.showMessage = true;
      }
    }

    if (!this.errorMessage) {
      this.configureAdService.checkDfpInventory(this.order.AdSSId, this.currentOrderItem.Id,
        this.inventoryCheckForm.controls.Impressions.value, this.order.IsProductConfigured).subscribe(data => {
          if (data.IsSuccess && !isNullOrUndefined(data.Result)) {

            this.inventoryCheckForm.controls['PricingModel'].setValue(data.Result.DFPCostModel === 'CPM' ? 'Cost Per Thousand [CPM]' : data.Result.DFPCostModel);
            this.inventoryCheckForm.controls['ImpressionsAvailable'].setValue(data.Result.AvailableUnits);

            if (data.Result.AvailableUnits > 0) {
              if (data.Result.DFPMsg) {
                this.errorMessage = data.Result.DFPMsg;
                this.showMessage = true;
              }

            } else {
              this.errorMessage = "Inventory is not available based on your current selections. Please adjust the number of requested impressions, your targeting or desired run dates and recheck the availability inventory";
              this.showMessage = true;
            }

            this.currentOrderItem.NumImpressions = this.inventoryCheckForm.controls.Impressions.value;
            this.currentOrderItem.AvailableUnits = data.Result.AvailableUnits;
            this.currentOrderItem.DFPCostModel = data.Result.DFPCostModel;
            this.passEvent.emit({ fromChild: "dfpInventory", currentOrderItem: this.currentOrderItem });
          }
        },
        (error) => {     
        });
    }

  }

  validationInit() {

    this.formBuilderFunction();
  }

  changeImpression(event): void {
    let NumImpression = event.target.value;
    if (NumImpression !== "") {
      this.currentOrderItem.NumImpressions = event.target.value;
      this.currentOrderItem.AvailableUnits = 0;
      this.currentOrderItem.DFPCostModel = '';
      this.passEvent.emit({ fromChild: "dfpInventory", currentOrderItem: this.currentOrderItem });
    }
  }

  validateRunDates(): boolean {

    let multipleDates = this.currentOrderItem.RunDates;
    if (multipleDates.length > 1)
      return true;
    else
      return false;
  }

}

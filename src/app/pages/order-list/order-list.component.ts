
import { Component, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BaseClass } from '../../shared/base.class';
import { Subject, BehaviorSubject } from "rxjs";
import * as adssMetadata from '../../shared/adss.metadata';
import { ActivatedRoute } from "@angular/router";
import { IOrderItem, IAdMaterial, IOrder } from "../../models/order-item.model";
import { IOrderListItem } from "../../models/order.model";
import { OrderHistoryService } from '../order-history/order-history.service';
import { DraftOrdersService } from '../draft-orders/draft-orders.service';
import { StorageService } from '../../shared/storage.service';
import { isNullOrUndefined } from 'util';
import { SpinnerService } from "../../shared/spinner.service";
import { IOrderListData } from "../../models/order-data.model";
import { getUpsellImageListArray } from "../../shared/common.functions";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: "order-list",
  templateUrl: "./order-list.component.html"
})

export class OrderListComponent extends BaseClass {

  @Input() isDraft: any;

  @Input() data: any;
  @Input() checkAll: boolean;
  @Input() filterApplied: boolean;

  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();

  rows: IOrderListItem[] = [];

  expanded: any = {};
  orderItemTypes = adssMetadata.OrderItemType;
  fieldTypes = adssMetadata.FieldType;

  deleteDraftList = [];
  showChecks: boolean = false;
  updateAllrows: boolean = true;

  hideLinesForSectionIds: number[];

  showSpinnerForOrder: boolean[] = [];

  upsellProcessed: any[] = [];

  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private orderHistoryService: OrderHistoryService,
    private storageService: StorageService,
    private draftOrdersService: DraftOrdersService,
    public spinnerService: SpinnerService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.showChecks = this.route.snapshot.url[0].path === ('draftorders');
    this.hideLinesForSectionIds = isNullOrUndefined(this.storageService.getHOST()) ? null : this.storageService.getHOST().HideLinesForSectionIds;
  }

  ngOnChanges() {
    if (this.data != undefined && this.data.Results) {
      this.rows = this.data.Results;
    }
    this.updateChecksOnRows();
  }

  public updateChecksOnRows(fromLoading?) {
    if (this.checkAll) {
      this.deleteDraftList = [];
      this.updateAllrows = true;
    }

    if (this.updateAllrows)
      this.rows.forEach(row => {
        if (isNullOrUndefined(fromLoading) || (fromLoading && this.checkAll)) {
          row.isChecked = this.checkAll;
          this.updateDeleteDraftOrderIds(row.AdSSId, row.isChecked);
        }
      });
    this.passEvent.emit({ DraftOrderIds: this.deleteDraftList, SelectAll: this.checkAll })
  }

  toggleAction(currentRow, index) {
    this.rows[index].isActionClicked = !this.rows[index].isActionClicked;
  }

  deleteOne(currentRow) {
    this.passEvent.emit({ DraftOrderId: currentRow.AdSSId, Action: "deleteDraft" });
  }

  orderSelected(currentRowId, $event) {
    this.updateDeleteDraftOrderIds(currentRowId, $event.checked);
    this.checkAll = false;
    this.updateAllrows = true;
    if (this.deleteDraftList.length == this.rows.length - 1) {
      this.updateAllrows = false;
    }
    if (this.deleteDraftList.length == this.rows.length) {
      this.checkAll = true;
    }
    this.rows.find(row => row.AdSSId == currentRowId).isChecked = $event.checked;
    this.passEvent.emit({ DraftOrderIds: this.deleteDraftList, SelectAll: this.checkAll });
  }

  updateDeleteDraftOrderIds(currentRowId, checked) {
    if (checked)
      this.deleteDraftList.push(currentRowId);
    else {
      let index = this.deleteDraftList.indexOf(currentRowId);
      this.deleteDraftList.splice(index, 1);
    }
  }

  validationInit() {
  }

  expand(row, index) {
    this.rows[index].isCollapsed = !this.rows[index].isCollapsed;

    if (!this.rows[index].isSummaryLoaded) {
      this.showSpinnerForOrder[index] = true;
      if (!this.rows[index].isCollapsed) {
        if (row.IsDraft || row.IsQueued) {
          this.draftOrdersService.getDraftSummary(row.AdSSId)
            .subscribe(data => {
              this.rows[index].order = data;
              this.processResponse(index);
              this.showSpinnerForOrder[index] = false;
              this.rows[index].isSummaryLoaded = true;
            },
              (error) => {
                this.showSpinnerForOrder[index] = false;
              });
        }
        else {
          this.orderHistoryService.getOrderSummary(row.AditId)
            .subscribe(data => {
              this.rows[index].order = data;
              this.processResponse(index);
              this.showSpinnerForOrder[index] = false;
              this.rows[index].isSummaryLoaded = true;
            },
              (error) => {
                this.showSpinnerForOrder[index] = false;
              });
        }

      }
    }
  }

  processResponse(index) {
    let attribute;

    this.rows[index].order.OrderItems.forEach(item => {

      if (item.UpsellAttributes.length > 0) {

        this.upsellProcessed[item.Id] = {};

        item.UpsellAttributes.forEach(upsellAttribute => {

          attribute = this.rows[index].order.AttributeValues[upsellAttribute.Name];

          if (upsellAttribute.IsImageListType && !isNullOrUndefined(attribute.Value)) {
            this.upsellProcessed[item.Id][upsellAttribute.Name] = getUpsellImageListArray(attribute, upsellAttribute.MaxLength);
          }
          else if (attribute.Value && attribute.Value.length > 0 && JSON.parse(attribute.Value)) {
            this.upsellProcessed[item.Id][upsellAttribute.Name] = JSON.parse(attribute.Value);
          }
        });
      }

      item.showLines = this.hideLinesForSectionIds != undefined && this.hideLinesForSectionIds != null ? !this.hideLinesForSectionIds.includes(item.SectionId) : true;
    });
  }

  showCustomerProof(currentRow) {
    this.passEvent.emit({ AdssOrderId: currentRow.AdSSId, Action: 'showCustomerProof' });
  }

  allowOrderCancellation(currentRow) {
    this.passEvent.emit({ AdssOrderId: currentRow.AditId, Action: 'allowOrderCancellation' });
  }

  renew(currentRow) {
    this.passEvent.emit({ AdssOrderId: currentRow.AdSSId, Action: 'allowRenewOrder' });
  }

  validClickThroughUrl(currentRow) {
    return currentRow.IsValidClickThroughUrl;
  }
}

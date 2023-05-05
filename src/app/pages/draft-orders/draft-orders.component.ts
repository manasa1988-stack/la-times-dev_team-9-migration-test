import { Component, OnInit, ViewChild } from '@angular/core';
import { DraftOrdersService } from './draft-orders.service';
import { StorageService } from '../../shared/storage.service';
import { IFilter } from '../../models/filter.model';
import { FormControl } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { ActivatedRoute } from '@angular/router';
import { OrderListComponent } from '../order-list/order-list.component';
import { IOrderListData } from '../../models/order-data.model';
import { SpinnerService } from '../../shared/spinner.service';
import { BaseClass } from '../../shared/base.class';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'app-draft-orders',
  templateUrl: './draft-orders.component.html',
  providers: [DiscardModalService]
})
export class DraftOrdersComponent extends BaseClass {

  draftOrders: IOrderListData;

  customerNumber: string
  selectAll: boolean = false;
  isDraftListReady: boolean = false;
  isAdItInReadOnlyMode : boolean = false;
  DraftOrderId: number;
  DraftOrderIds: number[] = [];
  loadingMore: boolean = false;
  filterApplied: boolean = false;
  customerSupportEmail: string;
  filter: IFilter = {
    dateFilter: null,
    from: null,
    to: null,
    pageNumber: 1,
    pageSize: 15
  };

  @ViewChild(OrderListComponent,{static:true}) orderListComponent: OrderListComponent;

  constructor(private draftOrdersService: DraftOrdersService,
    private storageService: StorageService,
    private discardModalService: DiscardModalService,
    private route: ActivatedRoute,_configSvc: RuntimeConfigLoaderService) {
      super(_configSvc);
      (<any>window)._trackPage('ADSS - Draft - Order', this.route.snapshot.url);
  }

  validationInit() { 
    this.filter.pageSize = this.pageSize;
    this.customerNumber = isNullOrUndefined(this.storageService.getUserInfo()) ? null : this.storageService.getUserInfo().customerNumber;
    this.getDraftOrders();
    this.customerSupportEmail = this.storageService.getHOST().CustomerSupportEmail;
  }

  initialize(event) {
    this.selectAll = event.checked;
  }

  applyFilter($event) {
    (<any>window)._trackEvent('Draft Order Filter', 'Filter Click', 'Draft Order Filter', 'Draft Order Filter');
    this.filter = $event.filter;
    this.filterApplied = true;
    this.getDraftOrders();
  }

  getDraftOrders() {
    this.isDraftListReady = false;
    this.draftOrdersService.getDraftOrders(this.filter).subscribe((data) => {
      this.draftOrders = data;
      this.updateRows();
      if(this.draftOrders.Results.length > 0)
        this.isAdItInReadOnlyMode = this.draftOrders.Results[0].IsAdItInReadOnlyMode;
      this.isDraftListReady = true;
    },
      (error) => {
        this.filter.pageNumber -= 1;
        this.isDraftListReady = true;
      });
  }


  deleteSelected() {
    (<any>window)._trackEvent('Draft Order Delete', 'Delete Click', 'Delete draft', 'Delete Muliple selected draft');
    let existingPageNo = this.filter.pageNumber;

    if (this.DraftOrderIds && this.DraftOrderIds.length > 0) {
      let body = "Deleting Draft Orders: " + this.DraftOrderIds;
      let header = "Deleting Draft Orders";
      let deletePopup = this.discardModalService.deleteOrCancel(body, header);

      deletePopup.result.then(result => {
        if (result !== undefined && result.data && result.data == "continue") {
          this.draftOrdersService.deleteMany(this.DraftOrderIds).subscribe(data => {
            this.filter.pageNumber = 1;
            this.filter.pageSize = existingPageNo * this.filter.pageSize;
            this.getDraftOrders();
          });
        }
      });
    }

  }

  deleteOneDraft() {
    (<any>window)._trackEvent('Draft Order Delete', 'Delete Click', 'Delete draft', 'Delete selected draft');
    let existingPageNo = this.filter.pageNumber;

    let body = "Deleting Draft Order " + this.DraftOrderId;
    let header = "Deleting Draft Order";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.draftOrdersService.deleteOne(this.DraftOrderId).subscribe((data:any) => {
          if (data.IsSuccess) {
            this.filter.pageNumber = 1;
            this.filter.pageSize = existingPageNo * this.filter.pageSize;
            this.getDraftOrders();
          }
        });
      }
    });
  }

  loadMore() {
    this.loadingMore = true;
    this.filter.pageNumber += 1;
    this.draftOrdersService.getDraftOrders(this.filter).subscribe(data => {
      this.draftOrders.Results.push(...data.Results);
      this.draftOrders.NumberOfPages = data.NumberOfPages;
      this.draftOrders.PageNumber = data.PageNumber;
      this.draftOrders.PageSize = data.PageSize;
      this.draftOrders.Total = data.Total;
      this.orderListComponent.updateChecksOnRows(true);
      this.updateRows();
      this.loadingMore = false;
    });
  }

  private updateRows() {
    this.draftOrders.Results.forEach(row => {
      row.isCollapsed = true,
      row.isActionClicked = false
    });
  }

  readFrom($event: any) {
    this.DraftOrderId = $event.DraftOrderId;
    if (!isNullOrUndefined($event.SelectAll)) {
      this.selectAll = $event.SelectAll;
    }
    this.DraftOrderIds = $event.DraftOrderIds;

    if (this.DraftOrderId) {
      this.deleteOneDraft();
    }
  }

}

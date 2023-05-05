import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderHistoryService } from './order-history.service';
import { StorageService } from '../../shared/storage.service';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { isNullOrUndefined } from 'util';
import { IFilter } from '../../models/filter.model';
import { IOrderListData } from '../../models/order-data.model';
import { SpinnerService } from '../../shared/spinner.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import { BaseClass } from '../../shared/base.class';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  providers: [DiscardModalService]
})
export class OrderHistoryComponent extends BaseClass {

  orders: IOrderListData;
  action: string;
  aditOrderId: number;
  isDraft: boolean = false;
  isAdItInReadOnlyMode: boolean = false;
  customerNumber: string
  customerSupportEmail: string;
  isOrderListReady: boolean = false;
  loadingMore: boolean = false;

  filterApplied: boolean = false;

  filter: IFilter = {
    dateFilter: null,
    from: null,
    to: null,
    pageNumber: 1,
    pageSize: 15
  };

  isExportOrderInProgress: boolean = false;

  constructor(private route: ActivatedRoute,
    private ordersHistoryService: OrderHistoryService,
    private storageService: StorageService,
    private orderDetailsService: OrderDetailsService,
    private discardModalService: DiscardModalService,
    private router: Router,_configSvc: RuntimeConfigLoaderService) {
      super(_configSvc);
      (<any>window)._trackPage('ADSS - Order - History', this.route.snapshot.url);
  }

  validationInit() {
    this.filter.pageSize = this.pageSize;
    this.customerNumber = isNullOrUndefined(this.storageService.getUserInfo()) ? null : this.storageService.getUserInfo().customerNumber;
    this.getOrders();
    this.customerSupportEmail = this.storageService.getHOST().CustomerSupportEmail;
  }

  applyFilter($event) {
    (<any>window)._trackEvent('Order History Filter', 'Filter Click', 'Order History Filter', 'Order History Filter');
    this.filter = $event.filter;
    // console.log(this.filter);
    this.filterApplied = true;
    this.getOrders();
  }

  getOrders() {
    this.isOrderListReady = false;
    this.ordersHistoryService.getOrders(this.filter).subscribe((data) => {
      this.orders = data;
      this.updateRows();
      if (this.orders.Results.length > 0)
        this.isAdItInReadOnlyMode = this.orders.Results[0].IsAdItInReadOnlyMode;
      this.isOrderListReady = true;
    },
      (error) => {
        this.filter.pageNumber -= 1;
        this.isOrderListReady = true;
      });
  }

  exportOrders(){
    this.isExportOrderInProgress = true;

    this.ordersHistoryService.exportOrders(this.filter).subscribe(blob =>{
      this.isExportOrderInProgress = false;  
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'OrderHistory_Report.xlsx';
      link.click();
     
      window.URL.revokeObjectURL(url);
    });
  }

  loadMore() {
    this.loadingMore = true;
    this.filter.pageNumber += 1;
    this.ordersHistoryService.getOrders(this.filter).subscribe(data => {
      this.orders.Results.push(...data.Results);
      this.orders.NumberOfPages = data.NumberOfPages;
      this.orders.PageNumber = data.PageNumber;
      this.orders.PageSize = data.PageSize;
      this.orders.Total = data.Total;
      this.updateRows();
      this.loadingMore = false;
    },
      (error) => {
        this.loadingMore = false;
      });
  }

  private updateRows() {
    this.orders.Results.forEach(row => {
      row.isCollapsed = true,
        row.isActionClicked = false
    });
  }

  readFrom($event: any) {
    this.aditOrderId = $event.AdssOrderId;
    this.action = $event.Action;
    switch (this.action) {
      case 'showCustomerProof':
        this.ordersHistoryService.getPrintProof(this.aditOrderId)
          .subscribe((data) => {

          },
            (error) => {
            });
        break;
      case 'allowOrderCancellation':
        let body = "Cancelling Order " + this.aditOrderId;
        let header = "Cancelling Order ";
        let deletePopup = this.discardModalService.deleteOrCancel(body, header);
        deletePopup.result.then(result => {
          if (result !== undefined && result.data && result.data == "continue") {
            this.ordersHistoryService.cancelOrder(this.aditOrderId)
              .subscribe((data) => {
                if (data.IsSuccess) {
                  this.getOrders();
                }
                else
                  this.discardModalService.showMessage(data.ErrorMessage[0].Value, data.ErrorMessage[0].Key);
              },
                (error) => {
                  console.log(error);
                });
          }
        });
        break;
      case 'allowRenewOrder':
        this.orderDetailsService.renewOrder(this.aditOrderId)
          .subscribe((data) => {
            if (data.IsSuccess)
              this.router.navigateByUrl("/drafts/" + data.Result[0].Value + "/" + data.Result[1].Value + "/configure");
          },
            (error) => {
            });
        break;
      default:
        console.log("No action");
    }

  }

}

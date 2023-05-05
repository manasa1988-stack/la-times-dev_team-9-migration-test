import { Component, OnInit } from '@angular/core';
import { AdminBaseClass } from "../shared/admin-base.class";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderQueueService } from './order-queue.service';
import { IQueueOrder, IOrderQueueList } from '../models/setting.model';
import * as adssMetaData from '../../app/shared/adss.metadata';
import { isNullOrUndefined } from 'util';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { DiscardModalService } from '../../app/shared/discard-modal.service';
import { CookieService } from '../../app/shared/cookies.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'order-queue',
  templateUrl: './order-queue.component.html',
})

export class OrderQueueComponent extends AdminBaseClass {

  orderQueue: IOrderQueueList;
  isDataReady: boolean = false;
  displayError: boolean = false;
  loadingMore: boolean = false;
  timezoneOptions = adssMetaData.orderQueueTimeZones;
  selectAll: boolean = false;
  selectedOrderIds: number[] = [];
  selectedTimeZone: any;
  isAdItInReadOnlyMode: boolean;
  successMessage: string = "Successfully processed order(s): ";
  errorMessage: string = "Error processing order(s):";
  successfullyProcessedOrders: number[] = [];
  processingFailedOrders: number[] = [];
  pageNumber: number = 1;
  searchValue: string;
  orderQueueForm: FormGroup;
  orderId: number = 0;

  hasSearched: boolean = false;

  isOrderProcessing: boolean = false;

  constructor(private orderQueueService: OrderQueueService,
    private discardModalService: DiscardModalService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.orderQueueFormBuilder();
    this.getOrderQueues();
    let start = new Date().toString().indexOf("(");
    let end = new Date().toString().indexOf(")");
    let browserTimeZone = new Date().toString().slice(start + 1, end);
    let selectTimeZone = browserTimeZone.includes("Eastern") ? 'Eastern Standard Time' : browserTimeZone.includes("Pacific") ? 'Pacific Standard Time' : 'Central Standard Time';
    this.selectedTimeZone = this.timezoneOptions.find(t => t.value == selectTimeZone);
  }

  private orderQueueFormBuilder() {
    this.orderQueueForm = this.formBuilder.group({
      'orderId': ''
    });
  }

  getOrderQueues() {
    this.isDataReady = false;
    this.orderQueueService.getOrderQueues(this.pageNumber, this.pageSize, this.orderId).subscribe((data) => {
      this.orderQueue = data;
      this.updateOrderQueueRows();
      this.isDataReady = true;
    },
      (err) => {
        this.hasSearched = false;
        this.isDataReady = true;
        this.displayError = true;
      })
  }

  dateComparator(date) {
    let today = new Date();
    return new Date(date).getTime() > today.getTime();

  }

  onSearchChange() {
    this.pageNumber = 1;
    this.orderId = !isNullOrUndefined(this.orderQueueForm.controls['orderId'].value) ? this.orderQueueForm.controls['orderId'].value : 0;
    this.hasSearched = true;
    this.selectedOrderIds = [];
    this.getOrderQueues();
  }

  onClearSearch() {
    this.pageNumber = 1;
    this.hasSearched = false;
    this.orderQueueForm.controls['orderId'].setValue('');
    this.orderId = 0;
    this.getOrderQueues();
  }

  convertToTimeZone(order: IQueueOrder): IQueueOrder {
    let dt = new Date(order.BookingDeadline);
    let utc = dt.getTime() + (dt.getTimezoneOffset() * 60000);
    let offset: number = this.selectedTimeZone.offset;
    let nd = new Date(utc + (3600000 * offset));
    order.convertedBookingDeadline = nd.toString();
    return order;
  }

  updateOrderQueueRows() {
    this.selectAll = false;
    if (!isNullOrUndefined(this.orderQueue.Results) && this.orderQueue.Results.length > 0) {
      this.orderQueue.Results.forEach(o => {
        o.convertedBookingDeadline = o.BookingDeadline;
        if (this.selectedTimeZone.value !== o.BookingDeadlineTimeZone)
          o = this.convertToTimeZone(o);
        if (!isNullOrUndefined(this.selectedOrderIds) && this.selectedOrderIds.length > 0) {
          let index = this.selectedOrderIds.indexOf(+o.OrderId);
          if (index > -1)
            o.isSelected = true;
          else
            o.isSelected = false;
        }
      });

      let selectedFilter = this.orderQueue.Results.filter(o => {
        return o.isSelected;
      });

      if (selectedFilter.length == this.orderQueue.Results.length && this.orderQueue.Results.length > 0) {
        this.selectAll = true;
      }
    }
  }

  selectAllOrders($event) {
    this.selectAll = $event.checked;
    this.selectedOrderIds = [];
    this.orderQueue.Results.forEach(o => {
      o.isSelected = this.selectAll;
      if ($event.checked)
        this.selectedOrderIds.push(o.OrderId);
    });
  }

  selectOrder($event, orderQueue) {
    orderQueue.isSelected = $event.checked;
    if ($event.checked) {
      this.selectedOrderIds.push(orderQueue.OrderId);
      if (this.selectedOrderIds.length == this.orderQueue.Results.length)
        this.selectAll = $event.checked;
    }
    else {
      this.selectAll = $event.checked;
      let index = this.selectedOrderIds.indexOf(+orderQueue.OrderId);
      if (index > -1)
        this.selectedOrderIds.splice(index, 1);
    }
  }

  processOrder() {
    this.successfullyProcessedOrders = [];
    this.processingFailedOrders = [];
    let body;
    let header = "Please confirm";
    let deletePopup;
    let order: IQueueOrder;

    this.selectedOrderIds.forEach(id => {
      order = this.orderQueue.Results.find(o => o.OrderId == id);
      if (order.IsProcessing)
        body = "Is Process flag is set for order# " + id + ". Are you sure you would like to process this order again?";
      if (!this.dateComparator(order.BookingDeadline))
        body = "Order# " + id + " has passed booking deadline. Are you sure you would like to process this order?";
      if (order.IsProcessing || !this.dateComparator(order.BookingDeadline)) {
        deletePopup = this.discardModalService.deleteOrCancel(body, header);
        deletePopup.result.then(result => {
          if (result !== undefined && result.data && result.data == "continue") {
            this.orderQueueForm.controls["orderId"].disable();
            this.isOrderProcessing = true;
            this.orderQueueService.processOrder(id).subscribe(data => {
              this.isOrderProcessing = false;
              this.orderQueueForm.controls["orderId"].enable();
              if (data.Result.IsOrderCreated) {
                this.orderQueue.Results = this.orderQueue.Results.filter(order => order.OrderId != id);
                if (!this.successfullyProcessedOrders.includes(id))
                  this.successfullyProcessedOrders.push(id);
              }
              else {
                if (!this.processingFailedOrders.includes(id))
                  this.processingFailedOrders.push(id);
              }
              this.orderQueueForm.controls['orderId'].setValue('');
              //this.onSearchChange();
            })
          }
        });
      }
      else {
        this.orderQueueService.processOrder(id).subscribe(data => {
          if (data.Result.IsOrderCreated) {
            this.orderQueue.Results = this.orderQueue.Results.filter(order => order.OrderId != id);
            this.successfullyProcessedOrders.push(id);
          }
          else
            this.processingFailedOrders.push(id);

          this.orderQueueForm.controls['orderId'].setValue('');
          //this.onSearchChange();
        });
      }
    });

    this.selectedOrderIds = [];
  }

  timeZoneSelected(timeZone) {
    this.selectedTimeZone = timeZone;
    this.updateOrderQueueRows();
    this.orderQueueService.updateTimeZone(timeZone.value).subscribe(data => {
    })
  }

  loadMore() {
    this.loadingMore = true;
    this.pageNumber += 1;
    this.orderQueueService.getOrderQueues(this.pageNumber, this.pageSize, this.orderId).subscribe(data => {
      this.orderQueue.Results.push(...data.Results);
      this.updateOrderQueueRows();
      this.orderQueue.NumberOfPages = data.NumberOfPages;
      this.orderQueue.PageNumber = data.PageNumber;
      this.orderQueue.PageSize = data.PageSize;
      this.orderQueue.Total = data.Total;
      this.loadingMore = false;
    },
      (error) => {
        this.loadingMore = false;
      });
  }

}

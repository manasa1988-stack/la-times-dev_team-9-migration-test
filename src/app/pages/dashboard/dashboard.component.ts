import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AddEditCreditCardComponent } from '../credit-card/add-edit-credit-card/add-edit-credit-card.component';
import { StorageService } from '../../shared/storage.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseClass } from '../../shared/base.class';
import { UserDetailsService } from '../user-details/user-details.service';
import { isNullOrUndefined } from 'util';
import { DraftOrdersService } from '../draft-orders/draft-orders.service';
import { OrderHistoryService } from '../order-history/order-history.service';
import { IUserDetails } from '../../models/user-details.model';
import { IFilter } from '../../models/filter.model';
import { IOrderListData } from '../../models/order-data.model';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  providers: [DiscardModalService]
})
export class DashboardComponent extends BaseClass {

  userDetails: IUserDetails;
  isDataReady: boolean = false;
  isOrderListReady: boolean = false;
  isDraftListReady: boolean = false;
  action: string;
  aditOrderId: number;
  draftOrderId: number;

  isDraft: boolean = false;
  customerSupportEmail: string;
  drafts: IOrderListData;
  orders: IOrderListData;

  filter = <IFilter>{
    pageNumber: 1,
    pageSize: 5
  };


  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private userDetailsService: UserDetailsService,
    private draftOrdersService: DraftOrdersService,
    private orderHistoryService: OrderHistoryService,
    private discardModalService: DiscardModalService,
    private orderDetailsService: OrderDetailsService,
    private router: Router,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    (<any>window)._trackPage('ADSS - Dashboard', this.route.snapshot.url);
  }

  validationInit() {
    this.getUserDetails();
    this.getOrders();
    this.getDraftData();
    this.customerSupportEmail = this.storageService.getHOST().CustomerSupportEmail;
  }

  getUserDetails() {
    this.userDetailsService.getUserDetails().subscribe((data) => {
      this.userDetails = data;
      this.userDetailsService.storeUserDetails(this.userDetails);
      this.isDataReady = true;
    },
      (error) => {
        this.isDataReady = true;
      });
  }




  addCard() {

      (<any>window)._trackEvent('Dashboard CreditCard', 'Add New Credit Card Click', 'Add New Credit Card', 'Adding New Credit Card');

    const modalRef = this.modalService.open(AddEditCreditCardComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.result.then((result) => {
      if (result != undefined && result.data && result.data == 'reload')
        this.getUserDetails();
    });

  }

  onNotify($event: any) {
    this.getUserDetails();
  }

  tabChangeEvent($event) {
    if ($event.index === 0) {
        this.isDraft = false;
        (<any>window)._trackEvent('Dashboard Tab', 'Tab Click', 'Toggle', 'Order tab active');
    }
    if ($event.index === 1) {
        this.isDraft = true;
        (<any>window)._trackEvent('Dashboard Tab', 'Tab Click', 'Toggle', 'Drafts tab active');
    }
  }

  getDraftData() {
    this.draftOrdersService.getDraftOrders(this.filter).subscribe(data => {
      this.drafts = data;
      this.updateRows(false);
      this.isDraftListReady = true;
    },
      error => {
        this.isDraftListReady = true;
      });

  }

  getOrders() {
    this.orderHistoryService.getOrders(this.filter).subscribe(data => {
      this.orders = data;
      this.updateRows(true);
      this.isOrderListReady = true;
    },
      error => {
        this.isOrderListReady = true;
      });
  }

  readFrom($event: any) {
    this.aditOrderId = $event.AdssOrderId;
    this.action = $event.Action;
    if ($event.DraftOrderId)
      this.draftOrderId = $event.DraftOrderId;
    switch (this.action) {
      case 'showCustomerProof':
        this.orderHistoryService.getPrintProof(this.aditOrderId)
          .subscribe((data) => {
            //console.log(data);
            window.open(data);
          },
            (error) => {
              console.log(error);
            });
        break;
      case 'allowOrderCancellation':
        let body = "Cancelling Order " + this.aditOrderId;
        let header = "Cancelling Order ";
        let deletePopup = this.discardModalService.deleteOrCancel(body, header);
        deletePopup.result.then(result => {
          if (result !== undefined && result.data && result.data == "continue") {
            this.orderHistoryService.cancelOrder(this.aditOrderId)
              .subscribe((data) => {
                if (data.IsSuccess)
                  this.getOrders();
                else {
                  body = data.ErrorMessage[0].Value;
                  header = data.ErrorMessage[0].Key;
                  this.discardModalService.showMessage(body, header);
                }
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
      case "deleteDraft":
        body = "Deleting Draft Order " + this.draftOrderId;
        header = "Deleting Draft Order";
        deletePopup = this.discardModalService.deleteOrCancel(body, header);
        deletePopup.result.then(result => {
          if (result !== undefined && result.data && result.data == "continue") {
            this.draftOrdersService.deleteOne(this.draftOrderId).subscribe((data:any) => {
              if (data.IsSuccess) {
                this.getDraftData();
              }
            });
          }
        });
        break;
      default:
        console.log("No action");
    }
  }


  private updateRows(updateOrder: boolean) {
    if (updateOrder) {
      this.orders.Results.forEach(row => {
        row.isCollapsed = true,
          row.isActionClicked = false
      });
    }
    else {
      this.drafts.Results.forEach(row => {
        row.isCollapsed = true,
          row.isActionClicked = false
      });
    }

  }

}

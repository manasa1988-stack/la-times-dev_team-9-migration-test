import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BaseClass } from "../../shared/base.class";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { EmailValidator } from "../../shared/custom-validators";
import { IOrder, IId } from "../../models/order-item.model";
import { Router, Params, ActivatedRoute } from "@angular/router";
import { DraftOrdersService } from "../draft-orders/draft-orders.service";
import { StorageService } from "../../shared/storage.service";
import { IMarketSettings } from "../../models/market-settings.model";
import { MasterDataService } from "../master/master.data.service";
import { UserDetailsService } from "../user-details/user-details.service";
import { IUserDetails } from "../../models/user-details.model";
import { ICreditCard } from "../../models/credit-card.model";
import { ReviewOrderService } from "./review-order.service";
import { PurchaseOrderService } from "./purchase-order.service";
import { IPurchaseOrder, IIDString } from "../../models/purchaseOrder.model";
import { IDiscountedOrder } from "../../models/discountedOrder-model";
import { isNullOrUndefined } from "util";
import { PaymentOptionsComponent } from "./payment-options/payment-options.component";
import { ConfirmationService } from "../order-confirmation/order-confirmation.service";
import { OrderHistoryService } from "../order-history/order-history.service";
import { ReviewAccountInformationComponent } from "./review-account-information/review-account-information.component";
import { ProductSummaryService } from "../product-summary/product-summary.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: "review-order",
  templateUrl: "./review-order.component.html",
  styleUrls: ["./review-order.component.css"]
})

export class ReviewOrderComponent extends BaseClass {
  warningMessage: string = "Complete purchase by 9:00 am (CST) Mar 9, 2018 run date";
  accountInfoForm: FormGroup;
  creditCards: ICreditCard[];
  order: IOrder = null;
  adssId: number;
  isOrderLoaded: boolean = false;
  errorMessage: string;
  marketSettings: IMarketSettings = null;
  userDetails: IUserDetails;
  isDataReady: boolean = false;
  businessTypes = [];
  states = [];
  isSubmitting: boolean = false;
  IsPrintProof: boolean = false;

  optionForPayment = new FormControl(2);
  purchaseOrder: IPurchaseOrder = <IPurchaseOrder>{};

  discountedOrder: IDiscountedOrder;

  invoiceNote: string = null;
  couponCode: string = null;
  continueToSubmit = new FormControl();
  purchaseOrderErrors: Array<string> = null;

  orderPrice: number;

  paymentMethod: string = "Bill to my account";

  upsellProcessed: any[] = [];

  @ViewChild(PaymentOptionsComponent,{static:true}) paymentOptionsComponent: PaymentOptionsComponent;
  @ViewChild(ReviewAccountInformationComponent,{static:true}) reviewAccountInformationComponent: ReviewAccountInformationComponent;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private draftOrdersService: DraftOrdersService,
    private masterDataService: MasterDataService,
    private userDetailsService: UserDetailsService,
    private storageService: StorageService,
    private purchaseOrderService: PurchaseOrderService,
    private reviewOrderService: ReviewOrderService,
    private orderHistoryService: OrderHistoryService,
    private confirmationService: ConfirmationService,
    private productSummaryService: ProductSummaryService,_configSvc: RuntimeConfigLoaderService
  ) {
    super(_configSvc);
    (<any>window)._trackPage('ADSS - Review - Order', this.route.snapshot.url);
  }


  validationInit() {

    this.route.params.subscribe((params: Params) => {
      this.adssId = params["adssId"] ? params["adssId"] : null;
    });

    this.marketSettings = <IMarketSettings>this.storageService.getHOST();

    this.getDraftDetails();
    this.getUserDetails();
    this.getBusinessTypes();
    this.getStates();

    this.continueToSubmit.valueChanges.subscribe(value => {
      if (value)
        this.purchaseOrderErrors = null;
    });

  }

  getUserDetails(reload?: boolean) {
    this.userDetailsService.getUserDetails().subscribe(
      data => {
        this.userDetails = Object.assign({}, data);
        if (this.userDetails.CanPurchaseWithLineOfCredit && !reload)
          this.optionForPayment.setValue(1);
        this.isDataReady = true;
      },
      error => {
        this.isDataReady = true;
      },
      () => {
        this.creditCards = this.userDetails.CreditCards;
        this.reviewOrderService.setUserDetails(this.userDetails);
      }
    );
  }

  getBusinessTypes() {
    this.masterDataService.getBusinessTypes().subscribe(data => {
      this.businessTypes = data;
    });
  }

  getStates() {
    this.masterDataService.getSates().subscribe(data => {
      this.states = data;
    });
  }

  getDraftDetails() {
    if (this.adssId && this.adssId > 0) {
      this.draftOrdersService.getDraftSummary(this.adssId).subscribe(
        data => {
          this.order = data;
          if (!isNullOrUndefined(this.order.AditId))
            this.order.AditId > 0 ? this.router.navigateByUrl("/orders/" + this.order.AditId) : this.router.navigateByUrl("/queued/" + this.order.AdSSId);

          this.upsellProcessed = this.productSummaryService.processUpsellIfPresent(this.order);
          this.isOrderLoaded = true;
          this.orderPrice = this.order.Price;
          // console.log("this.order.Price ", this.order.Price);
        },
        error => {
          this.isOrderLoaded = true;
        }
      );
    } else {
      this.isOrderLoaded = true;
      this.order = null;
    }
  }

  getOrderDetails(orderId, isProcessed) {
    if (isProcessed) {
      this.orderHistoryService.getOrderSummary(orderId)
        .subscribe(data => {
          this.confirmationService.setConfirmedOrder(data);
          this.isOrderLoaded = true;
          this.routeToConfirmationPage(orderId);
        },
          (error) => {
            this.isOrderLoaded = true;
            this.routeToConfirmationPage(orderId);
          });
    }
    else {
      this.draftOrdersService.getDraftSummary(orderId)
        .subscribe(data => {
          this.confirmationService.setConfirmedOrder(data);
          this.isOrderLoaded = true;
          this.routeToConfirmationPage(orderId);
        },
          (error) => {
            this.isOrderLoaded = true;
            this.routeToConfirmationPage(orderId);
          });
    }
  }

  purchase() {

    (<any>window)._trackEvent('Review Order Complete Purchase', 'Complete Purchase Click', 'Complete Purchase', 'Complete Purchase');
    this.updatePurchaseOrder()

    this.isSubmitting = false;
    this.purchaseOrderErrors = new Array<string>();

    if (!isNullOrUndefined(this.paymentOptionsComponent))
      this.paymentOptionsComponent.updateValidity();

    this.reviewAccountInformationComponent.updateValidity();

    if (!this.reviewOrderService.getIsAccountFormValid() || !this.reviewOrderService.getIsPaymentFormValid()) {
      this.purchaseOrderErrors.push("Please provide all required details or correct invalid field(s).");
    }
    if ((isNullOrUndefined(this.orderPrice) || this.orderPrice > 0) && !(this.optionForPayment.value === 1 || (this.optionForPayment.value === 2 && (this.purchaseOrder.CreditCard || this.purchaseOrder.CreditCardId)))) {
      this.purchaseOrderErrors.push("Please select or enter a payment option.");
    }
    if (!this.continueToSubmit.value) {
      this.purchaseOrderErrors.push("Please proofread your order and confirm to purchase the order.");
    }

    if (this.purchaseOrderErrors == null || this.purchaseOrderErrors.length == 0) {
      this.isSubmitting = true;

      this.purchaseOrderService.completePurchase(this.purchaseOrder, this.adssId).subscribe((data:any) => {
        if (data.IsSuccess) {
          this.reviewOrderService.setConfirmedOrder(data.Result);
          let isProcessed = data.Result.Orderid > 0;
          let orderId = isProcessed ? data.Result.Orderid : this.adssId;
          this.getOrderDetails(orderId, isProcessed);
        }
        else {
          this.purchaseOrderErrors = new Array<string>();
          data.ValidationMessage.forEach(validationMessage => {
            if (!isNullOrUndefined(validationMessage.Value) && validationMessage.Key != "Exception")
              this.purchaseOrderErrors.push(validationMessage.Value)
          });
          data.ErrorMessage.forEach(errorMessage => {
            if (!isNullOrUndefined(errorMessage.Value) && errorMessage.Key != "Exception")
              this.purchaseOrderErrors.push(errorMessage.Value)
          });

          if (this.purchaseOrderErrors.length <= 0) {
            this.purchaseOrderErrors.push("Error while completing the purchase. Please try again after some time.");
          }

          this.isSubmitting = false;
        }
      },
        () => {
          this.isSubmitting = false;
        });
    }

  }

  routeToConfirmationPage(orderId) {
    this.isSubmitting = false;
    this.router.navigateByUrl("/purchase/" + orderId + "/confirmation");
  }


  updatePurchaseOrder() {
    this.purchaseOrder.CouponCode = this.couponCode ? this.couponCode : this.order.CouponCode;
    this.purchaseOrder.OrderNotes = this.invoiceNote;
    let userDetailfromService = this.reviewOrderService.getUserDetails();
    this.purchaseOrder.FirstName = userDetailfromService.FirstName;
    this.purchaseOrder.LastName = userDetailfromService.LastName;
    this.purchaseOrder.AditEmail = userDetailfromService.AditEmail;
    this.purchaseOrder.ConfirmEmailAddress = userDetailfromService.ConfirmEmail;
    this.purchaseOrder.Address = userDetailfromService.Address;
    this.purchaseOrder.PhoneNumber = userDetailfromService.Phone
    this.purchaseOrder.BusinessName = userDetailfromService.BusinessName;
    this.purchaseOrder.BusinessType = userDetailfromService.BusinessType;
    this.purchaseOrder.AdItCustomerNumber = userDetailfromService.CustomerNumber;
    this.purchaseOrder.IsFullDiscount = this.discountedOrder && this.discountedOrder.IsFullDiscountCoupon ? this.discountedOrder.IsFullDiscountCoupon : false;
    let newCardDetailsFromService = this.reviewOrderService.getNewCardDetails();
    this.purchaseOrder.CreditCard = newCardDetailsFromService;
    this.purchaseOrder.CreditCardId = this.reviewOrderService.getCardId();

    this.purchaseOrder.IsAdvertiser = this.reviewOrderService.getUserDetails().IsAdvertiser;
    this.purchaseOrder.SoldToCustomerID = this.reviewOrderService.getSoldToCustomer();

    if (isNullOrUndefined(newCardDetailsFromService)) {
      newCardDetailsFromService = this.creditCards.find(creditCard => creditCard.Id == this.purchaseOrder.CreditCardId);
    }
    this.purchaseOrder.PaymentMethod = null;
    this.purchaseOrder.CreditCardType = null;
    if (!isNullOrUndefined(newCardDetailsFromService)) {
      this.purchaseOrder.CreditCardType = <IIDString>{};
      this.purchaseOrder.CreditCardType.Id = newCardDetailsFromService.Type;
      this.purchaseOrder.CreditCardType.Name = newCardDetailsFromService.TypeName;
    }
    if (this.userDetails.CanPurchaseWithLineOfCredit) {
      this.purchaseOrder.PaymentMethod = <IIDString>{};
      this.purchaseOrder.PaymentMethod['Id'] = this.optionForPayment.value;
    }
    this.purchaseOrder.HasProofreadAd = this.continueToSubmit.value;
    this.purchaseOrder.CredituserSameAsBuyer = this.reviewOrderService.getCredituserSameAsBuyer();
    this.purchaseOrder.SaveCreditCardInfo = this.reviewOrderService.getSaveCreditCardInfo();
    this.purchaseOrder.IsDfpOrder = this.order.OrderItems[0].IsDfpOrderItem;
  }

  saveAndPurchaseLater() {
    this.purchaseOrderErrors = new Array<string>();
    (<any>window)._trackEvent('Review Order Complete Purchase', 'Complete Purchase Click', 'Complete Purchase', 'Complete Purchase');
    this.purchaseOrderService
      .saveAndPurchaseLater(this.adssId)
      .subscribe(data => {
        if (data.IsSuccess)
          this.router.navigateByUrl("/draftorders");
        else
          this.purchaseOrderErrors.push("Error while completing the purchase. Please try again after some time.");
      });
  }

  backToConfigure() {
    (<any>window)._trackEvent('Review Order BackToConfigure', 'Back To Configure Click', 'Back To Configure', 'Back To Configure');
    this.router.navigateByUrl("/drafts/" + this.adssId + "/configure");
  }

  PrintProof() {
    window.open("/api/order/printproof/" + this.adssId, this.adssId.toString());
  }

  reloadCardDetails($event) {
    if ($event.result == 'reload') {
      this.getUserDetails(true);
    }
    this.purchaseOrderErrors = $event.cardChanged ? null : this.purchaseOrderErrors;
  }

  readFrom(event) {
    this.invoiceNote = event.invoiceNote !== undefined ? event.invoiceNote : this.invoiceNote;
    this.couponCode = event.couponCode !== undefined ? event.couponCode : this.couponCode;
    this.discountedOrder = event.discountedOrder !== undefined ? event.discountedOrder : this.discountedOrder;
    this.orderPrice = event.discountedOrder !== undefined ? event.discountedOrder.FinalPrice : this.orderPrice

    if (this.orderPrice == 0 && !isNullOrUndefined(this.paymentOptionsComponent)) {
      // console.log("this.readFrom ", this.orderPrice);
      this.paymentOptionsComponent.setDefaultCard(this.orderPrice);
    }
  }

  changeOptionForPayment(val) {
    this.paymentMethod = val === 1 ? "Bill to my account" : "Credit Card";
    this.purchaseOrderErrors = null;
    this.optionForPayment.setValue(val);
    if (val === 1) {
      this.reviewOrderService.setNewCardDetails(null);
      this.reviewOrderService.setCardId(null);
      this.reviewOrderService.setIsPaymentFormValid(true);
    }
  }
}

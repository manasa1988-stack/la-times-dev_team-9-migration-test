
import {tap} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { IOrderItem, IAdMaterial, IOrder, IAdSize, IAttribute, ILegalDoc } from "../../models/order-item.model";
import { DiscardModalService } from '../../shared/discard-modal.service';
import * as adssMetadata from '../../shared/adss.metadata';
import { OrderHistoryService } from '../order-history/order-history.service';
import { StorageService } from '../../shared/storage.service';
import { isNullOrUndefined } from 'util';
import { FormControl } from '@angular/forms';
import { ConfigureAdService } from '../configure-ad/configure-ad.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderDetailsService } from '../order-details/order-details.service';
import { IDiscountedOrder } from '../../models/discountedOrder-model';
import { ImagePopoverComponent } from '../image-frame/image-popover/image-popover.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewImageComponent } from '../configure-ad/size/preview-image/preview-image.component';
import { BaseClass } from '../../shared/base.class';
import { DateFormatPipe } from '../../filters/dateformat.pipe';
import { OtherInfoService } from '../configure-ad/other-info/other-info.service';
import { IUploadLegalDocResponse } from '../../models/upload-legal-doc.response.model';
import { getUpsellImageListArray } from '../../shared/common.functions';
import { OrderInvoiceNoteComponent } from './order-invoice-note/order-invoice-note.component';
import { IOrderInvoiceNote } from '../../models/edit-order.model';
import { VideoPlayerComponent } from '../design-video/video-player.component';
import { VideoShareModalComponent } from '../design-video/video-share-modal.componet';
import { WibbitzService } from '../../shared/services';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.css'],
  providers: [DiscardModalService]
})

export class ProductSummaryComponent extends BaseClass {
  @Input() order: IOrder;
  @Input() allowUpdates: boolean;
  @Input() showOrderNumberHeader: boolean;
  @Input() showAttributes: boolean;
  @Input() showPriceSummary: boolean;
  @Input() editInvoice: boolean;
  @Input() orderId: number;
  @Input() adssId: number;
  @Input() upsellProcessed;

  @Output() sendData: EventEmitter<any> = new EventEmitter<string>();
  @Output() getValues: EventEmitter<any> = new EventEmitter<string>();

  showDeadlineMessage: boolean;
  showOrderLinePrice: boolean;
  showOrderPOP: boolean;
  hasContractPrice: boolean;
  isCanceled: boolean = false;
  isAdItInReadOnlyMode: boolean = false;
  isOrderLoaded: boolean = false;
  orderItemTypes = adssMetadata.OrderItemType;
  orderStatuses = adssMetadata.OrderStatuses;
  maxDeadline: Date;
  dateNow: Date = new Date();
  hideLinesForSectionIds: number[];
  timezone: string;
  zone = "";

  couponError = null;
  discountedOrder: IDiscountedOrder = <IDiscountedOrder>{};

  couponCode = new FormControl();
  invoiceNote = new FormControl();

  showUpsellGrid: boolean = false;
  fileExtension: string;
  allowedExtentions: string[] = ['jpeg', 'jpg', 'pdf', 'doc', 'docx'];
  showUploadDocErrorMessage: boolean = false;
  uploadDocErrorMessage = [];
  LstLegalDocs: ILegalDoc[] = [];
  uploadLegalDocResponse: IUploadLegalDocResponse;

  product = {};

  constructor(private orderHistoryService: OrderHistoryService,
    private storageService: StorageService,
    private configureAdService: ConfigureAdService,
    private discardModalService: DiscardModalService,
    private router: Router,
    private route: ActivatedRoute,
    private orderDetailsService: OrderDetailsService,
    private datePipe: DateFormatPipe,
    private otherInfoService: OtherInfoService,
    private wibbitzService: WibbitzService,
    private ngbModal: NgbModal,_configSvc: RuntimeConfigLoaderService) {

    super(_configSvc);

    this.showOrderLinePrice = false;
    this.showOrderPOP = false;
    this.isOrderLoaded = false;
    this.hideLinesForSectionIds = isNullOrUndefined(this.storageService.getHOST()) ? null : this.storageService.getHOST().HideLinesForSectionIds;
    this.timezone = isNullOrUndefined(this.storageService.getHOST()) ? null : this.storageService.getHOST().TimeZone;
    (<any>window)._trackPage('ADSS - Order - Details', this.route.snapshot.url);
    this.timezone.split(" ").forEach(s => {
      this.zone += s.charAt(0);
    })
  }

  IsSmallScreen = () => window.innerWidth <= 767;

  validationInit() {

    if (this.order.IsSubscriptionOpted && this.order.HasSubscriptionLine) {
      this.order.OrderItems.forEach(oi => { 
        if(oi.Section && oi.Section.IsSubscriptionSection) {
          this.configureAdService.deleteAdditionalOrderItem(oi.Id).subscribe((data:any) => {
            if (data.IsSuccess) {
              alert("Additional Product - Circulation Subscription removed since you have already subscribed to it.");
              window.location.reload();
            }
          },
            (error) => { 
            });
        }
      });
    }

    this.invoiceNote.valueChanges.subscribe(value => {
      this.sendData.emit({ invoiceNote: value });
    });

    this.couponCode.valueChanges.subscribe(value => {
      if (isNullOrUndefined(value) || value.length <= 0) {
        this.couponError = "";
      }
    });

    if (this.order != null) {

      this.couponCode.setValue(this.order.CouponCode);

      if (this.order.IsAdItInReadOnlyMode || this.order.IsQueued) {
        this.allowUpdates = false;
      }

      if (this.order.ApprovedPOPPath) {
        this.showOrderPOP = true;
      }

      this.order.OrderItems.forEach(oi => {       
        this.product[oi.Id] = true;
        oi.showLines = this.hideLinesForSectionIds != undefined && this.hideLinesForSectionIds != null ? !this.hideLinesForSectionIds.includes(oi.SectionId) : true;
        this.showOrderLinePrice = (!oi.IsHidePriceOrderRule);
        if (oi.ContractId && oi.ContractId > 0 && !this.hasContractPrice) {
          this.hasContractPrice = true;
        }      

        if (!this.order.IsQueued) {
          if ((!this.order.IsPackageOrder || this.order.PrimaryOrderItem.Id == oi.Id) && oi.HasAdMaterial) {


            if (oi.IsEditableMidRun || oi.TypeId == this.orderItemTypes['OnlineDisplayOrderItem'] || oi.TypeId == this.orderItemTypes['PrintDisplayOrderItem']) {
              if ((!this.maxDeadline || (oi.LastRunDate && this.maxDeadline < oi.LastRunDate.Deadline))) {
                this.maxDeadline = oi.LastRunDate ? oi.LastRunDate.Deadline : null;
                if (this.maxDeadline) {
                  this.showDeadlineMessage = new Date(this.maxDeadline.toString()) <= this.dateNow;
                }
              }
            }
            else {
              if ((!this.maxDeadline || (oi.FirstRunDate && this.maxDeadline < oi.FirstRunDate.Deadline))) {
                this.maxDeadline = oi.FirstRunDate ? oi.FirstRunDate.Deadline : null;
                if (this.maxDeadline) {
                  this.showDeadlineMessage = new Date(this.maxDeadline.toString()) <= this.dateNow;
                }
              }
            }
          }
        }
        else {
          this.showDeadlineMessage = true;
          if (!this.maxDeadline || (oi.FirstRunDate && this.maxDeadline > oi.FirstRunDate.Deadline)) {
            this.maxDeadline = oi.FirstRunDate ? oi.FirstRunDate.Deadline : null;
          }
        }
        //check If Upsell Exists
        if (oi.UpsellAttributes.length > 0) {
          oi.UpsellAttributes.forEach(upsellAttribute => {
            if ((upsellAttribute.IsBooleanType && this.order.AttributeValues[upsellAttribute.Name].Value == 'true') ||
              (upsellAttribute.IsImageListType && this.order.AttributeValues[upsellAttribute.Name].Value)
              && !this.showUpsellGrid) {
              this.showUpsellGrid = true;
            }
          });
        }

      });

      if (this.order.CouponCode && (this.order.AditId == null || this.order.AditId <= 0)) {
        this.applyCoupon(true);
      }

      setTimeout(() => {
        this.sendData.emit({ maxDeadline: this.maxDeadline });
      }, 100);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.IsSmallScreen()) {
        this.makeAllProductCollapsed();
      }
    }, 200);
  }

  clear() {
    this.couponCode.setValue(null);
    this.configureAdService.clearCoupon(this.order.AdSSId).subscribe(data => {
      if (data.IsSuccess) {
        this.couponCode.enable();
        this.discountedOrder = data.Result;
        this.order.Price = this.discountedOrder.FinalPrice;
        this.order.OldPrice = this.discountedOrder.OriginalPrice;
        this.order.UpdatedDiscountedAmount = this.discountedOrder.DiscountedPrice;
        this.order.CouponCode = this.couponCode.value;
        this.sendData.emit({ couponCode: this.order.CouponCode, discountedOrder: this.discountedOrder });
      }
    })
    this.order.CouponCode = this.couponCode.value;
  }

  navigateToEditVideo(){
    this.router.navigate([`/drafts/${this.order.AdSSId}/design-video`],{ queryParams: { editvideo: true } });
  }

  playVideo(videoUrl){
    let dialogRefPopup = this.ngbModal.open(VideoPlayerComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.videoUrl = videoUrl;
  }

  openShareModal(orderLineItem, order) {
    const MockOrder = {
      orderLineItem: {
        WibbitzVideoFileShareLink: 'https://assets-adss.caltimesqa.com/assets/wibbitz/videos/02ae486640a245af8cafc45cb1f8ad0e.mp4',
        YoutubeLink: 'pVPnJ7fje80',
        IsYoutubePublic: false,
        VideoDraftId: 'dda1a2b2-4fb1-47e7-b2cc-f3bf10a0a216',
      },
      order: {
        IsVideoEditDeadLinePassed: false,
      },
    };

    const dialogRefPopup = this.ngbModal.open(VideoShareModalComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.info = {orderLineItem, order};
    // dialogRefPopup.componentInstance.info = MockOrder;
    dialogRefPopup.componentInstance.update.subscribe((r: boolean) => {
      this.order.OrderItems.find(item => item.IsWibbitzProduct === true).IsYoutubePublic = r;
    });
  }

  editInvoiceNoteModal(){
    var orderInvoiceNote = <IOrderInvoiceNote>{};
    orderInvoiceNote.AditId = this.order.AditId;
    orderInvoiceNote.OrderNotes = this.order.OrderNotes;

    let modalRef = this.ngbModal.open(OrderInvoiceNoteComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    modalRef.componentInstance.orderInvoiceNote = Object.assign({}, orderInvoiceNote);
    modalRef.result.then(result => {
      if (result != undefined && result.data && result.data == "reload")
      {
        console.log('reload');
      }
    });
  }


  applyCoupon(ignore?) {
    (<any>window)._trackEvent('Review Order Apply Coupon', 'Apply Coupon Click', 'Apply Coupon', 'Apply Coupon');
    this.couponError = "";

    if (this.couponCode.value && this.couponCode.value.length > 0) {
      this.configureAdService.applyCouponCode(this.order.AdSSId, this.couponCode.value, ignore).subscribe(data => {
        // console.log("data.Result.DiscountedPrice ", data.Result.DiscountedPrice > 0.00);
        if (data.IsSuccess && data.Result.DiscountedPrice > 0.00) {
          this.couponCode.disable();
          this.discountedOrder = data.Result;
          this.order.Price = this.discountedOrder.FinalPrice;
          this.order.OldPrice = this.discountedOrder.OriginalPrice;
          this.order.UpdatedDiscountedAmount = this.discountedOrder.DiscountedPrice;
          this.order.CouponCode = this.couponCode.value;
          this.sendData.emit({ couponCode: this.order.CouponCode, discountedOrder: this.discountedOrder });
        }
        else
          this.couponError = "Coupon is not applicable or has expired."
      });
    }
  }

  cancelOrder() {
    if (this.order && this.order.IsCreatedInAdSS) {
      (<any>window)._trackEvent('Order Details Cancel Order', 'Cancel Click', 'Cancel Order', 'Cancelling Order Details');
      let body = "Are you sure you would like to cancel order " + this.order.AditId;
      let header = "Cancelling Order ";
      let deletePopup = this.discardModalService.deleteOrCancel(body, header);
      deletePopup.result.then(result => {
        if (result !== undefined && result.data && result.data == "continue") {
          this.orderHistoryService.cancelOrder(this.order.AditId)
            .subscribe((data) => {
              if (data.IsSuccess) {
                this.isCanceled = true;
                this.getValues.emit({
                  reloadCancelled: this.isCanceled
                })
              }
              else
                this.discardModalService.showMessage(data.ErrorMessage[0].Value, data.ErrorMessage[0].Key);
            },
              (error) => {

              });
        }
      });

    }
  }

  toggleProduct(productId) {
    this.product[productId] = !this.product[productId];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (!this.IsSmallScreen()) {
      this.makeAllProductVisible();
    }
  }

  makeAllProductVisible() {
    this.order.OrderItems.forEach(oi => {
      this.product[oi.Id] = true;
    });
  }

  makeAllProductCollapsed() {
    this.order.OrderItems.forEach(oi => {
      this.product[oi.Id] = false;
    });
  }

  counter(i: number) {
    return new Array(i);
  }

  adMaterialPreview(adMaterialUrl, adSize?: IAdSize) {
    let dialogRefPopup = this.ngbModal.open(PreviewImageComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.imageUrl = adMaterialUrl + "&adPreviewSizeId=0";
    dialogRefPopup.componentInstance.height = !isNullOrUndefined(adSize) ? adSize.WidthInPixels : 250;
    dialogRefPopup.componentInstance.min = !isNullOrUndefined(adSize) ? adSize.WidthInPixels / 2 : 120;
    dialogRefPopup.componentInstance.max = !isNullOrUndefined(adSize) ? adSize.WidthInPixels * 2 : 500;
  }

  showCampaignDescription() {
    return !(this.order.Description && this.order.Description.indexOf('Self Service') >= 0) && !this.order.IsObitOrder;
  }

  printReceipt() {
    (<any>window)._trackEvent('Order Details', 'Click', 'Print Order Details', 'Print Order Details');
    this.makeAllProductVisible();

    setTimeout(() => {
      this.getPrintContent();
    }, 1000);

  }

  getPrintContent() {
    let printContents, popupWin, title;
    title = 'Print receipt : ' + this.order.AditId;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'height=' + screen.availHeight + ',width=' + screen.availWidth + ',top=0,left=0');
    popupWin.location.href = '';
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <base href="/">
          <meta name="viewport" content="width=device-width, initial-scale=1">

          <link href="/wwwroot/styleBundle?v=printReceipt" rel="stylesheet" type="text/css" />
          <script src="/wwwroot/scriptBundle?v=printReceipt" type="text/javascript"></script>
        </head>
        <body id="printView" onload="window.print();">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  toggleVideoOnGallery(selected: boolean, order: IOrder) {
    this.wibbitzService.toggleVideoOnGallery(!selected, order.AditId).subscribe(
      re => console.log('Video visibility toggled'),
      err => console.error(err),
    );
  }

  IsEditAllowed(orderItem: IOrderItem) {

    var orderItemDeadline;
    var orderlineDeadlinePassed;

    if (orderItem.LastRunDate && orderItem.FirstRunDate) {
      orderItemDeadline = (orderItem.IsEditableMidRun || orderItem.TypeId == this.orderItemTypes['OnlineDisplayOrderItem'] || orderItem.TypeId == this.orderItemTypes['PrintDisplayOrderItem']) ? new Date(orderItem.LastRunDate.Deadline.toString()) : new Date(orderItem.FirstRunDate.Deadline.toString());
      orderlineDeadlinePassed = orderItemDeadline <= this.dateNow;
    }

    if (this.allowUpdates
      && !this.order.IsModifiedBeyondSupport
      && this.order.IsCreatedInAdSS
      && !this.isAdItInReadOnlyMode
      && orderItem.HasAdMaterial
      && this.order.Status.Id == this.orderStatuses.Submitted
      && !orderlineDeadlinePassed
      && (!this.order.IsPackageOrder || this.order.PrimaryOrderItem.Id == orderItem.Id)
      && orderItem.IsAdMaterialRequired) {
      return true;
    }

    return false;
  }

  renew(orderItemId?: number) {
    (<any>window)._trackEvent('Order Details Renew', 'Renew Click', 'Renew Order Details', 'Renewing Order Details');
    this.orderDetailsService.renewOrder(this.order.AdSSId, orderItemId).subscribe(data => {
      if (data.IsSuccess)
        this.router.navigateByUrl("/drafts/" + data.Result[0].Value + "/" + data.Result[1].Value + "/configure");
    });
  }

  goToEdit(orderItem: IOrderItem, upsellAttribute?: IAttribute) {
    let orderId = 0;
    (<any>window)._trackEvent('Confirmation Edit Material', ' Edit Material Click', 'Edit Material', 'Clicking Edit Material');
    orderId = !isNullOrUndefined(upsellAttribute) ? this.order.AdSSId : this.order.AditId;

    if (this.order.AditId) {
      let editIdUrl = "/order/edit/" + orderId + "/" + (orderItem.AdMaterial[0] ? orderItem.AdMaterial[0].ExternalId : "0")
      !isNullOrUndefined(upsellAttribute) ?
        this.router.navigate([editIdUrl], { queryParams: { imageListAttributeId: upsellAttribute.Id } }) : this.router.navigateByUrl(editIdUrl);
    }
    else
      this.router.navigateByUrl("/drafts/" + this.order.AdSSId + "/" + orderItem.Id + "/configure");
  }

  orderNumber() {
    (<any>window)._trackEvent('Order Details Order Number', 'Order Number Click', 'Order Number', 'Clicking Order Number');
  }

  getETearSheetUrl(orderItem: IOrderItem, runDate: Date) {
    let eTearSheetUrl = "/order/etearsheet/" + this.order.AditId + "/" + (orderItem.AdMaterial[0] ? orderItem.AdMaterial[0].ExternalId : "0") + "/" + this.datePipe.transform(runDate, "yyyyMMdd") + "/" + orderItem.Section.Product.MerlinOneName;
    return eTearSheetUrl;
  }

  allButtonsVisible() {
    if (this.order.ShowCustomerProof && this.showOrderPOP && this.allowUpdates && this.order.AllowOrderCancellation && this.order.AllowOrderRenewal) {
      return true;
    }
    else {
      return false;
    }
  }

  uploadLegalDoc($event, orderLineItem: IOrderItem) {
    let inputValue = $event.target.files[0];
    let fileName = inputValue['name'];
    let parts = fileName.split('.');
    this.fileExtension = parts[parts.length - 1];
    this.showUploadDocErrorMessage = false;
    this.uploadDocErrorMessage = [];
    if (this.allowedExtentions.includes(this.fileExtension.toLowerCase())) {
      if (inputValue.size <= 10485760) {
        this.readFile(inputValue, orderLineItem);
      }
      else {
        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("File is too large, maximum permitted file size is: 10MB.");
      }
    } else {

      this.showUploadDocErrorMessage = true;
      this.uploadDocErrorMessage.push("File has invalid extension, allowed extensions are: JPG,JPEG,PDF,DOC,DOCX");
    }
  }

  readFile(inputValue: any, orderLineItem: IOrderItem): void {
    var file: File = inputValue;
    let formData: FormData = new FormData();
    formData.append('myFile', file, file.name);
    let legalDoc = <ILegalDoc>{};
    this.otherInfoService.uploadLegalDoc(this.order.AdSSId, orderLineItem.Id, formData).pipe(tap(data => {
    })).subscribe((data) => {
      if (data.IsSuccess) {
        this.uploadLegalDocResponse = data.Result;
        legalDoc.DocumentName = this.uploadLegalDocResponse.DocumentName;
        legalDoc.DocumentId = this.uploadLegalDocResponse.DocumentId;
        legalDoc.OrderId = this.order.AdSSId;
        legalDoc.OrderItemId = orderLineItem.Id;
        if (isNullOrUndefined(orderLineItem.LstLegalDocs)) {
          orderLineItem.LstLegalDocs = [];
        }
        orderLineItem.LstLegalDocs.push(legalDoc);
      }
      else {
        this.showUploadDocErrorMessage = true;
        data.ValidationMessage.forEach(validationMesg => {
          this.uploadDocErrorMessage.push(validationMesg.Value);
        });
        data.ErrorMessage.forEach(validationMesg => {
          this.uploadDocErrorMessage.push(validationMesg.Value);
        });
      }
    },
      (error) => {
        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("There is an error from Server. Please try again.");
      });
  }

  removeLegalDoc(legalDoc: ILegalDoc, orderLineItem: IOrderItem) {
    this.showUploadDocErrorMessage = false;
    this.uploadDocErrorMessage = [];
    let body = "Are you sure you want to delete this document?";
    let header = "Confirmation";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.otherInfoService.deleteLegalDoc(legalDoc).pipe(tap(data => {
        })).subscribe((data) => {
          if (data.IsSuccess) {
            let index = orderLineItem.LstLegalDocs.findIndex(o => o.DocumentId == legalDoc.DocumentId);
            if (index > -1) {
              orderLineItem.LstLegalDocs.splice(index, 1);
            }
            // orderLineItem.LstLegalDocs = orderLineItem.LstLegalDocs.filter(d => d.DocumentId != legalDoc.DocumentId);
          }
          else {
            this.showUploadDocErrorMessage = true;
            data.ValidationMessage.forEach(validationMesg => {
              this.uploadDocErrorMessage.push(validationMesg.Value);
            });
            data.ErrorMessage.forEach(validationMesg => {
              this.uploadDocErrorMessage.push(validationMesg.Value);
            });
          }
        },
          (error) => {
            this.showUploadDocErrorMessage = true;
            this.uploadDocErrorMessage.push("There is an error from Server. Please try again.");
          });
      }
    });
  }

}

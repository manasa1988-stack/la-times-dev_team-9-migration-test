import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdminBaseClass } from "../../shared/admin-base.class";
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderDetailsService } from '../order-details.service';
import { IOrder, IAdSize, IOrderItem } from '../../../app/models/order-item.model';
import * as adssMetadata from '../../shared/admin-adss.metadata';
import { IUserDetails } from '../../../app/models/user-details.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateComponent } from '../order-details-template/order-details-template.component';
import { isNullOrUndefined } from 'util';
import { StorageService } from '../../../app/shared/storage.service';
import { PreviewImageComponent } from '../../../app/pages/configure-ad/size/preview-image/preview-image.component';
import { AdminService } from '../../admin.service';
import { DiscardModalService } from '../../../app/shared/discard-modal.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent extends AdminBaseClass {

  @Input() order: IOrder;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  orderItemTypes = adssMetadata.OrderItemType;
  orderId: number;
  orderStatuses = adssMetadata.OrderStatuses;
  userDetailsString: string = "N/A";
  hideLinesForSectionIds: number[];

  constructor(
    private orderDetailsService: OrderDetailsService,
    private adminService: AdminService,
    private storageService: StorageService,
    private ngbModal: NgbModal,
    private router: Router,
    private discardModalService: DiscardModalService,
    private modalService: NgbModal, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.hideLinesForSectionIds = isNullOrUndefined(this.storageService.getHOST()) ? null : this.storageService.getHOST().HideLinesForSectionIds;
  }

  validationInit() {
  }

  openTemplate(currentOrderItem: IOrderItem) {
    const modalRef = this.modalService.open(TemplateComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.templates = (!isNullOrUndefined(currentOrderItem.AdMaterial) && currentOrderItem.AdMaterial.length > 0) ? currentOrderItem.AdMaterial[0].AdTemplateDataValues : [];
    modalRef.componentInstance.dataType = "template";
    modalRef.componentInstance.adTemplate = (!isNullOrUndefined(currentOrderItem.AdMaterial) && currentOrderItem.AdMaterial.length > 0) ? currentOrderItem.AdMaterial[0].AdTemplate : null;
  }

  displayOrderAttributes() {
    const modalRef = this.modalService.open(TemplateComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.attributes = this.order.AttributeValues;
    modalRef.componentInstance.attributeDisplayGroups = this.order.AttributeDisplayGroups;
    modalRef.componentInstance.dataType = "attribute";
  }

  isLinesShown(sectionId): boolean {
    return this.hideLinesForSectionIds != undefined && this.hideLinesForSectionIds != null ? !this.hideLinesForSectionIds.includes(sectionId) : true;
  }

  adMaterialPreview(adMaterialUrl, heading?: string, adSize?: IAdSize) {
    let dialogRefPopup = this.ngbModal.open(PreviewImageComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.imageUrl = adMaterialUrl + "&adPreviewSizeId=0";
    dialogRefPopup.componentInstance.height = !isNullOrUndefined(adSize) ? adSize.WidthInPixels : 250;
    dialogRefPopup.componentInstance.min = !isNullOrUndefined(adSize) ? adSize.WidthInPixels / 2 : 120;
    dialogRefPopup.componentInstance.max = !isNullOrUndefined(adSize) ? adSize.WidthInPixels * 2 : 500;
    dialogRefPopup.componentInstance.heading = heading;
  }

  purgeOrder() {
    if (this.order.IsDraft) {
      this.discardModalService.confirmationModal("Are you sure you want to Purge this draft?").then(response => {
        if (response) {
          this.orderDetailsService.postPurgeId(this.order.AdSSId).subscribe(data => {
            if (data.IsSuccess) {
              alert("Draft Order: " + this.order.AdSSId + " has been successfully purged.");
              this.notify.emit({reload : true});
            }
            else {
              alert("Oops! There is an error purging draft");
            }
          }, (err) => {
            alert("Oops! There is an error purging draft");
          });
        }
      });
    }
  }
}

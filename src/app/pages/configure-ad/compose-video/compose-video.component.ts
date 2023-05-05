import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseClass } from "../../../shared/base.class";
import { DiscardModalService } from "../../../shared/discard-modal.service";
import { CookieService } from "../../../shared/cookies.service";
import { ILayoutCarouselItem, ILayout } from "../../../models/layout.model";
import { IOrder, IOrderItem } from '../../../models/order-item.model';
import { Router } from "@angular/router";
import { ModalMessages } from '../../design-video/constants/modal-messages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbMessageModalComponent } from '../../design-video/ngb-message-modal/ngb-message-modal.component';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "compose-video",
  templateUrl: "./compose-video.component.html",
  styleUrls: ["./compose-video.component.scss"],
})
export class ComposeVideoComponent extends BaseClass {
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() layoutData: ILayoutCarouselItem;
  @Input() selectedAdSize: ILayout;
  @ViewChild('loginPrompMessageModal',{static:true}) loginPrompMessageModal;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private ngbModal: NgbModal,
     _configSvc: RuntimeConfigLoaderService,
  ) {
    super(_configSvc);
  }

  validationInit() {
  }


  isValidUrl(url: string) {
  }

  getBrand() {
    if (this.order.BUCode === 'SDT')
      return 'San Diego Union-Tribune'

    if (this.order.BUCode === 'SDT')
      return 'Los Angeles Times'

    return 'Obituary'
  }

  moveToEditVideo() {
    if (!this.cookieService.check('c_mId')) {
      const modalRef = this.ngbModal.open(NgbMessageModalComponent);
      modalRef.componentInstance.message = ModalMessages.VIDEO_LOGIN_REDIRECT_MESSAGE;
      modalRef.componentInstance.primaryAction = () => {
        modalRef.close();
        this.loginRedirect();
      };
      modalRef.componentInstance.secondaryAction = () => {
        modalRef.close();
        this.gotoVideo();
      };
    } else {
      this.gotoVideo();
    }
  }

  isWibbitzVideoReady() {
    return this.order.OrderItems.some(item => item.IsWibbitzProduct && !!item.WibbitzVideoLink);
  }

  isDraftReady() {
    return this.order.OrderItems.some(item => item.IsWibbitzProduct && !!item.VideoDraftId);
  }

  loginRedirect() {
    this.router.navigate(['/login'], {
      queryParams: {
        return: `/drafts/${this.order.AdSSId}/design-video`,
      }
    });
  }

  gotoVideo() {
    this.router.navigate([`/drafts/${this.order.AdSSId}/design-video`]);
  }

}

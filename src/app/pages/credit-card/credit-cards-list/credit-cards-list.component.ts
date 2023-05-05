import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AddEditCreditCardComponent } from "../add-edit-credit-card/add-edit-credit-card.component";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CreditCardService } from "../credit-card.service";
import { BaseClass } from "../../../shared/base.class";
import { UserDetailsService } from "../../user-details/user-details.service";
import { DiscardChangesPopupComponent } from "../../discard-changes-popup/discard-changes-popup.component";
import { CreditCardNumberPipe } from "../../../filters/creditcard-number.pipe";
import { DiscardModalService } from "../../../shared/discard-modal.service";
import { ICreditCard } from "../../../models/credit-card.model";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "credit-cards-list",
  templateUrl: "./credit-cards-list.component.html",
  providers: [DiscardModalService]
})
export class CreditCardsListComponent extends BaseClass {
  @Input() cards: any;
  @Input() isDataReady: boolean;
  @Input() isReadOnly: boolean;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    public dialog: MatDialog,
    public ngbModal: NgbModal,
    private creditCardService: CreditCardService,
    private userDetailsService: UserDetailsService,
    private creditCardNumberPipe: CreditCardNumberPipe,
    private discardModalService: DiscardModalService,_configSvc: RuntimeConfigLoaderService
  ) {
    super(_configSvc);
  }

  validationInit() { 
    //console.log(this.cards);
  }

  private notifyEvent() {
    this.notify.emit({
      result: "reload"
    });
  }

  editCard(card: ICreditCard) {
    const modalRef = this.ngbModal.open(AddEditCreditCardComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "modal-dialog-centered"
    });
    modalRef.componentInstance.card = Object.assign({}, card);
    modalRef.result.then(result => {
      if (result != undefined && result.data && result.data == "reload")
        this.notifyEvent();
    });
  }

  setPrimaryCard(card: ICreditCard) {
    this.isDataReady = false;
    this.creditCardService.setPrimaryCreditCard(card).subscribe(data => {
      this.isDataReady = true;
      if (data.IsSuccess) this.notifyEvent();
    });
  }

  deleteCreditCard(card: ICreditCard) {
    let body = "Deleting Credit Card:" + this.creditCardNumberPipe.transform(card.Number);
    let header = "Deleting Credit Card";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);    
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.isDataReady = false;
        this.creditCardService.deleteCreditCard(card.Id).subscribe(data => {
          this.isDataReady = true;
          if (data.IsSuccess) {
            this.notifyEvent();
          }
        });
      }
    });

  }
}

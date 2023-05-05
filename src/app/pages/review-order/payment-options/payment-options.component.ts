import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from '../../../shared/base.class';
import { ICreditCard } from '../../../models/credit-card.model';
import { AddEditCreditCardComponent } from '../../credit-card/add-edit-credit-card/add-edit-credit-card.component';
import { MatDialog } from "@angular/material";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UserDetailsService } from "../../user-details/user-details.service";
import { CreditCardService } from "../../credit-card/credit-card.service";
import { CreditCardNumberPipe } from "../../../filters/creditcard-number.pipe";
import { DiscardModalService } from "../../../shared/discard-modal.service";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MasterDataService } from "../../master/master.data.service";
import { ServerResponse } from '../../../models/server.response.model';
import { IAddress } from "../../../models/address.modal";
import { isNullOrUndefined } from "util";
import { CreditCardCodeValidator, CardNumberValidator, ZipCodeValidator, CharactersOnlyValidator } from "../../../shared/custom-validators";
import * as lengthValiation from '../../../shared/adss.metadata';
import * as adssData from '../../../shared/adss.metadata';
import { IUserDetails } from "../../../models/user-details.model";
import { ReviewOrderService } from "../review-order.service";
import { yearsPopulator } from '../../../shared/common.functions';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'payment-options',
  templateUrl: './payment-options.component.html',
  providers: [DiscardModalService]
})
export class PaymentOptionsComponent extends BaseClass {
  @Input() cards: ICreditCard[];
  @Input() isDataReady: boolean;
  @Input() isOrderLoaded: boolean;
  @Input() isReadOnly: boolean;
  @Input() orderPrice: number;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  userData: IUserDetails = <IUserDetails>{};

  addCardForm: FormGroup;
  card: ICreditCard;
  months: any[];
  years: number[] = [null];
  states: any[];
  isSubmitted: boolean;
  isFormDisabled: boolean;

  selectedCard = new FormControl();
  serverResponse: ServerResponse;
  saveCard = new FormControl();

  constructor(
    public dialog: MatDialog,
    public ngbModal: NgbModal,
    private creditCardService: CreditCardService,
    private userDetailsService: UserDetailsService,
    private creditCardNumberPipe: CreditCardNumberPipe,
    private discardModalService: DiscardModalService,
    private reviewOrderService: ReviewOrderService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private masterDataService: MasterDataService,_configSvc: RuntimeConfigLoaderService
  ) {
    super(_configSvc);
    this.years = yearsPopulator();
    this.months = adssData.months;
  }

  validationInit() {

    // console.log("validationInit");

    this.masterDataService.getSates().subscribe(data => {
      this.states = data;
    });

    if (this.card == undefined) {
      this.card = <ICreditCard>{};
      this.card.Address = <IAddress>{};
    }

    if (this.cards && this.cards.length > 0) {
      this.setDefaultCard();
    }

    this.selectedCard.valueChanges.subscribe(value => {
      this.cardCheckBoxChanged(false);
      this.notify.emit({
        cardChanged: true
      });
      this.setCardDetails(value);
    });

    this.saveCard.valueChanges.subscribe(value => {
      this.reviewOrderService.setSaveCreditCardInfo(value);
    });

  }

  ngOnChanges() {
    if (isNullOrUndefined(this.selectedCard.value) && this.isDataReady && this.isOrderLoaded) {
      this.setDefaultCard();
    }
  }

  setCardDetails(value) {
    // console.log("setCardDetails ", value);
    if (value === "newCard") {
      this.formBuilderFunction();
      this.reviewOrderService.setCardId(null);
    }
    else {
      this.reviewOrderService.setNewCardDetails(null);
      this.reviewOrderService.setCardId(value);
      this.reviewOrderService.setIsPaymentFormValid(true);
    }
  }

  setDefaultCard(orderPriceUpdated?: number) {
    let card;

    this.orderPrice = isNullOrUndefined(orderPriceUpdated) ? this.orderPrice : orderPriceUpdated;

    if (this.cards && this.cards.length > 0) {
      card = this.cards.find(card => card.IsPrimary);

      if (isNullOrUndefined(card))
        card = this.cards[0];

      this.selectedCard.setValue(card.Id);
      this.setCardDetails(card.Id);
    }
    else {
      this.selectedCard.setValue("newCard");
      this.setCardDetails("newCard");
    }
  }

  updateValidity() {

    if (this.selectedCard.value == "newCard") {
      Object.keys(this.addCardForm.controls).forEach(controlName => {
        this.addCardForm.controls[controlName].markAsTouched();
      });
      this.reviewOrderService.setIsPaymentFormValid(this.addCardForm.valid);
    }
  }

  addValueChangesOnForm() {
    this.addCardForm.valueChanges.subscribe((value) => {
      this.updateValuesFromForm();
      this.reviewOrderService.setNewCardDetails(this.card);
      this.reviewOrderService.setIsPaymentFormValid(this.addCardForm.valid);
    });


    this.addCardForm.controls['Number'].valueChanges.subscribe(
      data => {
        if (data.length) {
          if (data.startsWith("4")) {
            this.card.Type = adssData.cardType['Visa'];
            this.card.TypeName = 'Visa';
          }
          else
            if (data.startsWith("51") || data.startsWith("52") || data.startsWith("53") || data.startsWith("54") || data.startsWith("55")) {
              this.card.Type = adssData.cardType['Master card'];
              this.card.TypeName = 'Master card';
            }
            else
              if (data.startsWith("34") || data.startsWith("37")) {
                this.card.Type = adssData.cardType['American express'];
                this.card.TypeName = 'American express';
              }
              else
                if (data.startsWith("65") || data.startsWith("6011")) {
                  this.card.Type = adssData.cardType['Discover'];
                  this.card.TypeName = 'Discover';
                }
                else
                  this.card.Type = 0;
        }
        else
          this.card.Type = 0;
      });
  }

  private notifyEvent() {
    this.notify.emit({
      result: "reload"
    });
  }

  formBuilderFunction() {
    // console.log("this.orderPrice ", this.orderPrice);
    if (this.orderPrice > 0) {
      this.addCardForm = this.formBuilder.group({
        'FirstName': [this.userData.FirstName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.FIRST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
        'LastName': [this.userData.LastName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.LAST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
        'Address1': [this.userData.Address ? this.userData.Address.Address1 : '', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.CARD_ADDRESS1_MAX_LENGTH)])],
        'City': [this.userData.Address ? this.userData.Address.City : '', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.CITY_MAX_LENGTH), CharactersOnlyValidator])],
        'State': [this.userData.Address ? this.userData.Address.State : '', Validators.compose([Validators.required])],
        'Zip': [this.userData.Address ? this.userData.Address.Zip : '', Validators.compose([Validators.required, ZipCodeValidator])],
        'Number': ['', Validators.compose([Validators.required, CardNumberValidator])],
        'SecurityCode': ['', Validators.compose([Validators.required, CreditCardCodeValidator])],
        'ExpirationMonth': ['', Validators.compose([Validators.required])],
        'ExpirationYear': ['', Validators.compose([Validators.required])]
      });

      this.addValueChangesOnForm();

    }
    else {
      this.removeValidators();
    }
  }

  removeValidators() {
    // console.log("removeValidators");
    if (!isNullOrUndefined(this.addCardForm)) {
      this.addCardForm.clearValidators();
      this.reviewOrderService.setIsPaymentFormValid(true);
      this.reviewOrderService.setNewCardDetails(null);
    }
  }


  updateValuesFromForm() {
    if (this.selectedCard.value == "newCard" && this.orderPrice > 0) {
      this.card.FirstName = this.addCardForm.controls['FirstName'].value;
      this.card.LastName = this.addCardForm.controls['LastName'].value;
      this.card.Address.Address1 = this.addCardForm.controls['Address1'].value;
      this.card.Address.City = this.addCardForm.controls['City'].value;
      this.card.Address.State = this.addCardForm.controls['State'].value;
      this.card.Address.Zip = this.addCardForm.controls['Zip'].value;
      this.card.Number = this.addCardForm.controls['Number'].value;
      this.card.SecurityCode = this.addCardForm.controls['SecurityCode'].value;
      this.card.ExpirationMonth = this.addCardForm.controls['ExpirationMonth'].value;
      this.card.ExpirationYear = this.addCardForm.controls['ExpirationYear'].value;
    }
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

  cardCheckBoxChanged(checked) {
    this.userData = checked ? this.reviewOrderService.getUserDetails() : <IUserDetails>{};
    this.reviewOrderService.setCredituserSameAsBuyer(checked);
    this.formBuilderFunction();
    this.updateValuesFromForm();
    this.reviewOrderService.setNewCardDetails(this.card);

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

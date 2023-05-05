import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CreditCardService } from '../credit-card.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as adssData from '../../../shared/adss.metadata';
import { DiscardChangesPopupComponent } from '../../discard-changes-popup/discard-changes-popup.component';
import { BaseClass } from '../../../shared/base.class';
import { ZipCodeValidator, CreditCardCodeValidator, CharactersOnlyValidator, CardNumberValidator } from '../../../shared/custom-validators';
import { yearsPopulator } from '../../../shared/common.functions';
import { MasterDataService } from '../../master/master.data.service';
import { DiscardModalService } from '../../../shared/discard-modal.service';
import * as lengthValiation from '../../../shared/adss.metadata';
import { ICreditCard } from '../../../models/credit-card.model';
import { ServerResponse } from '../../../models/server.response.model';
import { IAddress } from '../../../models/address.modal';
import { isNullOrUndefined } from 'util';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'add-edit-credit-card',
    templateUrl: './add-edit-credit-card.component.html',
    providers: [DiscardModalService]
})
export class AddEditCreditCardComponent extends BaseClass {
    addCardForm: FormGroup;
    card: ICreditCard;
    months: any[];
    years: number[] = [null];
    states: any[];
    isSubmitted: boolean;
    isFormDisabled: boolean;
    public Number = new FormControl();
    serverResponse: ServerResponse;

    constructor(private formBuilder: FormBuilder,
        private creditCardService: CreditCardService,
        private activeModal: NgbActiveModal,
        private ngbModal: NgbModal,
        private masterDataService: MasterDataService,
        private discardModalService: DiscardModalService,_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
        this.isSubmitted = false;
        this.isFormDisabled = false;
        this.months = adssData.months;
        this.years = yearsPopulator();

    }

    validationInit() {
        this.masterDataService.getSates().subscribe(data => {
            this.states = data;
        });
        if (this.card == undefined) {
            this.card = <ICreditCard>{};
            this.card.Address = <IAddress>{};
        }
        this.formBuilderFunction();
        this.addCardForm.controls['Number'].valueChanges.subscribe(
            data => {
                if (data.length) {
                    if (data.startsWith("4"))
                        this.card.Type = adssData.cardType['Visa'];
                    else
                        if (data.startsWith("51") || data.startsWith("52") || data.startsWith("53") || data.startsWith("54") || data.startsWith("55"))
                            this.card.Type = adssData.cardType['Master card'];
                        else
                            if (data.startsWith("34") || data.startsWith("37"))
                                this.card.Type = adssData.cardType['American express'];
                            else
                                if (data.startsWith("65") || data.startsWith("6011"))
                                    this.card.Type = adssData.cardType['Discover'];
                                else
                                    this.card.Type = 0;
                }
                else
                    this.card.Type = 0;
            }
        )
    }

    formBuilderFunction() {
        this.addCardForm = this.formBuilder.group({
            'FirstName': [this.card.FirstName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.FIRST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
            'LastName': [this.card.LastName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.LAST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
            'Address1': [this.card.Address != undefined ? this.card.Address.Address1 : '', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.CARD_ADDRESS1_MAX_LENGTH)])],
            'City': [this.card.Address != undefined ? this.card.Address.City : '', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.CITY_MAX_LENGTH), CharactersOnlyValidator])],
            'State': [this.card.Address != undefined ? this.card.Address.State : '', Validators.compose([Validators.required])],
            'Zip': [this.card.Address != undefined ? this.card.Address.Zip : '', Validators.compose([Validators.required, ZipCodeValidator])],         
            'Number': [this.card.Number, isNullOrUndefined(this.card.Number) ? Validators.compose([Validators.required, CardNumberValidator]) : []],
            'SecurityCode': [this.card.SecurityCode, Validators.compose([Validators.required, CreditCardCodeValidator])],
            'ExpirationMonth': [this.card.ExpirationMonth, Validators.compose([Validators.required])],
            'ExpirationYear': [this.card.ExpirationYear, Validators.compose([Validators.required])],
            'Id': this.card.Id
        });
        
    }

    saveCard() {
        this.isSubmitted = true;
        this.serverResponse = <ServerResponse>{};
        this.card.Address.Address1 = this.addCardForm.controls.Address1.value;
        this.card.FirstName = this.addCardForm.controls.FirstName.value;
        this.card.LastName = this.addCardForm.controls.LastName.value;
        this.card.Address.City = this.addCardForm.controls.City.value;
        this.card.Address.State = this.addCardForm.controls.State.value;
        this.card.Address.Zip = this.addCardForm.controls.Zip.value;
        this.card.Number = this.addCardForm.controls.Number.value;
        this.card.SecurityCode = this.addCardForm.controls.SecurityCode.value;
        this.card.ExpirationMonth = this.addCardForm.controls.ExpirationMonth.value;
        this.card.ExpirationYear = this.addCardForm.controls.ExpirationYear.value;
        if (this.addCardForm.valid) {
            this.isFormDisabled = true;
            if (this.card.Id) {
                this.creditCardService.editCreditCard(this.card).subscribe(data => {
                    this.serverResponse = data;
                    this.isFormDisabled = false;
                    if (data.IsSuccess)
                        this.activeModal.close({ data: 'reload' });
                },
                    (error) => {
                        this.isFormDisabled = false;
                    });
            }
            else {
                this.creditCardService.addCreditCard(this.card).subscribe(data => {
                    this.isFormDisabled = false;
                    this.serverResponse = data;
                    if (data.IsSuccess)
                        this.activeModal.close({ data: 'reload' });
                },
                    (error) => {
                        this.isFormDisabled = false;                       
                    });

            }
        }
    }

    onClose() {
        this.discardModalService.continueOrCancel(this.addCardForm);
    }


}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscardChangesPopupComponent } from '../../discard-changes-popup/discard-changes-popup.component';
import { RegisterService } from '../../register/register.service';
import { BaseClass } from '../../../shared/base.class';
import { ZipCodeValidator, CharactersOnlyValidator } from '../../../shared/custom-validators';
import { UserDetailsService } from '../../user-details/user-details.service';
import { MasterDataService } from '../../master/master.data.service';
import { DiscardModalService } from '../../../shared/discard-modal.service';
import { UserAccountService } from '../useraccount.service';
import * as lengthValiation from '../../../shared/adss.metadata';
import { IBusinessType } from '../../../models/business-type.model';
import { IUserDetails } from '../../../models/user-details.model';
import { ServerResponse } from '../../../models/server.response.model';
import { IAddress } from '../../../models/address.modal';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'edit-account-information',
  templateUrl: './edit-account-information.component.html',
  providers: [DiscardModalService]
})
export class EditAccountInformationComponent extends BaseClass {

  accountInformationForm: FormGroup;
  businessTypes: IBusinessType[];
  userDetails: IUserDetails;
  isSubmitted: boolean;
  isFormDisabled: boolean;
  states: any[];
  serverResponse: ServerResponse;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private registerService: RegisterService,
    private userAccountService: UserAccountService,
    private masterDataService: MasterDataService,
    private discardModalService: DiscardModalService,_configSvc: RuntimeConfigLoaderService
  ) {
    super(_configSvc);
    this.isSubmitted = false;
    this.isFormDisabled = false;
  }

  validationInit() {
    this.masterDataService.getSates().subscribe(data => { this.states = data });
    this.getBusinessTypes();
    if (this.userDetails == undefined)
      this.userDetails = <IUserDetails>{};
    this.createForm();
  }

  createForm() {
    this.accountInformationForm = this.formBuilder.group({
      "firstName": [this.userDetails.FirstName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.FIRST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
      "lastName": [this.userDetails.LastName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.LAST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
      "phoneNumber": [this.userDetails.Phone, Validators.compose([Validators.required, Validators.minLength(lengthValiation.PHONE_NUMBER_MAX_LENGTH), Validators.maxLength(lengthValiation.PHONE_NUMBER_MAX_LENGTH)])],
      "streetAddress": [this.userDetails.Address != undefined ? this.userDetails.Address['Address1'] : '', Validators.maxLength(lengthValiation.EDIT_ACCOUNT_ADDRESS1_MAX_LENGTH)],
      "city": [this.userDetails.Address != undefined ? this.userDetails.Address['City'] : '', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.CITY_MAX_LENGTH), CharactersOnlyValidator])],
      "state": [this.userDetails.Address != undefined ? this.userDetails.Address['State'] : '', Validators.required],
      "zipCode": [this.userDetails.Address != undefined ? this.userDetails.Address['Zip'] : '', Validators.compose([Validators.required, ZipCodeValidator])],
      "businessName": this.userDetails.IsBusinessUser ? [this.userDetails.BusinessName, Validators.required] : '',
      "businessType": this.userDetails.IsBusinessUser ? [this.userDetails.SelectedBusinessTypeValue, Validators.required] : ''
    });
  }

  getBusinessTypes() {
    this.masterDataService.getBusinessTypes()
      .subscribe((data) => {
        this.businessTypes = data;
      });
  }

  submitForm(form) {
    (<any>window)._trackEvent('Dashboard Account Information', 'Edit Account Information Click', 'Edit Account Information', 'Editing Account Information');
    this.isSubmitted = true;
    let editUserDetails = <IUserDetails>{};
    editUserDetails.Address = <IAddress>{};
    editUserDetails.CustomerId = this.userDetails.CustomerId;
    editUserDetails.FirstName = form.firstName;
    editUserDetails.LastName = form.lastName;
    editUserDetails.Phone = form.phoneNumber;
    editUserDetails.Address.Address1 = form.streetAddress;
    editUserDetails.Address.City = form.city;
    editUserDetails.Address.State = form.state;
    editUserDetails.Address.Zip = form.zipCode;
    editUserDetails.BusinessName = form.businessName;
    editUserDetails.SelectedBusinessTypeValue = form.businessType;

    if (this.accountInformationForm.valid) {
      this.isFormDisabled = true;
      this.userAccountService.updateUserDetails(editUserDetails).subscribe(data => {
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

  onClose() {
    this.discardModalService.continueOrCancel(this.accountInformationForm);
  }

}

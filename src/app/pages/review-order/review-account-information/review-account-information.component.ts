import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import {
  ZipCodeValidator,
  EmailValidator,
  CharactersOnlyValidator,
  MatchEmail
} from "../../../shared/custom-validators";
import * as lengthValiation from "../../../shared/adss.metadata";
import { IUserDetails } from "../../../models/user-details.model";
import { ReviewOrderService } from "../review-order.service";
import { IAddress, IGooglePlaceDetailResponse } from "../../../models/address.modal";
import { isNullOrUndefined } from "util";
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from "@angular/material";
import { startWith ,  map } from 'rxjs/operators';
import { IGooglePlaceSearchResponse } from "../../../models/address.modal";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "review-account-information",
  templateUrl: "./review-account-information.component.html",
  styleUrls: ["./review-account-information.component.css"]
})
export class ReviewAccountInformationComponent extends BaseClass {
  @Input() userAccountDetails: IUserDetails;
  @Input() businessTypes: any[];
  @Input() states: any;

  placeCtrl: FormControl = new FormControl();
  googlePlaces: IGooglePlaceSearchResponse[];
  accountInformationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private reviewOrderService: ReviewOrderService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  findGooglePlace(search: any, trigger: MatAutocompleteTrigger) {
    trigger.closePanel();

    if(search.target.value.length > 3) {
      this.reviewOrderService.getGoogleAddressSuggestions(search.target.value).subscribe((data) => {
        if(data && data.length > 0) {
          this.googlePlaces = data;
          trigger.openPanel();
        }
      });
    }
  }

  onSelectingPlace(selected: MatAutocompleteSelectedEvent) {
    var placeId = selected.option.value;
    
    this.reviewOrderService.getGooglePlaceDetail(placeId).subscribe((placeDetailResponse )=> {
        if(placeDetailResponse.StreetNumber && placeDetailResponse.StreetNumber != 'null'){
          this.accountInformationForm.controls['streetAddress'].setValue(placeDetailResponse.StreetNumber + ' ' + placeDetailResponse.StreetName);
        }
        else{
          this.accountInformationForm.controls['streetAddress'].setValue(placeDetailResponse.StreetName);
        }
        this.accountInformationForm.controls['city'].setValue(placeDetailResponse.City);
        this.accountInformationForm.controls['state'].setValue(placeDetailResponse.StateTerritory);
        this.accountInformationForm.controls['zipCode'].setValue(placeDetailResponse.PostalCode);
        
        this.accountInformationForm.updateValueAndValidity();
    });
  }

  getPlaceTextById(placeId: string){
    return this.googlePlaces.find(x => x.place_id === placeId).description;
  }
  
  validationInit() {
    this.createAccountInformationForm();
    this.accountInformationForm.valueChanges.subscribe((value) => {
      this.assignUpdated();
      this.reviewOrderService.setUserDetails(this.userAccountDetails);
      if(this.userAccountDetails.IsAdvertiser && !isNullOrUndefined(this.userAccountDetails.SoldToCustmers) && this.userAccountDetails.SoldToCustmers.length > 0){
      this.reviewOrderService.setSoldToCustomer(this.accountInformationForm.controls['soldToAccount'].value);
      }
      this.reviewOrderService.setIsAccountFormValid(this.accountInformationForm.valid);
    })
  }

  updateValidity() {
    Object.keys(this.accountInformationForm.controls).forEach(controlName => {
      this.accountInformationForm.controls[controlName].markAsTouched();
    });

    this.reviewOrderService.setIsAccountFormValid(this.accountInformationForm.valid);
  }


  createAccountInformationForm() {
    this.accountInformationForm = this.formBuilder.group({
      "firstName": [this.userAccountDetails.FirstName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.FIRST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
      "lastName": [this.userAccountDetails.LastName, Validators.compose([Validators.required, Validators.maxLength(lengthValiation.LAST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
      "phoneNumber": [this.userAccountDetails.Phone, Validators.compose([Validators.required, Validators.minLength(lengthValiation.PHONE_NUMBER_MAX_LENGTH), Validators.maxLength(lengthValiation.PHONE_NUMBER_MAX_LENGTH)])],
      "streetAddress": [this.userAccountDetails.Address  ? this.userAccountDetails.Address['Address1'] : '', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.CARD_ADDRESS1_MAX_LENGTH)])],
      "city": [this.userAccountDetails.Address ? this.userAccountDetails.Address['City'] : '', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.CITY_MAX_LENGTH), CharactersOnlyValidator])],
      "state": [this.userAccountDetails.Address && this.userAccountDetails.Address['State'] ? this.userAccountDetails.Address['State'] : '', Validators.required],
      "zipCode": [this.userAccountDetails.Address ? this.userAccountDetails.Address['Zip'] : '', Validators.compose([Validators.required, ZipCodeValidator])],
      "businessName": [this.userAccountDetails.IsBusinessUser ? this.userAccountDetails.BusinessName : ''],
      "businessType": [this.userAccountDetails.IsBusinessUser ? this.userAccountDetails.SelectedBusinessTypeValue : ''],
      "emailAddress": [
        this.userAccountDetails.AditEmail,
        Validators.compose([Validators.required, EmailValidator])
      ],
      "confirmEmailAddress": [
        this.userAccountDetails.AditEmail,
        Validators.compose([Validators.required, EmailValidator])
      ]
    },
      {
        validator: MatchEmail
      });

    if(this.userAccountDetails.IsBusinessUser) {
      this.accountInformationForm.controls['businessName'].setValidators(Validators.required);
      this.accountInformationForm.controls['businessType'].setValidators(Validators.required);

      this.accountInformationForm.updateValueAndValidity();
    }

    if(this.userAccountDetails.IsAdvertiser && !isNullOrUndefined(this.userAccountDetails.SoldToCustmers) && this.userAccountDetails.SoldToCustmers.length > 0) {
      this.accountInformationForm.addControl("soldToAccount", new FormControl(this.userAccountDetails.SoldToCustmers[0].CustomerID));
      this.reviewOrderService.setSoldToCustomer(this.accountInformationForm.controls['soldToAccount'].value);
    }
  }

  assignUpdated() {
    this.userAccountDetails.FirstName = this.accountInformationForm.controls['firstName'].value;
    this.userAccountDetails.LastName = this.accountInformationForm.controls['lastName'].value;
    this.userAccountDetails.CustomerName = this.userAccountDetails.FirstName + " " + this.userAccountDetails.LastName;
    this.userAccountDetails.Phone = this.accountInformationForm.controls['phoneNumber'].value;
    
    if(this.userAccountDetails.Address === undefined || !this.userAccountDetails)
    {
      this.userAccountDetails.Address = {} as IAddress;
    }
    
    this.userAccountDetails.Address.Address1 = this.accountInformationForm.controls['streetAddress'].value;
    this.userAccountDetails.Address.City = this.accountInformationForm.controls['city'].value;
    this.userAccountDetails.Address.State = this.accountInformationForm.controls['state'].value;
    this.userAccountDetails.Address.Zip = this.accountInformationForm.controls['zipCode'].value;
    this.userAccountDetails.BusinessName = this.accountInformationForm.controls['businessName'].value;
        
    this.userAccountDetails.BusinessType = this.businessTypes.find((businessType: { SubcategoryCode: any; }) => this.accountInformationForm.controls['businessType'].value == businessType.SubcategoryCode);
    
    this.userAccountDetails.AditEmail = this.accountInformationForm.controls['emailAddress'].value;
    this.userAccountDetails.ConfirmEmail = this.accountInformationForm.controls['confirmEmailAddress'].value;
  }
}

import {OnInit} from "@angular/core";
// import { environment } from "../../environments/environment";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import * as validationMessages from './validation-messages';
import * as validationLength from './adss.metadata';

export abstract class BaseClass implements OnInit{

    emailRequiredMessage: string;
    emailInvalidMessage: string;
    emailExistsMessage: string;
    passwordRequiredMessage: string;
    passwordInvalidMessage: string;
    passwordHintMessage: string;
    usernameRequiredMessage: string;
    usernameInvalidLengthMessage: string;
    usernameHintMessage: string;
    firstNameRequiredMessage: string;
    lastNameRequiredMessage: string;
    zipcodeRequiredMessage: string;
    zipcodeInvalidMessage: string;
    termsAndPolicyMessage: string;
    businessNameRequiredMessage: string;
    businessTypeRequiredMessage: string;
    firstNameMaxLengthMessage: string;
    lastNameMaxLengthMessage: string;
    invalidFirstNameMessage :string;
    invalidLastNameMessage :string;
    invalidUsernameMessage: string;

    invalidCityMessage: string;
    cityMaxLengthMessage: string;
    phoneNumberRequiredMessage: string;
    phoneNumberInvalidMessage: string;
    cityRequiredMessage: string;
    zipCodeRequiredMessage: string;
    zipCodeInvalidMessage: string;
    streetAddressRequiredMeesage: string;

    cardFirstNameRequiredMessage: string;
    cardLastNameRequiredMessage: string;
    addressRequiredMessage: string;
    cardCityRequiredMessage: string;
    stateRequiredMessage: string;
    cardZipcodeRequiredMessage: string;
    cardZipcodeInvalidMessage: string;
    cardNumberRequiredMessage: string;
    cardNumberInvalidMessage: string;
    addressMaxLengthMessage: string;
    codeRequiredMessage: string;
    codeInvalidMessage: string;
    monthRequiredMessage: string;
    yearRequiredMessage: string;
    codeOnReviewRequiredMessage: string;

    oldPasswordRequiredMessage: string;
    newPasswordRequiredMessage: string;
    confirmPasswordRequiredMessage: string;
    newPasswordHintMessage: string;
    matchPasswordMessage : string;

    zipCodeMaxLength : number;
    cardCodeMaxLength : number;
    cardNumberMaxLength : number;
    phoneNumberMaxLength : number;

    readOnlyMessage : string;

    campaignNameMessage: string;
    clickThroughUrlRequiredMessage : string;
    clickThroughUrlInvalid: string;
    assetsHostUrl: string;
    imagesUrl: string;
    productsUrl: string;
    logoUrl: string;
    templateUrl: string;
    templateSample: string;
    pageSize: number;
    
    emailUnmatchedMessage: string;
    projectName: string;
    invalidImpressionsMessage: string;
    _configSvc :RuntimeConfigLoaderService;
    
    constructor(       
       configSvc: RuntimeConfigLoaderService
      ) {
this._configSvc = configSvc;
  }

    
  

  ngOnInit() {
    
    this.assetsHostUrl = this._configSvc.getConfigObjectKey("assetsHost");
    this.imagesUrl = this._configSvc.getConfigObjectKey("imagesUrl");
    this.productsUrl = this._configSvc.getConfigObjectKey("assetsHost") + this._configSvc.getConfigObjectKey("imagesUrl") + this._configSvc.getConfigObjectKey("productsUrl");
    this.logoUrl = this._configSvc.getConfigObjectKey("logoUrl");
    this.templateUrl = this._configSvc.getConfigObjectKey("assetsHost") + this._configSvc.getConfigObjectKey("imagesUrl") +  this._configSvc.getConfigObjectKey("templateUrl");
    this.templateSample = this._configSvc.getConfigObjectKey("templateSample");
    this.pageSize = this._configSvc.getConfigObjectKey("pageSize");
    this.validationInit();
    this.assignMessages();
  }

  getRequiredMessage(field) {
    // console.log(field);
    return "The " + field + " field is Required.";
  }

  assignMessages() {
    // messages for register page
    this.emailRequiredMessage = validationMessages.EMAIL_REQUIRED_MESSAGE;
    this.emailInvalidMessage = validationMessages.INVALID_EMAIL_Address;
    this.emailExistsMessage = validationMessages.EMAIL_EXISTS;
    this.passwordInvalidMessage = validationMessages.INVALID_PASSWORD;
    this.passwordRequiredMessage = validationMessages.PASSWORD_REQUIRED_MESSAGE;
    this.passwordHintMessage = validationMessages.PASSWORD_HINT_MESSAGE;
    this.usernameInvalidLengthMessage = validationMessages.INVALID_LENGTH_USERNAME;
    this.usernameRequiredMessage = validationMessages.USERNAME_REQUIRED_MESSAGE;
    this.usernameHintMessage = validationMessages.USERNAME_HINT_MESSAGE;
    this.firstNameRequiredMessage = validationMessages.FIRST_NAME_REQUIRED_MESSAGE;
    this.lastNameRequiredMessage = validationMessages.LAST_NAME_REQUIRED_MESSAGE;
    this.zipcodeInvalidMessage = validationMessages.INVALID_ZIPCODE_MESSAGE;
    this.zipcodeRequiredMessage = validationMessages.ZIPCODE_REQUIRED_MESSAGE;
    this.termsAndPolicyMessage = validationMessages.TERMS_AND_POLICY_MESSAGE;
    this.businessNameRequiredMessage = validationMessages.BUSINESS_NAME_REQUIRED_MESSAGE;
    this.businessTypeRequiredMessage = validationMessages.BUSINESS_TYPE_REQUIRED_MESSAGE;
    this.firstNameMaxLengthMessage = validationMessages.FIRST_NAME_MAX_LENGTH_MESSAGE;
    this.lastNameMaxLengthMessage = validationMessages.LAST_NAME_MAX_LENGTH_MESSAGE;
    this.invalidFirstNameMessage = validationMessages.INVALID_FIRST_NAME_MESSAGE;
    this.invalidLastNameMessage = validationMessages.INVALID_LAST_NAME_MESSAGE;
    
    // messages for account info page
    this.phoneNumberRequiredMessage = validationMessages.PHONE_NUMBER_REQUIRED_MESSAGE;
    this.phoneNumberInvalidMessage = validationMessages.PHONE_NUMBER_INVALID_MESSAGE;
    this.cityRequiredMessage = validationMessages.REQUIRED_CITY_MESSAGE;
    this.zipCodeRequiredMessage = validationMessages.ZIPCODE_REQUIRED_MESSAGE;
    this.zipCodeInvalidMessage = validationMessages.EDIT_ACCOUNT_INVALID_ZIPCODE_MESSAGE;
    this.invalidCityMessage = validationMessages.INVLALID_CITY_MESSAGE;
    this.cityMaxLengthMessage = validationMessages.CITY_NAME_MAX_LENGTH_MESSAGE;
    //reviewOrder
    this.streetAddressRequiredMeesage = validationMessages.STREET_ADDRESS_REQUIRED_MESSAGE

    //message for credit card page
    this.cardFirstNameRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_FIRST_NAME_MESSAGE;
    this.cardLastNameRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_LAST_NAME_MESSAGE;
    this.addressRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_ADDRESS_MESSAGE;
    this.cardCityRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_CITY_MESSAGE;
    this.stateRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_STATE_MESSAGE;
    this.cardZipcodeRequiredMessage = validationMessages.ZIPCODE_REQUIRED_MESSAGE;
    this.cardZipcodeInvalidMessage = validationMessages.CREDIT_CARD_INVALID_ZIPCODE_MESSAGE;
    this.cardNumberRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_CARD_NUMBER_MESSAGE;
    this.cardNumberInvalidMessage = validationMessages.CREDIT_CARD_INVALID_CARD_NUMBER_MESSAGE;
    this.codeRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_CODE_MESSAGE;
    this.codeInvalidMessage = validationMessages.CREDIT_CARD_INVALID_CODE_MESSAGE;
    this.monthRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_MONTH_MESSAGE;
    this.yearRequiredMessage = validationMessages.CREDIT_CARD_REQUIRED_YEAR_MESSAGE;
    this.addressMaxLengthMessage = validationMessages.ADDRESS_MAX_LENGTH_MESSAGE;
    this.codeOnReviewRequiredMessage = validationMessages.CREDIT_CARD_INVALID_CODE_MESSAGE_ON_REVIEW;


    // messages for change password page
    this.oldPasswordRequiredMessage = validationMessages.OLD_PASSWORD_REQUIRED_MESSAGE;
    this.newPasswordHintMessage = validationMessages.NEW_PASSWORD_HINT_MESSAGE;
    this.newPasswordRequiredMessage = validationMessages.NEW_PASSWORD_REQUIRED_MESSAGE;
    this.confirmPasswordRequiredMessage = validationMessages.CONFIRM_PASSWORD_REQUIRED_MESSAGE;
    this.matchPasswordMessage = validationMessages.MATCH_PASSWORD_MESSAGE;

    this.zipCodeMaxLength = validationLength.ZIP_CODE_MAX_LENGTH;
    this.cardCodeMaxLength = validationLength.CARD_CODE_MAX_LENGTH;
    this.phoneNumberMaxLength = validationLength.PHONE_NUMBER_MAX_LENGTH;
    this.cardNumberMaxLength = validationLength.CARD_NUMBER_MAX_LENGTH;

    //read only message
    this.readOnlyMessage = validationMessages.READ_ONLY_MESSAGE;

    //message for campaign name
    this.campaignNameMessage = validationMessages.CAMPAIGN_NAME_REQUIRED_MESSAGE;

    this.clickThroughUrlRequiredMessage = validationMessages.CLICK_THROUGH_URL_REQUIRED_MESSAGE;
    this.clickThroughUrlInvalid = validationMessages.CLICK_THROUGH_URL_INVALID_MESSAGE;

    this.projectName = validationMessages.PROJECT_NAME_MAX_LENGTH_MESSAGE;
    this.emailUnmatchedMessage = validationMessages.EMAILS_UNMATCHED_MESSAGE;
     //message for inventory
     this.invalidImpressionsMessage = validationMessages.NUM_IMPRESSION_REQUIRED_MESSAGE;
  }

  abstract validationInit() : void ;
}
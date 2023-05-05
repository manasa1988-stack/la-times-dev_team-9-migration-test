import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminBaseClass } from "../../shared/admin-base.class";
import { ZipCodeValidator, PasswordValidator, CharactersOnlyValidator, EmailValidator } from '../../../app/shared/custom-validators';
import { DiscardChangesPopupComponent } from '../../../app/pages/discard-changes-popup/discard-changes-popup.component';
import { Router } from '@angular/router';
import { MarketSettingsService } from '../market-settings.service';
import { IMarketSettings } from '../../../app/models/market-settings.model';
import { ServerResponse } from '../../models/server.response.model';
import { isNullOrUndefined } from 'util';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'add-new-market-settings',
    templateUrl: './add-new-market-settings.component.html',
})
export class AddNewMarketSettingsComponent extends AdminBaseClass {

    addMarketSettingForm: FormGroup;
    isSubmitted: boolean;
    isFormDisabled: boolean = false;
    serverResponse: ServerResponse;
    marketSettings: IMarketSettings;

    constructor(
        private formBuilder: FormBuilder,
        public activeModal: NgbActiveModal,
        private marketSettingsService: MarketSettingsService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
        this.isSubmitted = false;        
    }

    validationInit() {
        this.addMarketSettingFormBuilder();        
    }

    private addMarketSettingFormBuilder() {
        this.addMarketSettingForm = this.formBuilder.group({
            'SiteName': [this.marketSettings ? this.marketSettings.SiteName : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'MarketName': [this.marketSettings ? this.marketSettings.MarketName : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'Domain': [this.marketSettings ? this.marketSettings.Domain : '', Validators.compose([Validators.required])],
            'Code': [this.marketSettings ? this.marketSettings.Code : '', Validators.compose([Validators.required, Validators.maxLength(5)])],
            'LegalName': [this.marketSettings ? this.marketSettings.LegalName : '', Validators.compose([Validators.required, Validators.maxLength(250)])],
            'DepartmentName': [this.marketSettings ? this.marketSettings.DepartmentName : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'HostName': [this.marketSettings ? this.marketSettings.HostName : '', Validators.compose([Validators.required])],
            'Phone': [this.marketSettings ? this.marketSettings.Phone : '', Validators.compose([Validators.required, Validators.maxLength(50)])],
            'CustomerSupportEmail': [this.marketSettings ? this.marketSettings.CustomerSupportEmail : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'HoursOfOperation': [this.marketSettings ? this.marketSettings.HoursOfOperation : '', Validators.compose([Validators.required, Validators.maxLength(250)])],
            'TimeZone': [this.marketSettings ? this.marketSettings.TimeZone : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'TermsOfServiceUrl': [this.marketSettings ? this.marketSettings.TermsOfServiceUrl : '', Validators.compose([Validators.required])],
            'PrivacyPolicyUrl': [this.marketSettings ? this.marketSettings.PrivacyPolicyUrl : '', Validators.compose([Validators.required])],
            'TermsAndConditionsUrl': [this.marketSettings ? this.marketSettings.TermsAndConditionsUrl : '', Validators.compose([Validators.required])],
            'AxsalespersonCode': [this.marketSettings ? this.marketSettings.AxsalespersonCode : '', Validators.compose([Validators.required, Validators.maxLength(50)])],
            'AxsalespersonLastName': [this.marketSettings ? this.marketSettings.AxsalespersonLastName : '', Validators.compose([Validators.required, Validators.maxLength(50)])],
            'SsorHostname': [this.marketSettings ? this.marketSettings.SsorHostName : '', Validators.compose([Validators.required])],
            'SsorProductCode': [this.marketSettings ? this.marketSettings.SsorProductCode : '', Validators.compose([Validators.required, Validators.maxLength(50)])],
            'SsorSignonserver': [this.marketSettings ? this.marketSettings.SsorSignonServer : '', Validators.compose([Validators.required])],
            'SsorMarketName': [this.marketSettings ? this.marketSettings.SsorMarketName : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'SsorBrandingSiteName': [this.marketSettings ? this.marketSettings.SsorBrandingSiteName : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'EmailReplyAddress': [this.marketSettings ? this.marketSettings.EmailReplyAddress : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
            'OmnitureSiteName': [this.marketSettings ? this.marketSettings.OmnitureSiteName : '', Validators.compose([Validators.required, Validators.maxLength(50)])],
            'GoogleAnalyticsAccountName': [this.marketSettings ? this.marketSettings.GoogleAnalyticsAccountName : '', Validators.compose([Validators.required, Validators.maxLength(50)])],
            'Id': [this.marketSettings ? this.marketSettings.Id : '', Validators.compose([Validators.required])],
            'ParentCode': [this.marketSettings ? this.marketSettings.ParentCode : '', Validators.compose([Validators.maxLength(5)])],      /* nr */
            'CommunityCode': [this.marketSettings ? this.marketSettings.CommunityCode : '', Validators.compose([Validators.maxLength(5)])],      /* nr */
            'CommunitySectionId': [this.marketSettings ? this.marketSettings.CommunitySectionId : '', Validators.compose([Validators.maxLength(250)])],      /* nr */
            'EmployeeId': [this.marketSettings ? this.marketSettings.EmployeeId : '', Validators.compose([Validators.maxLength(100)])],    /* nr */
            'EmplId': [this.marketSettings ? this.marketSettings.EmplId : '', Validators.compose([Validators.maxLength(100)])],        /* nr */
            'EmailBccaddress': this.marketSettings ? this.marketSettings.EmailBccaddress : '',      /* nr */
            'OpenOfficeDocumentExtension': this.marketSettings ? this.marketSettings.OpenOfficeDocumentExtension : '',   /* nr */
            'HideLinesForSectionIds': this.marketSettings ? this.marketSettings.HideLinesForSectionIds : '',          /* nr */
            'AllowAttributeTextUpdates': this.marketSettings ? this.marketSettings.AllowAttributeTextUpdates : '',  /* nr */
            'CheetahMailAid': [this.marketSettings ? this.marketSettings.CheetahMailAid : '', Validators.compose([Validators.required])],
            'CheetahMailEidSaveDraftExpiration': [this.marketSettings ? this.marketSettings.CheetahMailEidSaveDraftExpiration : '', Validators.compose([Validators.required])],
            'CheetahMailEidSaveDraftConfirmation': [this.marketSettings ? this.marketSettings.CheetahMailEidSaveDraftConfirmation : '', Validators.compose([Validators.required])],
            'CheetahMailEidBillingInformationUpdatedConfirmation': [this.marketSettings ? this.marketSettings.CheetahMailEidBillingInformationUpdatedConfirmation : '', Validators.compose([Validators.required])],
            'CheetahMailEidPurchaseConfirmation': [this.marketSettings ? this.marketSettings.CheetahMailEidPurchaseConfirmation : '', Validators.compose([Validators.required])],
            'CheetahMailEidAccountUpdatedConfirmation': [this.marketSettings ? this.marketSettings.CheetahMailEidAccountUpdatedConfirmation : '', Validators.compose([Validators.required])],
            'CheetahMailEidOrderChangeConfirmation': [this.marketSettings ? this.marketSettings.CheetahMailEidOrderChangeConfirmation : '', Validators.compose([Validators.required])],
            'CheetahMailEidSavedDraftReminderMarketing': [this.marketSettings ? this.marketSettings.CheetahMailEidSavedDraftReminderMarketing : '', Validators.compose([Validators.required])],
            'CheetahMailEidEndOfCampaignMarketing': [this.marketSettings ? this.marketSettings.CheetahMailEidEndOfCampaignMarketing : '', Validators.compose([Validators.required])],
            'CheetahMailEidLapsedCustomerMarketing': [this.marketSettings ? this.marketSettings.CheetahMailEidLapsedCustomerMarketing : '', Validators.compose([Validators.required])],
            'EpsilonEmailAccountUpdateConfirmation': this.marketSettings ? this.marketSettings.EmailSubjectAccountUpdatedConfirmation : '',
            'EpsilonEmailBillingInformationUpdateConfirmation': this.marketSettings ? this.marketSettings.EmailSubjectBillingInformationUpdatedConfirmation : '',
            'EpsilonEmailOrderChangeConfirmation': this.marketSettings ? this.marketSettings.EmailSubjectOrderChangeConfirmation : '',
            'EpsilonEmailPurchaseConfirmation': this.marketSettings ? this.marketSettings.EmailSubjectPurchaseConfirmation : '',
            'EpsilonEmailSaveDraftConfirmation': this.marketSettings ? this.marketSettings.EmailSubjectSaveDraftConfirmation : '',
            'EpsilonEmailSaveDraftExpiration': this.marketSettings ? this.marketSettings.EmailSubjectSaveDraftExpiration : '',
        });
    }

    addMarketSetting() {
        this.isSubmitted = true;
        let localMarketSettings: IMarketSettings;
        if (this.addMarketSettingForm.valid) {
            localMarketSettings = { ...this.marketSettings, ...this.addMarketSettingForm.value }
            this.marketSettings ?
                this.marketSettingsService.putMarketSettings(localMarketSettings).subscribe((response:any) => {
                    this.serverResponse= response;
                    if (response.IsSuccess) {
                        this.activeModal.close({ data: response.Result, typeOfCall: 'put' })
                    }
                })
                : this.marketSettingsService.postMarketSettings(localMarketSettings).subscribe((response:any) => {
                    this.serverResponse = response;
                    if (response.IsSuccess) {
                        this.activeModal.close({ data: response.Result, typeOfCall: 'post' })
                    }
                })
        }
    }

}

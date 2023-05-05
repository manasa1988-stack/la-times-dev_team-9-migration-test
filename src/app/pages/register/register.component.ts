import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterService } from './register.service';
import { BaseClass } from '../../shared/base.class';
import { DiscardChangesPopupComponent } from '../discard-changes-popup/discard-changes-popup.component';
import { ZipCodeValidator, PasswordValidator, CharactersOnlyValidator, EmailValidator } from '../../shared/custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../shared/storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { MasterDataService } from '../master/master.data.service';
import * as lengthValiation from '../../shared/adss.metadata';
import { IBusinessType } from '../../models/business-type.model';
import { ServerResponse } from '../../models/server.response.model';
import { IMarketSettings } from '../../models/market-settings.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1, display: 'block' })),
      state('false', style({ opacity: '0', display: 'none' })),
      transition('0 => 1', animate('.75s')),
      transition('1 => 0', animate('.75s'))
    ])
  ]
})


export class RegisterComponent extends BaseClass implements OnInit {

  showPassword: boolean;
  showBusiness: boolean;
  isSubmitted: boolean;
  userNameSuggestion: any;
  registerForm: FormGroup;
  businessTypes: IBusinessType[];
  hideShowAnimator: boolean = false;
  isFormDisabled: boolean = false;

  marketSettings: IMarketSettings = <IMarketSettings>{};

  serverResponse: ServerResponse;

  constructor(private formBuilder: FormBuilder,
    private registerService: RegisterService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private route:ActivatedRoute,
    private storageService: StorageService,
    private masterDataService: MasterDataService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.showPassword = false;
    this.showBusiness = false;
    this.isSubmitted = false;
    this.registrationFormBuilder();
    (<any>window)._trackPage('ADSS - Login', this.route.snapshot.url);
  }

  validationInit() {
    this.getBusinessTypes();
    this.detectFormChanges();
    this.getMarketSettings();
  }

  private getMarketSettings() {
    this.marketSettings = this.storageService.getHOST();
  }

  private registrationFormBuilder() {
    this.registerForm = this.formBuilder.group({
      'FirstName': ['', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.FIRST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
      'LastName': ['', Validators.compose([Validators.required, Validators.maxLength(lengthValiation.LAST_NAME_MAX_LENGTH), CharactersOnlyValidator])],
      'Email': ['', Validators.compose([Validators.required, EmailValidator])],
      'Password': ['', Validators.compose([Validators.required, PasswordValidator])],
      'ZipCode': ['', Validators.compose([Validators.required, ZipCodeValidator])],
      'IsTermsAccepted': [null, Validators.required],
      'IsMarketingOptOut': false,
      'IsBusinessUser': false,
      'BusinessName': '',
      'SelectedBusinessTypeId': '',
    });
  }

  private detectFormChanges() {
    this.registerForm.controls.IsBusinessUser.valueChanges.subscribe(data => {
      if (this.registerForm.controls.IsBusinessUser.value) {
        this.registerForm.controls.BusinessName.setValidators(Validators.required);
        this.registerForm.controls.BusinessName.updateValueAndValidity();
        this.registerForm.controls.SelectedBusinessTypeId.setValidators(Validators.required);
        this.registerForm.controls.SelectedBusinessTypeId.updateValueAndValidity();
      } else {
        this.registerForm.controls.BusinessName.clearValidators();
        this.registerForm.controls.SelectedBusinessTypeId.clearValidators();
        this.registerForm.controls.BusinessName.updateValueAndValidity();
        this.registerForm.controls.SelectedBusinessTypeId.updateValueAndValidity();
      }
    });

  }

  getBusinessTypes() {
    this.masterDataService.getBusinessTypes()
      .subscribe((data) => {
        this.businessTypes = data;
      })
  }

  

  registerUser() {
    (<any>window)._trackEvent('ADSS - Login', 'Click', 'New User Click', 'New User Click');
    this.isSubmitted = true;
    this.serverResponse = <ServerResponse>{};
    /* --Code for Email Exists message display--
    this.registerForm.controls["Email"].updateValueAndValidity();*/
    this.registerForm.controls.SelectedBusinessTypeId.markAsUntouched();
    if(this.hideShowAnimator){
      this.registerForm.controls.SelectedBusinessTypeId.markAsTouched();
    }
    if (this.registerForm.valid) {
      this.isFormDisabled = true;
      if (this.registerForm.controls.SelectedBusinessTypeId.value == "")
        this.registerForm.controls.SelectedBusinessTypeId.setValue(0);
      this.registerService.registerUser(this.registerForm)
        .subscribe((data:any) => {
          this.serverResponse = data;
          if (data.IsSuccess) {
            this.activeModal.close();
            window.location.reload();
            //   this.router.navigate['/dashboard'];
          }
          else {
            this.registerForm.controls.Password.setValue(null);
            /* --Code for Email Exists message display-- */
            let field = this.serverResponse.ErrorMessage[0];
            this.registerForm.controls[field.Key].setErrors({
              "serverError": field.Value
            });
          }
          this.isFormDisabled = false;
        },
          error => {
            this.registerForm.controls.Password.setValue(null);
            this.isFormDisabled = false;
          });
    }
  }

  onChangeBusinessValue(event, form) {
    this.showBusiness = event.checked;
    this.hideShowAnimator = !this.hideShowAnimator;
    if(this.hideShowAnimator && this.isSubmitted)
    {
      this.registerForm.controls.SelectedBusinessTypeId.markAsTouched();
    } 
  }

}

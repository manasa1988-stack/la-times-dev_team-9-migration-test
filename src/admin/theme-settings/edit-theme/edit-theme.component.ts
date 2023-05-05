import { Component, OnInit } from '@angular/core';
import { AdminBaseClass } from "../../shared/admin-base.class";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ITheme } from '../../models/setting.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeSettingsService } from '../theme-settings.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'edit-theme',
  templateUrl: './edit-theme.component.html',
  styleUrls: ['./edit-theme.component.css']
})
export class EditThemeComponent extends AdminBaseClass {

  themeSetting: FormGroup;
  passedTheme: ITheme;
  activeModal: NgbActiveModal;

  constructor(private formBuilder: FormBuilder, private am: NgbActiveModal, private themeSettingsService: ThemeSettingsService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.activeModal = am;
  }

  validationInit() {
    this.formBuilderFunction();
  }

  saveTheme() {
    if (this.themeSetting.valid) {
      let theme: ITheme;
      theme = this.themeSetting.value;
      theme.Id = this.passedTheme.Id;
      this.passedTheme.Id == undefined ?
        this.themeSettingsService.postThemeSetting(theme).subscribe(response => {
          if (response.IsSuccess) {
            this.activeModal.close({ data: response.Result });
          }
          else {
            let field = response.ErrorMessage[0];
            this.themeSetting.controls[field.Key].setErrors({
              "serverError": field.Value
            });
          }
        })
        : this.themeSettingsService.putThemeSetting(theme).subscribe(response => {
          if (response.IsSuccess) {
            this.activeModal.close({ data: response.Result });
          }
        })
    } else {
      this.markFormGroupTouched(this.themeSetting);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  formBuilderFunction() {
    this.themeSetting = this.formBuilder.group({
      'MarketName': [this.passedTheme.MarketName, Validators.compose([Validators.required])],
      'BUCode': [this.passedTheme.BUCode, Validators.compose([Validators.required])],
      'CommunityCode': [this.passedTheme.CommunityCode],
      'ThemeUrl': [this.passedTheme.ThemeUrl, Validators.compose([Validators.required])],
      'HostName': [this.passedTheme.HostName, Validators.compose([Validators.required])],
      'UsageAnalyticsCode': [this.passedTheme.UsageAnalyticsCode],
      'IsSecuredTheme': [this.passedTheme.IsSecuredTheme || false],
      'IsLegacyTheme': [this.passedTheme.IsLegacyTheme || false]
    });
  }

}

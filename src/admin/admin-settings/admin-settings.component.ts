import { Component } from '@angular/core';
import { AdminBaseClass } from "../shared/admin-base.class";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ISetting } from '../models/setting.model';
import { AdminSettingsService } from './admin-settings.service';
import { DiscardModalService } from '../../app/shared/discard-modal.service';
import * as _ from 'lodash';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'admin-settings',
  templateUrl: './admin-settings.component.html',
  providers: [DiscardModalService]
})

export class AdminSettingsComponent extends AdminBaseClass {

  settingArray: ISetting[] = [];
  isDataReady: boolean = false;
  showError: boolean = false;
  errorMessage: string = ""
  intCSVRegex = new RegExp(/^((\d+)(,\d+)*)?$/);    //^((\w+)(,\w+)*)?$
  displayError: boolean = false;
  adminSettingsFormGroup: FormGroup;
  errorMsg = [];

  constructor(private adminSettingsService: AdminSettingsService,
    private discardModalService: DiscardModalService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.getAdminSettings();
  }

  getAdminSettings() {
    this.adminSettingsService.getAdminSettings().subscribe(response => {
      this.settingArray = Object.values(response.Result.Settings).map((setting: ISetting) => {
        return {
          ...setting, Type: (setting.Value.toLowerCase().includes('true') || setting.Value.toLowerCase().includes('false')) ? 'boolean' : 'text', ShowError: false, UpdatedJustNow: false, OldValue: setting.Value, NoChangesDetected: false
        }
      });
      this.adminSettingsFormGroup = this.toFormGroup();
      this.isDataReady = true;
    },
      (err) => {
        this.isDataReady = true;
        this.displayError = true;
      }
    );
  }

  private toFormGroup() {
    let group: any = {};
    this.settingArray.forEach((setting) => {
      group[setting.Key] = setting.Type == 'text' ? new FormControl({ value: setting.Value, disabled: true }) : setting.Type == 'boolean' ? new FormControl(setting.Value.toLowerCase().includes('true')) : new FormControl(setting.Value);
    });
    return new FormGroup(group);
  }

  saveBooleanSetting(setting: ISetting, index: number) {
    this.discardModalService.confirmationModal("Are you sure you want to change the " + this.settingArray[index].Key + " setting?").then((res: boolean) => {
      if (res) {
        this.settingArray[index].Value = this.adminSettingsFormGroup.controls[setting.Key].value ? 'true' : 'false';
        this.updateAdminSettings(this.settingArray[index], index);
      }
      else
        this.adminSettingsFormGroup.controls[setting.Key].setValue(this.settingArray[index].Value == 'true' ? true : false);
    })
  }

  saveTextFieldSetting(setting: ISetting, index: number) {
    this.settingArray[index].ShowError = false;
    this.settingArray[index].NoChangesDetected = false;
       
    if (this.settingArray[index].OldValue == this.adminSettingsFormGroup.controls[setting.Key].value) {
      this.errorMsg = [];
      this.errorMsg.push("No changes detected.")
      // this.errorMessage = "No changes detected.";
      this.settingArray[index].ShowError = true;
      this.settingArray[index].NoChangesDetected = true;
    }
    else {
      if (this.validateCSVSettingValues(this.adminSettingsFormGroup.controls[setting.Key].value, index, setting.Key)) {
        this.settingArray[index].Value = this.adminSettingsFormGroup.controls[setting.Key].value;
        // this.settingArray[index].ShowError = false;
        if (this.settingArray[index].Value == '') {
          this.discardModalService.confirmationModal("Are you sure you want to clear all value(s) for " + this.settingArray[index].Key + "?").then((res: boolean) => {
            if (res) {
              this.updateAdminSettings(this.settingArray[index], index);
            }
          })
        }
        else {
          this.updateAdminSettings(this.settingArray[index], index);
        }
      }
      else {
        this.settingArray[index].ShowError = true;

      }
    }
  }

  updateAdminSettings(setting: ISetting, index) {
    this.adminSettingsService.updateAdminSettings(setting).subscribe((data:any) => {
      if (data.IsSuccess) {
        this.settingArray[index].UpdateDate = data.Result.UpdateDate;
        this.settingArray[index].Value = data.Result.Value;
        this.settingArray[index].OldValue = data.Result.Value;
        this.settingArray[index].UpdatedJustNow = true;
        if (setting.Type == 'text')
          this.adminSettingsFormGroup.controls[setting.Key].disable();
      }
    }
    );
  }

  cancelChanges(setting: ISetting, index: number) {
    this.adminSettingsFormGroup.controls[setting.Key].disable();
    this.adminSettingsFormGroup.controls[setting.Key].setValue(this.settingArray[index].OldValue);
    this.settingArray[index].ShowError = false;
    this.settingArray[index].NoChangesDetected = false;
  }

  private validateCSVSettingValues(value, index, key) {
    let isValid = true;
    this.errorMsg = [];
    if (value) {
      let valueArray = value.split(',');
      for (let i = 0; i < valueArray.length; i++) {
        let element = valueArray[i];
        if (!element) {
          if (i == valueArray.length - 1) {
            this.errorMsg.push("Comma at the end");
          }
          else {
            this.errorMsg.push("Empty element(,,) before " + valueArray[i + 1]);
          }
          isValid = false;
        }
        else if (element.indexOf('\n') >= 0) {
          if (i == valueArray.length - 1) {
            this.errorMsg.push("Enter/Linebreak at the end");
          }
          else {
            this.errorMsg.push("Enter/Linebreak at " + valueArray[i]);
          }
          isValid = false;
        }
        else if (!/^[a-zA-Z0-9_.-]+$/.test(element)) {
          isValid = false;
          this.errorMsg.push(element);
        }
        if (key.toLowerCase().indexOf('ids') != -1) {
          if (isNaN(Number(element)) || (!/[^\s]+/.test(element) && element)) {
            isValid = false;
            if (this.errorMsg.indexOf(element) == -1) {
              this.errorMsg.push(element);
            }
          }
        }
      }
    }
    return isValid;
  };

}


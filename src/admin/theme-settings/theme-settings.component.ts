import { Component, OnInit } from '@angular/core';
import { AdminBaseClass } from "../shared/admin-base.class";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITheme } from '../models/setting.model';
import { ThemeSettingsService } from './theme-settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditThemeComponent } from './edit-theme/edit-theme.component';
import { DiscardModalService } from '../../app/shared/discard-modal.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'theme-settings',
  templateUrl: './theme-settings.component.html',
})

export class ThemeSettingsComponent extends AdminBaseClass {

  themeSettingsListData: ITheme[];
  isDataReady: boolean = false;

  constructor(private themeSettingService: ThemeSettingsService, private modalService: NgbModal,
    private discardModalService: DiscardModalService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.getThemes();
  }

  editTheme(theme: ITheme) {
    //this.themeSettingService.getThemeSetting(theme.Id).subscribe(theme => {
      const modalRef = this.modalService.open(EditThemeComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
      modalRef.componentInstance.passedTheme = theme;
      modalRef.result.then(result => {
        if (result.data) {
          this.themeSettingsListData = this.themeFindAndReplace(result.data);
        }
      })
    //});
  }

  addTheme() {
    const modalRef = this.modalService.open(EditThemeComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.passedTheme = <ITheme>{};
    modalRef.result.then(result => {
      if (result.data) {
        this.themeSettingsListData = [...this.themeSettingsListData, result.data];
      }
    })
  }

  generateLayout() {
    window.open('/hangfire', '_blank');
  }

  deleteTheme(theme: ITheme) {
    let body = "Are you sure you want to delete this item?";
    let header = "Confirmation";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.themeSettingService.deleteThemeSetting(theme.Id).subscribe(response => {
          if (response)
            this.getThemes();
        },
          (error) => {
          });
      }
    });
  }

  themeFindAndReplace(themeToReplaceWith: ITheme): ITheme[] {
    return [...this.themeSettingsListData.map(theme => (theme.Id == themeToReplaceWith.Id) ? themeToReplaceWith : theme)]
  }

  getThemes() {
    this.themeSettingService.getThemeSettings().subscribe(themes => {
      this.themeSettingsListData = themes;
      this.isDataReady = true;
    })
  }


}

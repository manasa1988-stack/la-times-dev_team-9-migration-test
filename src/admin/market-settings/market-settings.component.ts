import { Component, OnInit } from '@angular/core';
import { AdminBaseClass } from "../shared/admin-base.class";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MarketSettingsService } from './market-settings.service';
import { IMarketSettings } from '../../app/models/market-settings.model';
import { AddNewMarketSettingsComponent } from './add-new-market-settings/add-new-market-settings.component';
import { CacheEntriesService } from '../cache-entries/cache-entries.service';
import { RemoveCacheEntriesPopupComponent } from '../cache-entries/remove-cache-entries-popup/remove-cache-entries-popup.component';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'market-settings',
  templateUrl: './market-settings.component.html',
})

export class MarketSettingsComponent extends AdminBaseClass {

  marketSettingsListData: IMarketSettings[];
  isDataReady: boolean = false;
  displayError: boolean = false;

  constructor(private modalService: NgbModal,
    private marketSettingsService: MarketSettingsService,
    private cacheEntriesService: CacheEntriesService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.getMarketSettingsData();
  }

  getMarketSettingsData() {
    this.marketSettingsService.getMarketSettings().subscribe(marketSettingsData => {
      this.marketSettingsListData = marketSettingsData;
      this.isDataReady = true;
      this.displayError = false;
    }, (err) => {
      this.isDataReady = true;
      this.displayError = true;
    })
  }

  editMarketSettings(marketSettings: IMarketSettings) {
    const modalRef = this.modalService.open(AddNewMarketSettingsComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.marketSettings = marketSettings;
    modalRef.result.then(result => {
      if (result) {
        this.marketSettingsListData = (result.typeOfCall == 'put') ? this.replaceMarketSettings(result.data, marketSettings.Id) : [...this.marketSettingsListData, result.data];
      }
    })
  }

  replaceMarketSettings(marketSettingsToReplaceWith: IMarketSettings, oldId: number): IMarketSettings[] {
    return [...this.marketSettingsListData.map(marketSetting => marketSetting.Id == oldId ? marketSettingsToReplaceWith : marketSetting)];
  }

  addMarket() {
    const modalRef = this.modalService.open(AddNewMarketSettingsComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.result.then(result => {
      if (result) {
        this.marketSettingsListData = [...this.marketSettingsListData, result.data];
      }
    })
  }

  showRemoveDataPopup(marketSetting: IMarketSettings) {
    const modalRef = this.modalService.open(RemoveCacheEntriesPopupComponent, { size: 'sm', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.cacheMarketName = marketSetting.MarketName;
    modalRef.componentInstance.cacheMarketDomain = marketSetting.Domain;
    modalRef.componentInstance.cacheBUCode = marketSetting.Code;
    modalRef.result.then(result => {
      if (result.cacheKey) {
        const modalResultRef = this.modalService.open(RemoveCacheEntriesPopupComponent,  { size: 'sm', backdrop: 'static', windowClass: 'modal-dialog-centered' });
        modalResultRef.componentInstance.cacheMarketName = marketSetting.MarketName;
      }
    });
  }
}

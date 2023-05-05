import { Component, OnInit } from '@angular/core';
import { AdminBaseClass } from "../shared/admin-base.class";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewCacheEntriesComponent } from '../cache-entries/view-cache-entries/view-cache-entries.component';
import { RemoveCacheEntriesPopupComponent } from '../cache-entries/remove-cache-entries-popup/remove-cache-entries-popup.component';
import { CacheEntriesService } from './cache-entries.service';
import { ICache } from '../models/setting.model';
import { ICharge } from '../../app/models/order-item.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'cache-entries',
  templateUrl: './cache-entries.component.html',
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1, display: 'block' })),
      state('false', style({ opacity: '0', display: 'none' })),
      transition('0 => 1', animate('.100s')),
      transition('1 => 0', animate('.75s'))
    ])
  ]
})

export class CacheEntriesComponent extends AdminBaseClass {

  showHelp: boolean = false;
  hideShowAnimator: boolean = false;
  displayError: boolean = false;
  cacheEntriesListData: ICache[] = [];

  constructor(private modalService: NgbModal, private cacheEntriesService: CacheEntriesService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.showHelp = false;
    this.hideShowAnimator = !this.hideShowAnimator;
  }

  validationInit() {
    this.cacheEntriesPopulator();
  }

  cacheEntriesPopulator() {

    let cacheEntry: ICache;

    this.cacheEntriesService.getAllCache().subscribe((response:any) => {
      response.RemovableCacheEntries.forEach(removableCacheEntry => {
        cacheEntry = <ICache>{};
        cacheEntry.Key = removableCacheEntry.Key;
        cacheEntry.Server = removableCacheEntry.Server.split(" ");
        this.cacheEntriesListData.push(cacheEntry);
      });
    },
      (err) => {
        this.displayError = true;
      })
  }

  changeShowStatus() {
    this.showHelp = !this.showHelp;
  }


  showInfoPopup(key: string) {
    const modalRef = this.modalService.open(ViewCacheEntriesComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.cacheKey = key;
  }

  showRemoveDataPopup(cacheEntry) {
    const modalRef = this.modalService.open(RemoveCacheEntriesPopupComponent, { size: 'sm', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.cacheEntryName = cacheEntry.Key;
    modalRef.result.then(result => {
      if (result.cacheKey) {
        this.cacheEntriesListData = this.cacheEntriesListData.filter(ce => ce.Key != result.cacheKey);
      }
    });
  }

  clearAllCache() {
    this.cacheEntriesService.cleanAll().subscribe(data => {
      if (data.IsSuccess)
        this.cacheEntriesListData = [];
    });
  }

}

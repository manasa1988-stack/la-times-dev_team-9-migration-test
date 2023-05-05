import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminBaseClass } from "../../shared/admin-base.class";
import { CacheEntriesService } from '../cache-entries.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'remove-cache-entries-popup',
    templateUrl: './remove-cache-entries-popup.component.html',
})
export class RemoveCacheEntriesPopupComponent extends AdminBaseClass {

    cacheEntryName: string;
    cacheMarketName: string;
    cacheMarketDomain: string;
    cacheBUCode: string;

    constructor(public activeModal: NgbActiveModal,
                private cacheEntriesService: CacheEntriesService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {

    }

    delete() {

        if(this.cacheEntryName) {
            this.deleteCache(this.cacheEntryName);
        }
        if(this.cacheMarketName) {
            this.deleteCache("BusinessUnit_" + this.cacheMarketDomain);
            this.deleteCache("BusinessUnit_" + this.cacheBUCode);
        }
    }

    deleteCache(key) {
        this.cacheEntriesService.deleteCache(key).subscribe(response => {
            if (response.IsSuccess) {
                this.activeModal.close({cacheKey : key})
            }
        });
    }

}

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminBaseClass } from "../../shared/admin-base.class";
import { DiscardChangesPopupComponent } from '../../../app/pages/discard-changes-popup/discard-changes-popup.component';
import { CacheEntriesService } from '../cache-entries.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'view-cache-entries',
    templateUrl: './view-cache-entries.component.html',
})
export class ViewCacheEntriesComponent extends AdminBaseClass {

    cacheKey: string;
    cacheValues = [];

    constructor(public activeModal: NgbActiveModal,
                private cacheEntriesService: CacheEntriesService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() { 
        this.getCacheWithKey();
    }

    getCacheWithKey() {
        this.cacheEntriesService.getCacheEntry(this.cacheKey).subscribe(data => {
            this.cacheValues = data;
        });
    }

    onClose() {
        this.activeModal.close();
    }

}

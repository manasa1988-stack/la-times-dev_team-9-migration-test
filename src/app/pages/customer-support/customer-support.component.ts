import { Component, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { StorageService } from '../../shared/storage.service';
import { BaseClass } from '../../shared/base.class';
import { IMarketSettings } from '../../models/market-settings.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'customer-support',
    templateUrl: './customer-support.component.html'
})
export class CustomerSupportComponent extends BaseClass {

    customerSupport: IMarketSettings;
    isDataReady: boolean = false;

    constructor(private route: ActivatedRoute,
        private storageService: StorageService,_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
        this.customerSupport = <IMarketSettings>this.storageService.getHOST();
        this.isDataReady = true;
    }

}

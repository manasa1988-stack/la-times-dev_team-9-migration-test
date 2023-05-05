import { Component } from "@angular/core";
import { AdminBaseClass } from "../shared/admin-base.class";
import { IMarketSettings } from "../../app/models/market-settings.model";
import { IIdTypeName, IIdStyleName } from "../models/digital-settings.model";
import { MarketSettingsService } from "../market-settings/market-settings.service";
import { DigitalSettingsService } from "./digital-settings.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'digital-settings',
    templateUrl: './digital-settings.component.html',
})

export class DigitalSettingsComponent extends AdminBaseClass {

    marketSettingsListData: IMarketSettings[];
    geoTargetStates: IIdTypeName[];
    htmlStyles: IIdStyleName[];

    isStatesReady: boolean = false;
    isStylesReady: boolean = false;

    step = 0;

    constructor(private marketSettingsService: MarketSettingsService,
        private digitalSettingsService: DigitalSettingsService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
        this.getMarketSettingsData();
        this.getGeoTargetStates();
        this.getHtmlStyles();
    }

    getMarketSettingsData() {
        this.marketSettingsService.getMarketSettings().subscribe(marketSettingsData => {
            this.marketSettingsListData = marketSettingsData;
        });
    }

    getGeoTargetStates() {
        this.digitalSettingsService.getGeoTargetStates().subscribe(geoTargetStates => {
            this.geoTargetStates = geoTargetStates;
            this.isStatesReady = true;
        },
        err => {
            this.isStatesReady = true;
        });
    }

    getHtmlStyles() {
        this.digitalSettingsService.getHtmlStyles().subscribe(htmlStyles => {
            this.htmlStyles = htmlStyles;
            this.isStylesReady = true;
        },
        err => {
            this.isStylesReady = true;
        });
    }

    setStep(index: number) {
        this.step = index;
      }
}
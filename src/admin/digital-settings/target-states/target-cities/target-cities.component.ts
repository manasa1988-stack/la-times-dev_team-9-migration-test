import { Component } from "@angular/core";
import { AdminBaseClass } from "../../../shared/admin-base.class";
import { IIdTypeName } from "../../../models/digital-settings.model";
import { IMarketSettings } from "../../../../app/models/market-settings.model";
import { DigitalSettingsService } from "../../digital-settings.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { isNullOrUndefined } from "util";
import { FormControl } from "@angular/forms";
import { DiscardModalService } from "../../../../app/shared/discard-modal.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'target-cities',
    templateUrl: './target-cities.component.html',
})

export class TargetCitiesComponent extends AdminBaseClass {

    cities: IIdTypeName[];

    selectedCities: number[];

    buUnit: IMarketSettings;
    state: IIdTypeName;
    searchText = new FormControl();

    updatedCities: number[] = [];
    isCitiesReady: boolean = false;

    constructor(private digitalSettingsService: DigitalSettingsService,
        public activeModal: NgbActiveModal,
        private discardModalService: DiscardModalService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
        this.getCitiesForState();
    }

    getCitiesForState() {
        this.digitalSettingsService.getCities(this.state.ID).subscribe(result => {
            this.cities = result;
            this.getSelectedCities();
        });
    }

    getSelectedCities() {
        this.digitalSettingsService.getSelectedCities(this.buUnit.SettingId, this.state.ID).subscribe(result => {
            this.selectedCities = result;
            this.updateSelectedCitiesCheck();
        });
    }

    updateSelectedCitiesCheck() {
        this.cities.forEach(city => {
            this.selectedCities.indexOf(city.ID) > -1 ? this.updateCheckValue(true, city) : this.updateCheckValue(false, city);
        })
        this.isCitiesReady = true;
    }

    updateCheckValue(selected, geoCity?: IIdTypeName) {
        if (isNullOrUndefined(geoCity))
            this.cities.forEach(city => {
                city.IsChecked = selected;
            })
        else {
            this.cities.find(city => city.ID === geoCity.ID).IsChecked = selected;
        }
    }

    getUpdatedListOfCities() {
        this.updatedCities = [];
        this.cities.forEach(city => {
            if (city.IsChecked)
                this.updatedCities.push(city.ID);
        });
    }

    saveSelectedCities() {
        this.getUpdatedListOfCities();
        if (this.updatedCities.length > 0) {
            this.digitalSettingsService.saveSelectedCities(this.buUnit.SettingId, this.state.ID, this.updatedCities)
                .subscribe((result:any) => {
                    if (result.IsSuccess)
                        this.activeModal.close();
                });
        }
        else {
            let body = "Please select atleast one City to proceed.";
            let confirmPopup = this.discardModalService.showMessage(body, "Warning");
        }
    }
}
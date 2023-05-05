import { Component, Input } from "@angular/core";
import { AdminBaseClass } from "../../shared/admin-base.class";
import { IMarketSettings } from "../../../app/models/market-settings.model";
import { IIdTypeName } from "../../models/digital-settings.model";
import { DigitalSettingsService } from "../digital-settings.service";
import { isNullOrUndefined } from "util";
import { TargetCitiesComponent } from "./target-cities/target-cities.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DiscardModalService } from "../../../app/shared/discard-modal.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'target-states',
    templateUrl: './target-states.component.html',
})

export class TargetStatesComponent extends AdminBaseClass {

    @Input() marketSettingsListData: IMarketSettings[];
    @Input() geoTargetStates: IIdTypeName[];

    selectedBUUnit: IMarketSettings;
    selectedStatesForBU: number[];

    updatedSelectedStates: number[] = [];
    oldListOfStates: IIdTypeName[];

    unselectedStates: number[] = [];

    constructor(private digitalSettingsService: DigitalSettingsService,
        public ngbModal: NgbModal,
        private discardModalService: DiscardModalService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
    }

    getSelectedStatesForBU(buUnitId) {
        this.selectedBUUnit = this.marketSettingsListData.find(marketSettings => marketSettings.Id == buUnitId);

        if (isNullOrUndefined(this.selectedBUUnit)) {
            this.updateCheckValue(false);
        }
        else {
            this.digitalSettingsService.getSelectedStates(this.selectedBUUnit.SettingId).subscribe(result => {
                this.selectedStatesForBU = result;
                this.updateSelectedStateCheck();
            });
        }
    }

    updateSelectedStateCheck() {
        this.geoTargetStates.forEach(geoTargetState => {
            this.selectedStatesForBU.indexOf(geoTargetState.ID) > -1 ? this.updateCheckValue(true, geoTargetState) : this.updateCheckValue(false, geoTargetState);
        });
        this.oldListOfStates = JSON.parse(JSON.stringify(this.geoTargetStates));
    }

    updateCheckValue(selected, state?: IIdTypeName) {
        if (isNullOrUndefined(state)) {
            this.geoTargetStates.forEach(geoTargetState => {
                geoTargetState.IsChecked = selected;
            });
        }
        else {
            if (!selected) {
                this.unselectedStates.push(state.ID);
            }
            state.IsChecked = selected;
        }
    }

    openCityPopUp(state: IIdTypeName) {
        const modalRef = this.ngbModal.open(TargetCitiesComponent, {
            backdrop: "static",
            windowClass: "modal-dialog-centered"
        });
        modalRef.componentInstance.state = Object.assign({}, state);
        modalRef.componentInstance.buUnit = Object.assign({}, this.selectedBUUnit);
        modalRef.result.then(result => {

        });
    }

    reset() {
        this.geoTargetStates = JSON.parse(JSON.stringify(this.oldListOfStates));
        // this.updateSelectedStateCheck();
    }

    getUpdatedListOfSelectedStates() {
        this.updatedSelectedStates = [];
        this.geoTargetStates.forEach(geoTargetState => {
            if (geoTargetState.IsChecked)
                this.updatedSelectedStates.push(geoTargetState.ID);
        });
    }

    saveSelectedStates() {

        if (isNullOrUndefined(this.selectedBUUnit)) {
            let body = "Please select valid Business Unit to proceed.";
            let confirmPopup = this.discardModalService.showMessage(body, "Warning");
        }
        else {
            this.postSelectedStates();
        }
    }

    postSelectedStates() {
        this.getUpdatedListOfSelectedStates();
        if (this.updatedSelectedStates.length > 0) {
            // this.deleteUnselectedState();
            this.digitalSettingsService.saveSelectedStates(this.selectedBUUnit.SettingId, this.updatedSelectedStates)
                .subscribe((result:any) => {
                    if (result.IsSuccess['']) {
                        let body = "Changes saved successfully.";
                        let confirmPopup = this.discardModalService.showMessage(body, "Confirmation");
                    }
                });
        }
        else {
            let body = "Please select atleast one State to proceed.";
            let confirmPopup = this.discardModalService.showMessage(body, "Warning");
        }
    }

    deleteUnselectedState() {
        console.log("this.unselectedStates ", this.unselectedStates);
    }
}
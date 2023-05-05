import { Component, Input } from "@angular/core";
import { AdminBaseClass } from "../../shared/admin-base.class";
import { IIdStyleName, IBUStyleMap } from "../../models/digital-settings.model";
import { IMarketSettings } from "../../../app/models/market-settings.model";
import { DigitalSettingsService } from "../digital-settings.service";
import { isNullOrUndefined } from "util";
import { FormGroup, FormControl } from "@angular/forms";
import { DiscardModalService } from "../../../app/shared/discard-modal.service";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'html-editor',
    templateUrl: './html-editor.component.html',
})

export class HtmlEditorComponent extends AdminBaseClass {

    @Input() marketSettingsListData: IMarketSettings[];
    @Input() htmlStyles: IIdStyleName[];

    selectedStylesForBU: IBUStyleMap[];
    htmlStyleFormGroup: FormGroup;
    selectedBUUnit: IMarketSettings;

    oldListOfStyles: IIdStyleName[];

    constructor(private digitalSettingsService: DigitalSettingsService,
        private discardModalService: DiscardModalService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
        this.createFormGroup();
    }

    getSelectedStylesForBU(buUnitId?) {
        this.selectedBUUnit = this.marketSettingsListData.find(marketSettings => marketSettings.Id == buUnitId);

        if (isNullOrUndefined(this.selectedBUUnit)) {
            this.updateCheckValue(false);
        }
        else {
            this.digitalSettingsService.getSelectedStyles(this.selectedBUUnit.SettingId).subscribe(result => {
               // this.selectedStylesForBU= result;
                if (this.selectedStylesForBU.length > 0) {
                    this.updateSelectedStyle();
                    this.updateFormGroup();
                }
                else {
                    this.clearFormAndStyle();
                }
            });
        }
    }

    checkIfIsSelectedStyle(style: IIdStyleName) {
        return !isNullOrUndefined(this.selectedStylesForBU.filter(selectedStyleForBU => selectedStyleForBU.EditorStyleId == style.Id))
    }

    updateSelectedStyle() {
        this.htmlStyles.forEach(htmlStyle => {
            if (this.selectedStylesForBU.find(selectedStyle => selectedStyle.EditorStyleId === htmlStyle.Id)) {
                this.updateCheckValue(true, htmlStyle);
            }
            else {
                this.updateCheckValue(false, htmlStyle);
            }
        });
        this.oldListOfStyles = JSON.parse(JSON.stringify(this.htmlStyles));
    }

    createFormGroup() {
        let group: any = {};
        this.htmlStyles.forEach((htmlStyle) => {
            group[htmlStyle.StyleName] = new FormControl('');;
        });
        this.htmlStyleFormGroup = new FormGroup(group);
    }

    updateFormGroup() {
        let styleName;
        this.selectedStylesForBU.forEach(selectedStyleForBU => {
            styleName = this.htmlStyles.find(htmlStyle => htmlStyle.Id == selectedStyleForBU.EditorStyleId).StyleName;
            // console.log("html", selectedStyleForBU);
            this.htmlStyleFormGroup.controls[styleName].setValue(selectedStyleForBU.PackagesIDS);
        })
    }

    clearFormAndStyle() {
        this.updateCheckValue(false);
    }

    updateCheckValue(selected, style?: IIdStyleName) {
        if (isNullOrUndefined(style)) {
            this.htmlStyles.forEach(htmlStyle => {
                htmlStyle.IsChecked = selected;
                if (!selected) {
                    this.htmlStyleFormGroup.controls[htmlStyle.StyleName].setValue('');
                    this.htmlStyleFormGroup.controls[htmlStyle.StyleName].disable();
                }
                else {
                    this.htmlStyleFormGroup.controls[htmlStyle.StyleName].enable();
                }
            });
        }
        else {
            let htmlStyle = this.htmlStyles.find(htmlStyle => htmlStyle.Id === style.Id);
            htmlStyle.IsChecked = selected;
            if (!selected) {
                this.htmlStyleFormGroup.controls[htmlStyle.StyleName].setValue('');
                this.htmlStyleFormGroup.controls[htmlStyle.StyleName].disable();
            }
            else {
                this.htmlStyleFormGroup.controls[htmlStyle.StyleName].enable();
            }
        }
    }

    reset() {
        // this.updateSelectedStyle();
        this.htmlStyles = JSON.parse(JSON.stringify(this.oldListOfStyles));
        this.htmlStyles.forEach(htmlStyle => {
            if (htmlStyle.IsChecked)
                this.htmlStyleFormGroup.controls[htmlStyle.StyleName].enable();
        })
    }

    getUpdatedListOfStyles() {
        let submitUpdatedStylesRequest = {};
        submitUpdatedStylesRequest["BUEditorStyleMaps"] = []

        let style = {};

        this.htmlStyles.forEach(htmlStyle => {
            if (htmlStyle.IsChecked) {
                console.log("html Stye", htmlStyle);
                style = {};
                style["EditorStyleId"] = htmlStyle.Id;
                style["PackagesIDS"] = this.htmlStyleFormGroup.controls[htmlStyle.StyleName].value;
                submitUpdatedStylesRequest["BUEditorStyleMaps"].push(style);
            }
        });
        console.log("submitUpdatedStylesRequest ",submitUpdatedStylesRequest);
        if (isNullOrUndefined(this.selectedBUUnit)) {
            this.discardModalService.showMessage("Please Select Business Unit", "Error!");
            return;
        }
        submitUpdatedStylesRequest["BUId"] = this.selectedBUUnit.SettingId;
        return submitUpdatedStylesRequest;
    }

    saveSelectedStyles() {
        this.postSelectedStyles();

    }

    postSelectedStyles() {
        let request = this.getUpdatedListOfStyles();
        console.log("request", request);
        if (!isNullOrUndefined(request)) {
            this.digitalSettingsService.saveStyleSelection(request)
                .subscribe(result => {
                    let body = "Changes saved successfully.";
                    let confirmPopup = this.discardModalService.showMessage(body, "Confirmation");
                });
        }

    }
}
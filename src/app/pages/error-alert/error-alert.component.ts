import { Component, Input } from '@angular/core';
import { BaseClass } from '../../shared/base.class';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'error-alert',
    templateUrl: './error-alert.component.html'
})

export class ErrorAlertComponent extends BaseClass {

    @Input() errorMessage: string;

    constructor(_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
        if (!this.errorMessage || this.errorMessage == '') {
            this.errorMessage = "Oops! An error occurred while retrieving the data.";
        }
    }

    validationInit() {

    }
}
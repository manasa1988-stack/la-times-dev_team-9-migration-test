import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { IAttributeDisplayGroup } from "../../../models/order-item.model";
import { FormControl, Validators, FormGroup, EmailValidator } from "@angular/forms";
import * as adssMetadata from '../../../shared/adss.metadata';
import { isNullOrUndefined } from "util";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'edit-text',
    templateUrl: './edit-text.component.html'
})

export class EditTextComponent extends BaseClass {

    @Input() order;
    @Input() editTextForms;

    @Output() passUpdatedInputAttributes: EventEmitter<any> = new EventEmitter<any>();

    fieldType = adssMetadata.FieldType;

    updatedAttributes = {};

    // childAttributes: string[] = [];

    constructor(_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {

    }

    onSelectingOption(event, attribute) {
        this.updatedAttributes[attribute.Name] = event.target.value;
        this.updatedInputAttributes();
    }

    updatedInputAttributes() {
        this.passUpdatedInputAttributes.emit({
            updatedInputAttributes: this.updatedAttributes
        })
    }

    notify(event, attribute) {
        this.updatedAttributes[attribute.Name] = event.target.value;
        // console.log("this.updatedAttributes[attribute.Name] ",this.updatedAttributes[attribute.Name]);
        this.updatedInputAttributes();
    }
}
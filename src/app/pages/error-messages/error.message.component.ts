import { Component, Input } from '@angular/core';
import { BaseClass } from '../../shared/base.class';
import { ServerResponse } from '../../models/server.response.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'error-message',
    templateUrl: './error.message.component.html'
})

export class ErrorMessageComponent extends BaseClass {

    @Input() serverResponse: ServerResponse;
    
     errorMessage: any[]; 
     validationMessage: any[]; 

    constructor(_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit(){

    }
}
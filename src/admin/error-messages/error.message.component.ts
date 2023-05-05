import { Component, Input } from '@angular/core';
import { AdminBaseClass } from "../shared/admin-base.class";
import { ServerResponse } from '../models/server.response.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
    selector: 'error-message',
    templateUrl: './error.message.component.html'
})

export class ErrorMessageComponent extends AdminBaseClass {

    @Input() serverResponse: ServerResponse;
    
     errorMessage: any[]; 
     validationMessage: any[]; 

    constructor( _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit(){

    }
}
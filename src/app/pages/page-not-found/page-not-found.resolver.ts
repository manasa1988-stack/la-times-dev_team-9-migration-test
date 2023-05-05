
import {empty as observableEmpty,  Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

@Injectable()
export class PageNotFoundResolver implements Resolve<any> {

    resolve() {
        window.location.assign('/pageNotFound');
        return observableEmpty();
    }
}
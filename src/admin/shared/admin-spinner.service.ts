import { Injectable } from "@angular/core";

@Injectable()
export class AdminSpinnerService {

    private isDataReady: boolean;

    set(value){
        this.isDataReady = value;
    }

    get(): boolean {
        return this.isDataReady;
    }

    constructor() {

    }
 
}

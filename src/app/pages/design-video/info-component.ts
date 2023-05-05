import { Component, Inject, Input } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material";

@Component({
    selector: 'info',
    template: `
    <ng-container *ngIf="data.type === 'info'">
        <p><i class="fa fa-info-circle" aria-hidden="true"></i> {{data.message}}</p>
    </ng-container>

    <ng-container *ngIf="data.type === 'warning'">
        <p><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> {{data.message}}</p>
    </ng-container>

    <ng-container *ngIf="data.type === 'alert'">
        <p><i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{data.message}}</p>
    </ng-container>
    `,
    styles: [''],
})
export class InfoComponent {
    constructor( @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}

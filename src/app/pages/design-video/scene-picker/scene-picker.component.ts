import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
    selector: 'scene-picker',
    templateUrl: './scene-picker.component.html',
    styleUrls: ['./scene-picker.component.scss'],
})
export class ScenePickerComponent implements OnInit {
    @ViewChild('dialog',{static:true}) dialog;
    public set: any[] = [];
    public _addLayouts;

    public type = '';
    public selectedLayouts: any[] =  [];
    public dialogRef;

    constructor(private modal: MatDialog) {
    }

    ngOnInit() {
    }

    pickLayout(setIndex) {
        this.selectedLayouts = [
            cloneDeep(this.set[setIndex]),
        ];
    }

    toggleLayout(ev, i) {
        if (!ev.checked) {
            this.selectedLayouts = this.selectedLayouts.filter((layout) => {
                return layout.name !== this.set[i].name;
            });
            return;
        }

        this.selectedLayouts.push(cloneDeep(this.set[i]));
    }

    public open(type) {
        this.type = type;
        this.dialogRef = this.modal.open(this.dialog);
    }

    addLayouts() {
        this._addLayouts(JSON.stringify(this.selectedLayouts));
        // this.selectedLayouts = [];
        // this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}

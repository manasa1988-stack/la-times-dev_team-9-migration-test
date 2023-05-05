import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as isNil from 'lodash/isNil';
import { TrackPickerModalComponent } from './track-picker-modal/track-picker-modal.component';

@Component({
    selector: 'track-picker',
    templateUrl: './track-picker.component.html',
    styleUrls: ['./track-picker.component.scss'],
})
export class TrackPickerComponent implements OnInit {
    @ViewChild('dialog',{static:true}) dialog;
    @Input() audioTracks: any[] = [];
    @Input() selectedTrack: string = null;
    @Output() update: EventEmitter<any> = new EventEmitter<any>();

    public type = '';
    // public _selectedTrack: string;
    public dialogRef;
    public trackIndex = 0;

    constructor(
        private modal: MatDialog,
        private ngbModal: NgbModal,
    ) {
    }

    ngOnInit() {
    }

    pickTrack(track) {
    }

    public openTrackDialog() {
        // this.dialogRef = this.modal.open(this.dialog);

        const modalRef = this.ngbModal.open(TrackPickerModalComponent);
        modalRef.componentInstance.audioTracks = this.audioTracks;
        modalRef.componentInstance.selectedTrack = this.selectedTrack;
        modalRef.componentInstance.close = () => modalRef.close();
        modalRef.componentInstance.saveParent = (r) => {
            this.selectedTrack = r.value;
            this.saveParent();
        }
    }

    saveParentFromComponent(r) {
        this.selectedTrack = r.target.value;
        this.saveParent();
    }

    saveParent() {
        if (this.selectedTrack) {
            this.update.emit(this.selectedTrack);
        }
    }

    getTrackNumber(targetTrack = null) {
        if (isNil(this.audioTracks)) {
            return;
        }

        if (isNil(targetTrack)) {
            return this.audioTracks.findIndex(track => this.selectedTrack === track) + 1;
        }

        return this.audioTracks.findIndex(track => targetTrack === track) + 1;
    }
}

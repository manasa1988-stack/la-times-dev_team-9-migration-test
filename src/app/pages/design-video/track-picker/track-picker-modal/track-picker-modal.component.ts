import { Component, EventEmitter, Input, Output } from "@angular/core";
import isNil from 'lodash/isNil';
@Component({
    selector: 'track-picker-modal',
    templateUrl: './track-picker-modal.component.html',
    styleUrls: ['./track-picker-modal.component.scss'],
})
export class TrackPickerModalComponent {
    @Input() audioTracks: any[] = [];
    @Input() selectedTrack: string = null;
    public close;
    @Output() _saveParent: EventEmitter<any> = new EventEmitter<any>();

    getTrackNumber(targetTrack = null) {
        if (isNil(this.audioTracks)) {
            return;
        }

        if (isNil(targetTrack)) {
            return this.audioTracks.findIndex(track => this.selectedTrack === track) + 1;
        }

        return this.audioTracks.findIndex(track => targetTrack === track) + 1;
    }

};
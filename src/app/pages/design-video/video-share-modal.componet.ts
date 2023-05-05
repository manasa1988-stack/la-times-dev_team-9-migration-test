import { Component, ComponentRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'video-share-modal',
    templateUrl: './video-share-modal.component.html'
})
export class VideoShareModalComponent implements OnInit {
    @Output() update: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        public activeModal: NgbActiveModal,
    ) {
    }

    public info: any;

    _update(value) {
        this.update.emit(value);
    }

    ngOnInit() {
    }
}

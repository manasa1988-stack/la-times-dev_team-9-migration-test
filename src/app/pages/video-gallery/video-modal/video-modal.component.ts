import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'video-modal',
    templateUrl: './video-modal.component.html'
})
export class VideoModalComponent implements OnInit {
    constructor(
        public activeModal: NgbActiveModal,
    ) {
    }

    public info: any;

    ngOnInit() {
    }
}
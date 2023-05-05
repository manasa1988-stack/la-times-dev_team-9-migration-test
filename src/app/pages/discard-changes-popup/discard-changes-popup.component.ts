import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-discard-changes-popup',
  templateUrl: './discard-changes-popup.component.html'
})
export class DiscardChangesPopupComponent implements OnInit {

    activeModal: NgbActiveModal;
    body: string;
    header: string;
    isError: boolean;
    aditSuccessMessage: boolean;

    constructor(private am: NgbActiveModal) {
        this.activeModal = am;
    }
 
  ngOnInit() { }
}

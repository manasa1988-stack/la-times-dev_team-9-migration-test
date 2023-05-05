import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscardModalService } from '../../../shared/discard-modal.service';
import { IModalMessage } from '../interfaces';

@Component({
    selector: 'ngb-message-modal',
    templateUrl: 'ngb-message-modal.component.html',
    styleUrls: ['ngb-message-modal.component.scss']
})
export class NgbMessageModalComponent {
    @ViewChild('dialogTemplate',{static:true}) dialogTemplate;
    public secondaryAction;
    public primaryAction;
    public message: IModalMessage = null;
    public close;

    _close() {
        this.close();
    }

    _secondaryAction() {
        this.secondaryAction();
        this.close();
    }

    _primaryAction() {
        this.primaryAction();
        this.close();
    }
}

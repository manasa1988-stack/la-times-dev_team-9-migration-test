import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscardModalService } from '../../../../shared/discard-modal.service';
import { IModalMessage } from '../../interfaces';

@Component({
    selector: 'preview-modal',
    templateUrl: 'preview-modal.component.html',
    styleUrls: ['preview-modal.component.scss']
})
export class PreviewModalComponent {
    @ViewChild('dialogTemplate',{static:true}) dialogTemplate;
    public preview: any[] = [];
    public close;

    _close() {
        this.close();
    }
}

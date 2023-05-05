import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IModalMessage } from '../interfaces';

@Component({
    selector: 'message-modal',
    templateUrl: 'message-modal.component.html',
    styleUrls: ['message-modal.component.scss']
})
export class MessageModalComponent {
    @ViewChild('dialogTemplate',{static:true}) dialogTemplate;
    @Output() secondaryAction: EventEmitter<any> = new EventEmitter<any>();
    @Output() primaryAction: EventEmitter<any> = new EventEmitter<any>();
    @Input() message: IModalMessage = null;

    private dialog;

    constructor(private modal: MatDialog) {
    }

    public open() {
        this.dialog = this.modal.open(this.dialogTemplate);
    }

    close() {
        this.dialog.close();
    }

    _close() {
        this.close();
    }

    _secondaryAction() {
        this.secondaryAction.emit();
        this.close();
    }

    _primaryAction() {
        this.primaryAction.emit();
        this.close();
    }
}

import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IModalMessage } from '../interfaces';
import { AngularCropperjsComponent, ImageCropperResult } from 'angular-cropperjs';
import { WibbitzService } from '../../../shared/services';

@Component({
    selector: 'cropper-modal',
    templateUrl: 'cropper-modal.component.html',
    styleUrls: ['cropper-modal.component.scss'],
})
export class CropperModalComponent {
    @ViewChild('cropperTemplate',{static:true}) cropperTemplate;
    @ViewChild('angularCropper',{static:true}) angularCropper;
    @Input() wibbitzOrderId;
    @Input() aditId;
    @Input() payload;
    @Input() currentImage;
    @Input() draftId;
    @Input() layoutId;
    @Input() target;
    @Input() attributeId;
    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

    private dialog;
    public resultImage;
    public original;
    public resultResult;
    public config = {
        autoCropArea: 0,
        viewMode: 0,
        checkCrossOrigin: false,
        zoomable: true,
        rotatable: true,
        scalable: true,
        guides: false,
        aspectRatio: 1,
        responsive: true,
    };

    constructor(
        private modal: MatDialog,
        private wibbitzOrderService: WibbitzService,
    ) {
    }

    public open() {
        this.dialog = this.modal.open(this.cropperTemplate);
        this.dialog.afterClosed().subscribe(() => {
            this.refresh.emit();
        });
    }

    public _close() {
        this.dialog.close();
    }

}

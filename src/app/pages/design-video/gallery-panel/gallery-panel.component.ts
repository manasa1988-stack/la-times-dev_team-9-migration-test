import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, ComponentRef, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, CropperSettings,  } from 'ngx-img-cropper';
import { WibbitzService } from '../../../shared/services';
import * as isNil from 'lodash/isNil';
import * as cloneDeep from 'lodash/cloneDeep';
import { BaseUploadCroopedImageParams } from '../../../shared/constants/base-upload-cropped-image-params.consant';
// import { environment } from "../../../../environments/environment";
import { NoImageUrl } from '../constants/layouts.constant';
import { CropperEditorComponent } from '../cropper-modal/cropper-editor/cropper-editor.component';

interface ICropResult {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

interface IMediaData {
    ratio: number;
    width: number;
    height: number;
}

@Component({
    selector: 'gallery-panel',
    templateUrl: './gallery-panel.component.html',
    styleUrls: ['./gallery-panel.component.scss'],
})
export class GalleryPanelComponent implements OnInit {
    @Input() payload: any;
    @Input() sceneHelper: any;
    @Input() wibbitzOrderId;
    @Input() aditId;
    @Input() printAdImage: string;
    @Output() setImage: EventEmitter<any> = new EventEmitter<any>();
    @Output() refreshPayload: EventEmitter<any> = new EventEmitter<any>();
    @Input() target = '';
    @Input() mediaData: IMediaData = null;

    @Input() draftId = '';
    @Input() layoutId = '';
    @Input() attributeId = '';

    @Input() set images(value: any) {
        this._images = value;
        this.update();
    };

    @Input() set layoutImage(value: any) {
        if (value === '' || isNil(value)) {
            this._layoutImage = [NoImageUrl+'?'];
            this.noImage = true;
            this.validate();
        } else {
            this._layoutImage = [`${value}?time=${Date.now()}`];
            this.noImage = false;
            this.validate();
        }


    };

    validate() {
        if (isNil(this.sceneHelper)) {
            return;
        }

        if (isNil(this.sceneHelper._mediaErrors)) {
            Object.assign(this.sceneHelper, {_mediaErrors: {}});
        }

        if (isNil(this.sceneHelper._mediaErrors[this.target])) {
            //Object.assign(this.sceneHelper._mediaErrors, {[this.target]: this.noImage});
            return;
        }

        this.sceneHelper._mediaErrors[this.target] = this.noImage;
    }

    // @ViewChild('cropper') cropper: ImageCropperComponent;
    @ViewChild('cropper',{static:true}) cropper;
    @ViewChild('uploader',{static:true}) uploader: ElementRef;

    public _images: any[];
    public _layoutImage = [];
    public noImage = true;

    data: any;
    cropperSettings: CropperSettings;
    cropperResult: ICropResult;
    timestamp = 0;

    public previewScale = 0;
    constructor(private ngbModal: NgbModal) {
    }

    update() {
        const marker = Date.now();
        this._layoutImage =  [`${this._layoutImage[0]}^&marker=${marker}`];
    }

    ngOnInit() {
        this.update();
    }

    _setImage(path) {
        this.layoutImage = path;
        const target = this.target;
        this.setImage.emit({path, target});
    }

    _refreshPayload() {
        this.refreshPayload.emit();
        this.update();
    }

    showCropper() {
        // this.cropper.open();
        const dialogRef = this.ngbModal.open(CropperEditorComponent, {
            size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
        });
        dialogRef.componentInstance.closeModal = () => dialogRef.close();
        dialogRef.componentInstance.wibbitzOrderId = this.wibbitzOrderId;
        dialogRef.componentInstance.aditId = this.aditId;
        dialogRef.componentInstance.payload = this.payload;
        dialogRef.componentInstance.currentImage = this._layoutImage;
        dialogRef.componentInstance.draftId = this.draftId;
        dialogRef.componentInstance.layoutId = this.layoutId;
        dialogRef.componentInstance.target = this.target;
        dialogRef.componentInstance.attributeId = this.attributeId;

        dialogRef.componentInstance.config.aspectRatio = this.mediaData.ratio;
        dialogRef.componentInstance.minWidth = this.mediaData.width;
        dialogRef.componentInstance.minHeight = this.mediaData.height;

        dialogRef.componentInstance.refresh = () => this._refreshPayload();
    }
}

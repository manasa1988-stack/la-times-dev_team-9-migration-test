import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WibbitzService } from '../../../../shared/services';
import * as cloneDeep from 'lodash/cloneDeep';
import * as isNil from 'lodash/isNil';
import { BaseUploadCroopedImageParams } from '../../../../shared/constants/base-upload-cropped-image-params.consant';
import { HttpClient } from '@angular/common/http';
import { LayoutIdentifiers, NoImageUrl } from '../../constants/layouts.constant';
import {
    Scene1Helper,
    Scene2Helper,
    Scene3Helper,
    Scene4Helper,
    Scene5Helper,
    Scene6Helper,
    Scene7Helper,
    Scene8Helper,
    Scene9Helper,
    Scene10Helper
} from '../../scene-editor/scenes .helper';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { InfoComponent } from '../../info-component';

@Component({
    selector: 'cropper-editor',
    templateUrl: 'cropper-editor.component.html',
    styleUrls: ['cropper-editor.component.scss'],
})
export class CropperEditorComponent implements OnInit {
    @ViewChild('angularCropper',{static:true}) angularCropper;

    public wibbitzOrderId;
    public aditId;
    public payload;
    public currentImage;
    public draftId;
    public layoutId;
    public target;
    public attributeId;
    public refresh;
    public sizeError = false;

    public closeModal;
    private dialog;
    public resultImage;
    public original;
    public resultResult;
    public config = {
        autoCrop: true,
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

    public minWidth = 0;
    public minHeight = 0;
    public cropperReady = false;

    copperDetails: any = {};

    public url = '';

    cropperTouchStart(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    ngOnInit() {
        this.cropperReady = false;
        this.http.get(
            `/api/wibbitz/getimage?draftId=${this.draftId}&layoutId=${this.layoutId}&attributeId=${this.attributeId}&isOriginal=true&marker=${Date.now()}`,
            { responseType: 'text' },
        )
        .subscribe((r) => {
            this.url = `/api/wibbitz/getimage?draftId=${this.draftId}&layoutId=${this.layoutId}&attributeId=${this.attributeId}&isOriginal=true&ts=${new Date().getTime()}`;
        },
        err => {
            this.cropperImageSetter();
        });
    }

    constructor(
        public snackBar: MatSnackBar,
        private wibbitzOrderService: WibbitzService,
        private http: HttpClient,
    ) {
    }

    _close() {
        this.closeModal.emit();
    }

    ready(ready) {
        this.cropperReady = true;
    }

    export(event) {

    }

    crop() {
        this._uploadCropped(this.angularCropper.cropper.getData());
    }

    cropperChange(event) {
        this.copperDetails = event;
    }

    _uploadCropped(cropInfo) {
        const imageData = this.angularCropper.cropper.getImageData();
        const cropParams = cloneDeep(BaseUploadCroopedImageParams);

        cropParams.DraftId = this.draftId;
        cropParams.LayoutId = this.layoutId;
        cropParams.AttributeId = this.attributeId;

        cropParams.CropX = cropInfo.x;
        cropParams.CropY = cropInfo.y;

        cropParams.CropRotate = cropInfo.rotate;

        cropParams.CropWidth = cropInfo.width;
        cropParams.CropHeight = cropInfo.height;
        cropParams.CropScaleX = cropInfo.scaleX;
        cropParams.CropScaleY = cropInfo.scaleY;

        cropParams.CropCropperImageWidth = imageData.naturalWidth;
        cropParams.CropCropperImageHeight = imageData.naturalHeight;

        this.payload.draftId = this.draftId;

        this.parsePayload();

        const payload = cloneDeep(this.payload);
        payload.layouts = payload.layouts.map(r => {
            if (r.uiHelper) {
                r.uiHelper = JSON.stringify(r.uiHelper);
            }
            return r;
        });

        payload.uiHelper = JSON.stringify(payload.uiHelper);

        this.wibbitzOrderService.uploadDraft(this.wibbitzOrderId, this.aditId, payload).subscribe(re => {
            this.wibbitzOrderService.uploadCroppedImage(cropParams).subscribe(
                r => {
                    this.refresh();
                    this.closeModal();
                },
                err => console.error(err),
            );
        },
        err => this.showSnack('error', `An error ocurred ${err}.`),
        );


    }

    rotateLeft() {
        this.angularCropper.cropper.rotate(-45);
    }

    rotateRight() {
        this.angularCropper.cropper.rotate(45);
    }

    zoomOut() {
        this.angularCropper.cropper.zoom(-0.1);
    }

    zoomIn() {
        this.angularCropper.cropper.zoom(0.1);
    }

    flipVertical() {
        const flip = this.angularCropper.cropper.getData().scaleY;
        this.angularCropper.cropper.scaleY(flip * -1);
    }

    flipHorizontal() {
        const flip = this.angularCropper.cropper.getData().scaleX;
        this.angularCropper.cropper.scaleX(flip * -1);
    }

    reset() {
        this.angularCropper.cropper.reset();
    }

    isValidSource() {
        return this.url !== NoImageUrl;
    }

    _uploadImage($event) {
        this.sizeError = false;
        const image: any = new Image();

        if ($event.target.files[0].length) {
            return;
        }

        const file: File = $event.target.files[0];

        const filesize = file.size / 1024 / 1024;
        if (filesize > 10) {
            console.error('file is too big!!');
            this.sizeError = true;
            return;
        }

        const target = this.target;
        const attributeId = this.attributeId;

        this.wibbitzOrderService.uploadRawImage({
            file,
            draftId: this.draftId,
            attributeId: this.attributeId,
            layoutId: this.layoutId,
        }).subscribe((r: any) => {
            setTimeout(() => {
                this.cropperImageSetter();
            }, 500);
            },
            err => console.error(err),
        );
    }

    cropperImageSetter() {
        this.cropperReady = false;
        if (!isNil(this.angularCropper.cropper)) {
            this.angularCropper.cropper.destroy();
            this.url = `/api/wibbitz/getimage?draftId=${this.draftId}&layoutId=${this.layoutId}&attributeId=${this.attributeId}&isOriginal=true&ts=${new Date().getTime()}`;
            this.angularCropper.cropper.replace();
        } else {
            this.url = NoImageUrl;
        }
    }

    parsePayload() {
        this.payload.layouts = this.payload.layouts.map((layout, index) => {

            // rules to to pass uiHelper info  to layouts
            if (layout.name === LayoutIdentifiers.LAT_SCENE_01_PERSON.name) {
                layout.elements = Scene1Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_03.name) {
                layout.elements = Scene2Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_02_EVENTS.name) {
                layout.elements = Scene3Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_04.name) {
                layout.elements = Scene4Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_05.name) {
                layout.elements = Scene5Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_06.name) {
                layout.elements = Scene6Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_07.name) {
                layout.elements = Scene7Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_08.name) {
                layout.elements = Scene8Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_09.name) {
                layout.elements = Scene9Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_10.name) {
                layout.elements = Scene10Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            return layout;
        });
    }

    showSnack(type, message) {
        this.snackBar.openFromComponent(InfoComponent, {
            data: {
                type,
                message,
            },
            duration: 5000,
            panelClass: ['latimes-snackbar'],
        });
    }

    isValidCrop() {
        if (this.url === NoImageUrl || !this.url) {
            return true;
        } else if (isNil(this.copperDetails.detail)) {
            return false;
        }

        return this.copperDetails.detail.height >= this.minHeight && this.copperDetails.detail.width >= this.minWidth;
    }
}

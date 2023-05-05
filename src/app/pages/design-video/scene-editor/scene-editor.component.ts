import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LayoutIdentifiers } from '../constants';
import { ModalMessages } from '../constants/modal-messages';
import isNil from 'lodash/isNil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbMessageModalComponent } from '../ngb-message-modal/ngb-message-modal.component';

@Component({
    selector: 'scene-editor',
    templateUrl: './scene-editor.component.html',
    styleUrls: ['./scene-editor.component.scss'],
})
export class SceneEditorComponent implements OnInit {
    @Input() payload: any = {};
    @Input() wibbitzOrderId;
    @Input() aditId;
    @Input() package;
    @Input() scene: any = {};
    @Input() sceneHelper: any = {};

    @Input() images: any[] = [];
    @Input() printAdImage: string = null;
    @Input() draftId: string;
    @Input() coverSrc: string;

    @Output() uploadImage: EventEmitter<any> = new EventEmitter<any>();

    @Output() update: EventEmitter<any> = new EventEmitter<any>();
    @Output() updateInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() deleteScene: EventEmitter<any> = new EventEmitter<any>();
    @Output() duplicateScene: EventEmitter<any> =  new EventEmitter<any>();

    @Output() refresh: EventEmitter<any> =  new EventEmitter<any>();
    @Output() setCoverSrc: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('preview',{static:true}) preview;
    @ViewChild('sceneEditor',{static:true}) sceneEditor;
    @ViewChild('showDeleteConfirmation',{static:true}) showDeleteConfirmation;

    public LAYOUTS = LayoutIdentifiers;
    public edit = 'info';
    public layoutImage: string = null;

    public target_2 = 'mediaComp_02';
    public target_3 = 'mediaComp_03';
    public target_4 = 'mediaComp_04';
    public target_5 = 'mediaComp_05';
    public target_6 = 'mediaComp_06';
    public change:any;

    constructor (
        private ngbModal: NgbModal,
    ) {
    }

    onSequenceChangeEvent (event) {
      if (event && event.index && this.scene && this.scene.name === this.LAYOUTS.LAT_SCENE_06.name) {
        this.preview.carousel.moveTo(event.index - 1);
      }
    }

    target_1() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_2) {
            return 'mediaComp_01';
        }

        return 'mediaComp';
    }

    ngOnInit() {

    }

    getLayoutId() {
        return this.scene.guid;
    }

    _refresh() {
        this.refresh.emit();
    }

    _updateImage({path, target}) {
        if (this.sceneEditor && this.sceneEditor.nativeElement) {
          this.sceneEditor.nativeElement.scrollIntoView();
        }
        this.scene.elements.find((r: any) => r.id === target).value = path;
        this.update.emit();
    }

    setEdit(mode) {
        this.edit = mode;
    }

    _update() {
        this.update.emit();
    }

    _updateInfo() {
        this.updateInfo.emit();
    }

    deleteConfirm() {
        const modalRef = this.ngbModal.open(NgbMessageModalComponent);
        modalRef.componentInstance.message = ModalMessages.ESCENE_DELETE_CONFIRMATION;
        modalRef.componentInstance.close = () => modalRef.close();
        modalRef.componentInstance.primaryAction = () => {
            this._deleteScene();
            modalRef.close();
        };
        modalRef.componentInstance.secondaryAction = null;
    }

    _deleteScene() {
        this.deleteScene.emit(this.scene.guid);
    }

    _duplicateScene() {
        this.duplicateScene.emit(this.scene.guid);
    }

    isMedia1Available() {
        return this.LAYOUTS[this.scene.name.toUpperCase()].media_1;
    }

    isMedia2Available() {
        return this.LAYOUTS[this.scene.name.toUpperCase()].media_2;
    }

    isMedia3Available() {
        return this.LAYOUTS[this.scene.name.toUpperCase()].media_3;
    }

    isMedia4Available() {
        return this.LAYOUTS[this.scene.name.toUpperCase()].media_4;
    }

    isMedia5Available() {
        return this.LAYOUTS[this.scene.name.toUpperCase()].media_5;
    }

    isMedia6Available() {
        return this.LAYOUTS[this.scene.name.toUpperCase()].media_6;
    }

    getLayoutImage_1() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_2) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_01').value;
        }
        return this.scene.elements.find((r: any) => r.id === 'mediaComp').value;
    }

    getLayoutImage_2() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_2) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_02').value;
        }
    }

    getLayoutImage_3() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_3) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_03').value;
        }
    }

    getLayoutImage_4() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_4) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_04').value;
        }
    }

    getLayoutImage_5() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_5) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_05').value;
        }
    }

    getLayoutImage_6() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_6) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_06').value;
        }
    }

    getLayoutGuid_1() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_2) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_01').guid;
        }
        return this.scene.elements.find((r: any) => r.id === 'mediaComp').guid;
    }

    getLayoutGuid_2() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_2) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_02').guid;
        }
    }

    getLayoutGuid_3() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_3) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_03').guid;
        }
    }

    getLayoutGuid_4() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_4) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_04').guid;
        }
    }

    getLayoutGuid_5() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_5) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_05').guid;
        }
    }

    getLayoutGuid_6() {
        if (this.LAYOUTS[this.scene.name.toUpperCase()].media_6) {
            return this.scene.elements.find((r: any) => r.id === 'mediaComp_06').guid;
        }
    }

    isInfoValid() {
        if (isNil(this.sceneHelper._infoErrors)) {
            return true;
        }

        return !Object.keys(this.sceneHelper._infoErrors).some((key) => this.sceneHelper._infoErrors[key] === true);
    }

    isMediaValid(target) {
        if (isNil(this.sceneHelper._mediaErrors[target])) {
            return true;
        }

        return !this.sceneHelper._mediaErrors[target];

    }

    parsedHelper() {
        if (isNil(this.sceneHelper)) {
            return [];
        }

        if (isNil(this.sceneHelper._infoErrors) || isNil(this.sceneHelper._mediaErrors)) {
            return [];
        }

        return [...Object.entries(this.sceneHelper._infoErrors), ...Object.entries(this.sceneHelper._mediaErrors)]
    }
}

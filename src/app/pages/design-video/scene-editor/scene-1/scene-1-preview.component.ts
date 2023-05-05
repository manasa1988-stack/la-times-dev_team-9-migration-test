/* tslint:disable */
import { OnChanges, OnDestroy, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as isNil from 'lodash/isNil';

import { HttpClient } from '@angular/common/http';
//import { ResponseContentType } from '@angular/http';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { FacebookButton } from 'ngx-sharebuttons/classes';

@Component({
    selector: 'scene-1-preview',
    templateUrl: './scene-1-preview.component.html',
    styleUrls: ['./scene-1-preview.component.scss'],
})
export class Scene1PreviewComponent implements OnInit, OnDestroy {
    @ViewChild('nameBlock',{static:true}) nameBlock;
    @ViewChild('nameBlockContent',{static:true}) nameBlockContent;
    @ViewChild('descriptionBlock',{static:true}) descriptionBlock;
    @ViewChild('descriptionBlockContent',{static:true}) descriptionBlockContent;
    @ViewChild('previewContainer',{static:true}) previewContainer;
    @Output() setCoverSrc: EventEmitter<any> = new EventEmitter<any>();
    @Input() sceneHelper;
    @Input()
    set scene(sc: any) {
        this.loading = true;
        this._sceneHelper = sc;
        if (sc) {
            this.warning = '';

            this.renderInfo(sc);

            setTimeout(() => {
                this.loading = false;
                setTimeout(() => {
                    this.sceneHelper.currentLines.name = Math.ceil(this.nameBlockContent.nativeElement.offsetHeight/this.sceneHelper.lineHeights.name);
                    this.sceneHelper.currentLines.description = Math.ceil(this.descriptionBlockContent.nativeElement.offsetHeight/this.sceneHelper.lineHeights.description);
                    this.onResize();
                }, 100);
            }, 1000);
        }

    }

    public warning = '';
    private _sceneHelper = null;

    refreshComponent() {

    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }

    renderInfo(sc:any) {
        const media = sc.elements.find(r => r.id === 'mediaComp').value;
        this.media = media ? media + `?t=${Date.now()}`: '';
        this.name = sc.elements.find(r => r.id === 'Name').value;
        const rawyear = sc.elements.find(r => r.id === 'Dates').value;
        if (isNil(rawyear)) {
            this.year = [rawyear];
        } else {
            if (!isNil(rawyear.match(/[\r]/g))) {
                const datelines = rawyear.split('\r');
                this.year = [
                    datelines[0],
                    datelines[1],
                ];
            } else {
                this.year = [rawyear];
            }
        }

        const desc = sc.elements.find(r => r.id === 'smallText').value;
        this.description = desc;
        this._description = desc ? desc.split('\n') : [];

        this.age = sc.elements.find(r => r.id === 'Age').value;

        if(!this.sceneHelper.currentLines) {
            Object.assign(this.sceneHelper, {currentLines:{}});
        }
    }

    public loading = true;
    public dash = false;
    public media = '';
    public baseMedia = '';
    public year: string[] = [];
    public age = '';
    public description = '';
    public _description: string[] = [];
    public name = '';
    public previewScale = 0;
    constructor(private ngbModal: NgbModal) {
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
      this.previewScale = Math.min(
        this.previewContainer.nativeElement.offsetWidth / 1228,
        this.previewContainer.nativeElement.offsetHeight / 691
      );
    }

    get previewTransform() {
      return `scale(${this.previewScale})`;
    }
}

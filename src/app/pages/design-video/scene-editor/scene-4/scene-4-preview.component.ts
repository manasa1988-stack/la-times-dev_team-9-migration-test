/* tslint:disable */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';

@Component({
    selector: 'scene-4-preview',
    templateUrl: './scene-4-preview.component.html',
    styleUrls: ['./scene-4-preview.component.scss'],
})
export class Scene4PreviewComponent implements  OnDestroy {
    @ViewChild('description1Block',{static:true}) description1Block;
    @ViewChild('description1BlockContent',{static:true}) description1BlockContent;
    @ViewChild('description2Block',{static:true}) description2Block;
    @ViewChild('description2BlockContent',{static:true}) description2BlockContent;
    @ViewChild('previewContainer',{static:true}) previewContainer;
    @Input() helper
    @Input()
    set scene(sc: any) {
        if (sc) {
            this.loading = true;
            this.sceneHelper = sc;

            this.renderInfo(sc);

        }
    }

    public media1: string;
    public media2: string;

    public text1: string;
    public _text1: string[] = [];
    public text2: string;
    public _text2: string[] = [];

    public warning = '';
    public lock = true;
    private sceneHelper = null;
    public loading = true;
    private media1Subject = new Subject();
    private media2Subject = new Subject();

    public previewScale = 0;
    constructor(private ngbModal: NgbModal) {
    }

    ngOnDestroy() {
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

    renderInfo(sc:any) {
        const media1 = sc.elements.find(r => r.id === 'mediaComp_01').value;
        const media2 = sc.elements.find(r => r.id === 'mediaComp_02').value;
        this.media1 = media1 ? media1 + `?t=${Date.now()}`: '';
        this.media2 = media2 ? media2 + `?t=${Date.now()}`: '';


        const desc1 = sc.elements.find(r => r.id === 'text_01').value;
        this.text1 = desc1;
        this._text1 = desc1 ? desc1.split('\n') : [];

        const desc2 = sc.elements.find(r => r.id === 'text_02').value;
        this.text2 = desc2;
        this._text2 = desc2 ? desc2.split('\n') : [];

        if(!this.helper.currentLines) {
            Object.assign(this.helper, {currentLines:{}});
        }


        setTimeout(() => {
            this.loading = false;
            setTimeout(() => {
                this.helper.currentLines.text1 = Math.ceil(this.description1BlockContent.nativeElement.offsetHeight/this.helper.lineHeights.text1);
                this.helper.currentLines.text2 = Math.ceil(this.description2BlockContent.nativeElement.offsetHeight/this.helper.lineHeights.text2);
                this.onResize();
            }, 100);
        }, 1000);
    }

}

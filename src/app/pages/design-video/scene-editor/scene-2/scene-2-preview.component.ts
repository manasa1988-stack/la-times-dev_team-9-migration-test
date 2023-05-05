/* tslint:disable */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';

@Component({
    selector: 'scene-2-preview',
    templateUrl: './scene-2-preview.component.html',
    styleUrls: ['./scene-2-preview.component.scss'],
})
export class Scene2PreviewComponent implements  OnInit, OnDestroy {
    @ViewChild('previewContainer',{static:true}) previewContainer;
    @ViewChild('descriptionBlock',{static:true}) descriptionBlock;
    @ViewChild('descriptionBlockContent',{static:true}) descriptionBlockContent;
    @Input() helper
    @Input()
    set scene(sc: any) {
        this.loading = true;
        this.sceneHelper = sc;
        if (sc) {
            this.warning = '';
            this.renderInfo(sc);
        }
    }

    public media: string;
    public date: string;
    public description: string;
    public _description: string[] = [];
    public previewScale = 0;
    constructor(private ngbModal: NgbModal) {
    }

    public warning = '';
    public lock = true;
    private sceneHelper = null;
    public loading = true;
    private media1Subject = new Subject();

    ngOnDestroy() {
    }

    ngOnInit() {
    }

    renderInfo(sc:any) {
        const media = sc.elements.find(r => r.id === 'mediaComp').value;
        this.media = media ? media + `?t=${Date.now()}`: '';
        const desc = sc.elements.find(r => r.id === 'textBoxWhite').value;
        this.description = desc;
        this._description = desc ? desc.split('\n') : [];
        this.date = sc.elements.find(r => r.id === 'textBoxBlack').value;

        if(!this.helper.currentLines) {
          Object.assign(this.helper, {currentLines:{}});
        }

        setTimeout(() => {
            this.loading = false;
            setTimeout(() => {
                this.helper.currentLines.description = Math.ceil(this.descriptionBlockContent.nativeElement.offsetHeight/this.helper.lineHeights.description);
                this.onResize();
            }, 100);
        }, 1000);
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

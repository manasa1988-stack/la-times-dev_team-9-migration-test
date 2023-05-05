/* tslint:disable */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';

@Component({
    selector: 'scene-3-preview',
    templateUrl: './scene-3-preview.component.html',
    styleUrls: ['./scene-3-preview.component.scss'],
})
export class Scene3PreviewComponent implements  OnInit, OnDestroy {
    @ViewChild('previewContainer',{static:true}) previewContainer;
    @ViewChild('descriptionBlock',{static:true}) descriptionBlock;
    @ViewChild('descriptionBlockContent',{static:true}) descriptionBlockContent;
    @Input() helper
    @Input()
    set scene(sc: any) {
        this.loading = true;
        this.sceneHelper = sc;
        if (sc) {
            const media = sc.elements.find(r => r.id === 'mediaComp').value;

            this.renderInfo(sc);
        }
    }

    public date = '';
    public baseMedia = '';
    public description = '';
    public _description: string[] = [];
    public media = '';

    public warning = '';
    public lock = true;
    private sceneHelper = null;
    public loading = true;
    private media1Subject = new Subject();

    public previewScale = 0;
    constructor(private ngbModal: NgbModal) {
    }

    ngOnDestroy() {
    }

    ngOnInit() {
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
        const media = sc.elements.find(r => r.id === 'mediaComp').value;
        this.media = media ? media + `?t=${Date.now()}`: '';

        const desc = sc.elements.find(r => r.id === 'mainText').value;
        this.description = desc;
        this._description = desc ? desc.split('\n') : [];

        this.date = sc.elements.find(r => r.id === 'boxText').value;

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


}

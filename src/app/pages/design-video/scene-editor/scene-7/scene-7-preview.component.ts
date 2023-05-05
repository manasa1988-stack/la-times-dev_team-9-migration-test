/* tslint:disable */
import { Component, Input, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'scene-7-preview',
    templateUrl: './scene-7-preview.component.html',
    styleUrls: ['./scene-7-preview.component.scss'],
})
export class Scene7PreviewComponent implements OnInit, OnDestroy {
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
    public year: string;
    public description: string;
    public _description: string[] = [];
    public previewScale = 0;
    constructor(private ngbModal: NgbModal) {}

    public warning = '';
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
        const desc = sc.elements.find(r => r.id === 'text_01').value;
        this.description = desc;
        this._description = desc ? desc.split('\n') : [];
        this.year = sc.elements.find(r => r.id === 'boxText').value;
        setTimeout(() => {
            this.loading = false;
            setTimeout(() => {
                this.helper.currentLines.text = Math.ceil(this.descriptionBlockContent.nativeElement.offsetHeight/this.helper.lineHeights.text);
                this.onResize();
            } ,100);
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

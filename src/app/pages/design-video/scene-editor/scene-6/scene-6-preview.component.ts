/* tslint:disable */
import { ViewChild } from '@angular/core';
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NguCarousel, NguCarouselStore } from '@ngu/carousel';
import { Subject } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';

@Component({
    selector: 'scene-6-preview',
    templateUrl: './scene-6-preview.component.html',
    styleUrls: ['./scene-6-preview.component.scss'],
})
export class Scene6PreviewComponent implements OnInit, OnDestroy {
    @ViewChild('previewContainer1',{static:true}) previewContainer1;
    @ViewChild('previewContainer2',{static:true}) previewContainer2;
    @ViewChild('previewContainer3',{static:true}) previewContainer3;
    @ViewChild('previewContainer4',{static:true}) previewContainer4;
    @ViewChild('previewContainer5',{static:true}) previewContainer5;
    @ViewChild('previewContainer6',{static:true}) previewContainer6;
    // @ViewChild('slides') carousel: NguCarousel;
    @ViewChild('descriptionBlock',{static:true}) descriptionBlock;
    @ViewChild('descriptionBlockContent',{static:true}) descriptionBlockContent;
    @Input() helper
    @Input()
    set scene(sc: any) {
        if (sc) {
            this.loading = true;
            this.sceneHelper = sc;

            this.renderInfo(sc);

        }
    }

    public sceneBuffer: any;

    public media1: string;
    public media2: string;
    public media3: string;
    public media4: string;
    public media5: string;
    public media6: string;
    public text1: string;
    public _text1: string[] = [];
    public name1: string;
    public name2: string;
    public name3: string;
    public name4: string;
    public name5: string;
    public name6: string;

    public currentSlide = 0;
    public token: string;

    private sceneHelper = null;
    public loading = true;

    public carouselTileTwo  =  {
        grid:  {  xs:  1,  sm:  1,  md:  1,  lg:  1,  all:  0  },
        speed:  200,
        slide:  1,
        animation:  'lazy',
        point:  {
          visible:  true,
        },
        touch:  true,
        easing:  'ease'
    };

    public previewScale = 0;
    constructor(private ngbModal: NgbModal) {
    }

    ngOnInit() {
        // this.token = this.carousel.data.token;
    }

    ngOnDestroy() {
    }

    renderInfo(sc:any) {
        const media1 = sc.elements.find(r => r.id === 'mediaComp_01').value;
        const media2 = sc.elements.find(r => r.id === 'mediaComp_02').value;
        const media3 = sc.elements.find(r => r.id === 'mediaComp_03').value;
        const media4 = sc.elements.find(r => r.id === 'mediaComp_04').value;
        const media5 = sc.elements.find(r => r.id === 'mediaComp_05').value;
        const media6 = sc.elements.find(r => r.id === 'mediaComp_06').value;
        this.media1 = media1 ? media1 + `?t=${Date.now()}`: '';
        this.media2 = media2 ? media2 + `?t=${Date.now()}`: '';
        this.media3 = media3 ? media3 + `?t=${Date.now()}`: '';
        this.media4 = media4 ? media4 + `?t=${Date.now()}`: '';
        this.media5 = media5 ? media5 + `?t=${Date.now()}`: '';
        this.media6 = media6 ? media6 + `?t=${Date.now()}`: '';

        this.sceneBuffer = sc;
        const desc1 = sc.elements.find(r => r.id === 'text_01').value;
        this.text1 = desc1;
        this._text1 = desc1 ? desc1.split('\n') : [];

        this.name1 = sc.elements.find(r => r.id === 'name_01').value;
        this.name2 = sc.elements.find(r => r.id === 'name_02').value;
        this.name3 = sc.elements.find(r => r.id === 'name_03').value;
        this.name4 = sc.elements.find(r => r.id === 'name_04').value;
        this.name5 = sc.elements.find(r => r.id === 'name_05').value;
        this.name6 = sc.elements.find(r => r.id === 'name_06').value;
        setTimeout(() => {
            this.loading = false;
            setTimeout(() => {
                this.helper.currentLines.description_1 = Math.ceil(this.descriptionBlockContent.nativeElement.offsetHeight/this.helper.lineHeights.description_1);
                this.onResize();
            }, 100);
        }, 1000);
    }


    moveTo(slideIndex) {
        // this.carousel.moveTo(slideIndex, false);
    }

    onmoveFn(event) {
        this.currentSlide = event.currentSlide;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
      this.previewScale = Math.min(
        this.previewContainer1.nativeElement.offsetWidth / 1228,
        this.previewContainer1.nativeElement.offsetHeight / 691
      );
    }

    get previewTransform() {
      return `scale(${this.previewScale})`;
    }

}

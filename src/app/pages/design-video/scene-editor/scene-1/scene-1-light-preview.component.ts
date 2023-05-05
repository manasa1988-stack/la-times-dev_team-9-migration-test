import { OnChanges, OnDestroy, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as isNil from 'lodash/isNil';

import { HttpClient } from '@angular/common/http';
//import { ResponseContentType } from '@angular/http';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
// import { environment } from '../../../../../environments/environment.prod';
import { WibbitzService } from '../../../../shared/services';

// import * as html2canvas from 'html2canvas';
@Component({
    selector: 'scene-1-light-preview',
    templateUrl: './scene-1-light-preview.component.html',
    styleUrls: ['./scene-1-light-preview.component.scss'],
})
export class Scene1LightPreviewComponent implements OnInit, OnDestroy {
    @ViewChild('source',{static:true}) source;
    @ViewChild('base',{static:true}) base;
    @ViewChild('canvas',{static:true}) canvas;
    @ViewChild('previewContainer',{static:true}) previewContainer;
    @Output() renderReady: EventEmitter<any> = new EventEmitter<any>();
    public info: any;
    public previewScale = 0;

    constructor(private wibbitzService: WibbitzService) {
    }

    private media1Subject = new Subject();

    ngOnDestroy() {
        this.media1Subject.unsubscribe();
    }

    startRendering() {
        this.base.nativeElement.src = '';
        const media =  this.info.media;
        this.media1Subject.subscribe(() => {
            this.renderInfo();
        });

        this.base.nativeElement.src = media + `?t=${Date.now()}`;
    }

    ngOnInit() {
      setTimeout(() => { this.onResize(); }, 1000);
    }

    getDataUrlFromCanvas(canvas) {
      const dataUrl = canvas.toDataURL();

      // Free canvas memory
      canvas.width = 0;
      canvas.height = 0;

      return dataUrl;
    }

    renderInfo() {
        this.name = this.info.name;
        const rawyear = this.info.dates;
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

        const desc = this.info.smallText;
        this.description = desc;

        this.age = this.info.age;

        setTimeout(() => {
            /* html2canvas(this.source.nativeElement, {
                ignoreElements: (node) => node.nodeName === 'IFRAME'
              })
              .then(canvas => {
                  let file = null;
                  this.srcToFile(
                      canvas.toDataURL(),
                      'cover',
                      'data:image/png;base64',
                  ).then((f)=>{
                      file = f;
                      this.wibbitzService.uploadVideoCover(this.wibbitzVideoDraftId, file).subscribe((r) => {
                  },
                  err => console.error(err),
                  );
                  });
              })
              .catch(function (error) {
                  console.error(error);
              });
              */
        }, 1000);
    }

    srcToFile(src, fileName, mimeType){
        return (fetch(src)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], fileName, {type:mimeType});})
        );
    }

    public media = '';
    public year: string[] = [];
    public age = '';
    public description = '';
    public wibbitzVideoDraftId = null;
    public name = '';

    onImageLoad() {
        this.media = this.getImageFromImg();
        this.media1Subject.next();
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

    getImageFromImg() {
        this.canvas.nativeElement.width  = this.base.nativeElement.naturalWidth;
        this.canvas.nativeElement.height = this.base.nativeElement.naturalHeight;

        const context = this.canvas.nativeElement.getContext('2d');
        context.drawImage(this.base.nativeElement, 0, 0);
        return this.getDataUrlFromCanvas(this.canvas.nativeElement);
    }
}

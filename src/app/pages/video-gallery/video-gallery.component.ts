import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { environment } from '../../../environments/environment';
import { WibbitzService } from '../../shared/services/wibbitz-video.service';
import { YouTubeThumbnailBase, YouTubeThumbnailTrail } from './constants/youtubebase.constant';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { PageEvent } from "@angular/material";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
    selector: 'video-gallery',
    templateUrl: './video-gallery.component.html',
    styleUrls: ['./video-gallery.component.scss'],
})
export class VideoGalleryComponent implements OnInit {

    pageEvent: PageEvent;

    public filter: any = {
        text: '',
        pageNumber: 1,
        pageSize: 25,
        productId:0
    };

    public videoElements: any = {
        PageNumber: 1,
        PageSize: 25,
        TotalRecords: 0,
        Records: [],
    };

    public youTubeThumbnailBase = YouTubeThumbnailBase;
    public youTubeThumbnailTrail = YouTubeThumbnailTrail;
    public assetsHostUrl :string; //environment.assetsHost;

    constructor(
        private ngbModal: NgbModal,
        private sanitize: DomSanitizer,
        private videoService: WibbitzService,
        private _configSvc: RuntimeConfigLoaderService,
    ) {
    }

    updateSearch(resetPageNumber?: boolean) {
        if (resetPageNumber) {
          this.filter.pageNumber = 1;
          this.videoElements.PageNumber = 1;
        }
        this.videoService.getVideoList(this.filter).subscribe((result: any) => {
            this.videoElements = result;
        });
    }

    ngOnInit() {
        this.assetsHostUrl =this._configSvc.getConfigObjectKey("assetsHost");
        this.updateSearch();
    }

    getBackground(image) {
        return this.sanitize.bypassSecurityTrustStyle(`url('${image}')`);
    }

    openModal(info) {
        const dialogRefPopup = this.ngbModal.open(VideoModalComponent, {
            backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered la-video-class'
        });
        dialogRefPopup.componentInstance.info = info;
    }

    updateIndex(pageEvent) {
        this.filter.pageNumber = pageEvent.pageIndex + 1;
        this.updateSearch();
    }
}

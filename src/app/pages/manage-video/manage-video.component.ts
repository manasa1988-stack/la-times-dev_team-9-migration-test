import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { environment } from '../../../environments/environment';
import { WibbitzService } from '../../shared/services/wibbitz-video.service';
import { PageEvent } from "@angular/material";
import { VideoShareModalComponent } from '../design-video/video-share-modal.componet';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder, IOrderItem } from '../../models/order-item.model';
import { VideoPlayerComponent } from '../design-video/video-player.component';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { CommonModule } from '@angular/common';  
@Component({
    selector: 'manage-video',
    templateUrl: './manage-video.component.html',
    styleUrls: ['./manage-video.component.scss'],
})
export class ManageVideoComponent implements OnInit {

    pageEvent: PageEvent;

    public assetsHostUrl :string;// = environment.assetsHost;
    public videoOrder: IOrder;
    public videoItem: IOrderItem;
    public draftId: string;
    public loading = false;

    constructor(
        private route: ActivatedRoute,
        private ngbModal: NgbModal,
        private sanitize: DomSanitizer,
        private videoService: WibbitzService,
        private _configSvc: RuntimeConfigLoaderService,
        private router: Router
    ) {
    }

    ngOnInit() {
       this.assetsHostUrl = this._configSvc.getConfigObjectKey("assetsHost");
        //this.updateSearch();
        if(this.route.queryParams){
            this.route.queryParams.subscribe(params => {
                let draftId = this.route.snapshot.paramMap.get('draftId');
                if(draftId) {
                    this.loading = true;
                    this.videoService.getVideoOrder(draftId)
                        .subscribe(
                            order => { 
                                this.videoOrder = order;
                                this.videoItem = this.videoOrder.OrderItems.find(item => item.IsWibbitzProduct === true);
                                this.loading = false;
                            },
                            (error) => {
                                this.loading = false;
                                });
                }
            });
        }
    }

    toggleVideoOnGallery(selected: boolean) {
        this.videoService.toggleVideoOnGallery(!selected, this.videoOrder.AditId).subscribe(
          re => console.log('Video visibility toggled'),
          err => console.error(err),
        );
      }

    navigateToEditVideo(){
        this.router.navigate([`drafts/${this.videoOrder.AditId}/design-video`],{ queryParams: { videodraftid: this.videoItem.VideoDraftId , bu: this.videoItem.VideoBU, productid: this.videoItem.VideoProductId, editvideo: true, cses: true } });
    }
    
    playVideo(videoUrl){
    let dialogRefPopup = this.ngbModal.open(VideoPlayerComponent, {
        backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.videoUrl = videoUrl;
    }

    openShareModal(orderLineItem, order) {
        const MockOrder = {
          orderLineItem: {
            WibbitzVideoFileShareLink: 'https://assets-adss.caltimesqa.com/assets/wibbitz/videos/02ae486640a245af8cafc45cb1f8ad0e.mp4',
            YoutubeLink: 'pVPnJ7fje80',
            IsYoutubePublic: false,
            VideoDraftId: 'dda1a2b2-4fb1-47e7-b2cc-f3bf10a0a216',
          },
          order: {
            IsVideoEditDeadLinePassed: false,
          },
        };
    
        const dialogRefPopup = this.ngbModal.open(VideoShareModalComponent, {
          backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
        });
        dialogRefPopup.componentInstance.info = {orderLineItem, order};
        // dialogRefPopup.componentInstance.info = MockOrder;
        dialogRefPopup.componentInstance.update.subscribe((r: boolean) => {
          this.videoOrder.OrderItems.find(item => item.IsWibbitzProduct === true).IsYoutubePublic = r;
        });
      }
}

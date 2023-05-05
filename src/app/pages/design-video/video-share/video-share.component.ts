import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { WibbitzService } from '../../../shared/services/wibbitz-video.service';
@Component({
    selector: 'video-share',
    templateUrl: './video-share.component.html',
    styleUrls: ['./video-share.component.scss'],
})
export class VideoShareComponent implements OnInit {
    @Output() update: EventEmitter<any> = new EventEmitter<any>();
    @Input() set _orderLineItem(value) {
        if (value) {
            const {orderLineItem, order} = value;
            this.adssUrl = orderLineItem.WibbitzVideoFileShareLink;
            this.youtubeSegment = orderLineItem.YoutubeLink;
            this.isPublic = orderLineItem.IsYoutubePublic;
            this.videoDraftId = orderLineItem.VideoDraftId;
            this.passedDeadline = order.IsVideoEditDeadLinePassed;
        }
    }

    public apiEndPointUrl = '/api/wibbitz/download?draftId='
    public youtubeBaseUrl = 'https://youtu.be';
    public adssUrl = '';
    public youtubeSegment = '';
    public isPublic = true;
    public videoDraftId = '';
    public passedDeadline = false;
    public isDownloading = false;
    public copy = false;

    isFirefox() {
        return /Gecko\s|Firefox\//i.test(window.navigator.userAgent);
    }

    isIosChrome() {
        return navigator.userAgent.match('CriOS') || navigator.userAgent.match('FxiOS');
    }

    constructor( private wibbitzService: WibbitzService) {
    }

    ngOnInit() {
    }

    isWibbitzVideoReady() {
        return true;
    }

    download() {
        this.isDownloading = true;
        this.wibbitzService.downloadTrigger(this.videoDraftId).subscribe(
            r => {
                this.triggetDownload(r);
            },
            err => {
                console.error('Download counter trigger failed', err);
                this.isDownloading = false;
            }
        );
    }

    triggetDownload(r) {
        const url = window.URL.createObjectURL(r);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Tribute_${Date.now()}.mp4`;
        link.click();

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(r);
        }
        else {
            window.URL.revokeObjectURL(url);
        }

        this.isDownloading = false;
    }

    ctc() {
        this.copyToClipboard(`${this.youtubeBaseUrl}/${this.youtubeSegment}`);
        ​​​​​​​if(!this.copy) {
            this.copy = true;
            setTimeout(() => this.copy = false, 1001);
        }​
    }

    copyToClipboard(content: string) {
        const nav: any = window.navigator;
        if (!nav.clipboard) {​​​​​​​​
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = content;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
            return;
        }​​​​​​​​

        nav.clipboard.writeText(content);
    }​​​​​​​​

    makePublic() {
        this.wibbitzService.setVideoToPublic(this.videoDraftId).subscribe(r => {
                this.isPublic = true;
                this.update.emit(true);
            },
            err => {
                this.update.emit(false);
            },
        );
    }


}

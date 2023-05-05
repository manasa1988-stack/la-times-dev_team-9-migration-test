import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'video-frame',
    templateUrl: './video-frame.component.html',
    styleUrls: ['./video-frame.component.scss'],
})
export class VideoFrameComponent {
    @Input() set _info(value) {
        if (value) {
            const {Name, YoutubeLink} = value;
            this.name = Name;
            this.youtubeSegment = YoutubeLink;
        }
    }

    public name;
    public youtubeSegment;

    constructor(private sanitizer: DomSanitizer) {

    }

    bypassUrl(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoGalleryRoutingModule } from './video-gallery.routing.module';
import { FormsModule } from '@angular/forms';
import { VideoGalleryComponent } from './video-gallery.component';
import { MaterialModule } from '../../material.module';
import { Platform } from '@angular/cdk/platform';
import { VideoFrameComponent } from './video-modal/video-frame/video-frame.component';
import { VideoModalComponent } from './video-modal/video-modal.component';

@NgModule({
    imports: [
        CommonModule,
        VideoGalleryRoutingModule,
        MaterialModule,
        FormsModule,
    ],
    declarations: [
        VideoGalleryComponent,
        VideoFrameComponent,
        VideoModalComponent,
    ],
    providers: [
        Platform,
    ],
    entryComponents: [
        VideoModalComponent,
    ],
    exports: [
    ]
})
export class VideoGalleryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignVideoComponent } from './design-video.component';
import { DesignVideoRoutingModule } from './design-video.routing.module';
import { SceneSelectorComponent } from './scene-selector/scene-selector.component';
import { MaterialModule } from '../../material.module';
import { SceneEditorComponent } from './scene-editor/scene-editor.component';
import { FormsModule } from '@angular/forms';
//import { MessageModalComponent } from './message-modal/message-modal.component';
import { CropperModalComponent } from './cropper-modal/cropper-modal.component';
import { ScenePickerComponent } from './scene-picker/scene-picker.component';
import { SceneReordererComponent } from './scene-reorderer/scene-reorderer.component';
import { TrackPickerComponent } from './track-picker/track-picker.component';
import { SourcePipe } from '../../filters/source.pipe';
import { GalleryPanelComponent } from './gallery-panel/gallery-panel.component';
import { Scene1Component } from './scene-editor/scene-1/scene-1.component';
import { Scene2Component } from './scene-editor/scene-2/scene-2.component';
import { Scene3Component } from './scene-editor/scene-3/scene-3.component';
import { Scene4Component } from './scene-editor/scene-4/scene-4.component';
import { Scene5Component } from './scene-editor/scene-5/scene-5.component';
import { Scene6Component } from './scene-editor/scene-6/scene-6.component';
import { Scene8Component } from './scene-editor/scene-8/scene-8.component';
import { Scene9Component } from './scene-editor/scene-9/scene-9.component';
import { Scene10Component } from './scene-editor/scene-10/scene-10.component';
import { ImageCropperModule } from 'ngx-img-cropper';
import { DragulaService, DragulaModule } from 'ng2-dragula';
import { Scene1PreviewComponent } from './scene-editor/scene-1/scene-1-preview.component';
import { Scene2PreviewComponent } from './scene-editor/scene-2/scene-2-preview.component';
import { Scene3PreviewComponent } from './scene-editor/scene-3/scene-3-preview.component';
import { Scene4PreviewComponent } from './scene-editor/scene-4/scene-4-preview.component';
import { Scene9PreviewComponent } from './scene-editor/scene-9/scene-9-preview.component';
import { Scene10PreviewComponent } from './scene-editor/scene-10/scene-10-preview.component';
import { Scene7PreviewComponent } from './scene-editor/scene-7/scene-7-preview.component';
import { Scene8PreviewComponent } from './scene-editor/scene-8/scene-8-preview.component';
import { Scene5PreviewComponent } from './scene-editor/scene-5/scene-5-preview.component';
import { Scene6PreviewComponent } from './scene-editor/scene-6/scene-6-preview.component';
import { Scene1LightPreviewComponent } from './scene-editor/scene-1/scene-1-light-preview.component';
import { Scene7Component } from './scene-editor/scene-7/scene-7.component';
import { FixedMessageComponent } from './fixed-message/fixed-message.component';
import { InfoComponent } from './info-component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { CropperEditorComponent } from './cropper-modal/cropper-editor/cropper-editor.component';
import { VideoShareComponent } from './video-share/video-share.component';
import { ShareButtonModule, ShareButtonsModule, ShareDirectiveModule } from 'ngx-sharebuttons';
import { Platform } from '@angular/cdk/platform';
import { VideoShareModalComponent } from './video-share-modal.componet';
import { ScrollableDirective } from './directives/scrollable.directive';
import { SceneReportComponent } from './scene-editor/scene-report/scene-report.component';
import { NgbMessageModalComponent } from './ngb-message-modal/ngb-message-modal.component';
import { TrackPickerModalComponent } from './track-picker/track-picker-modal/track-picker-modal.component';
import { NguCarouselModule } from '@ngu/carousel';
import { PreviewModalComponent } from './scene-editor/preview-modal/preview-modal.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MessageModalModule } from './message-modal/message-modal.module';
import { MessageModalComponent } from './message-modal/message-modal.component';

@NgModule({
    imports: [
        CommonModule,
        DesignVideoRoutingModule,
        MaterialModule,
        FormsModule,
        ImageCropperModule,
        DragulaModule,
        AngularCropperjsModule,
        ShareButtonModule.forRoot(), ShareButtonsModule.forRoot(), ShareDirectiveModule.forRoot(),
        NguCarouselModule,
        SlickCarouselModule,
        MessageModalModule,
    ],
    declarations: [
        DesignVideoComponent,
        SceneSelectorComponent,
        SceneEditorComponent,
        ScenePickerComponent,
        SceneReordererComponent,
        TrackPickerComponent,
        SourcePipe,
        GalleryPanelComponent,
        MessageModalComponent,
        NgbMessageModalComponent,
        TrackPickerModalComponent,


        Scene1Component,
        Scene2Component,
        Scene3Component,
        Scene4Component,
        Scene5Component,
        Scene6Component,
        Scene7Component,
        Scene8Component,
        Scene9Component,
        Scene10Component,

        Scene1PreviewComponent,
        Scene2PreviewComponent,
        Scene3PreviewComponent,
        Scene4PreviewComponent,
        Scene5PreviewComponent,
        Scene6PreviewComponent,
        Scene7PreviewComponent,
        Scene8PreviewComponent,
        Scene9PreviewComponent,
        Scene10PreviewComponent,
        Scene1LightPreviewComponent,

        FixedMessageComponent,
        InfoComponent,
        CropperModalComponent,
        CropperEditorComponent,
        VideoShareComponent,
        VideoShareModalComponent,
        ScrollableDirective,
        SceneReportComponent,
        PreviewModalComponent,
    ],
    providers: [
        DragulaService,
        Platform,
    ],
    entryComponents: [
        InfoComponent,
        NgbMessageModalComponent,
        TrackPickerModalComponent,
        CropperEditorComponent,
        ScenePickerComponent,
        SceneReordererComponent,
        PreviewModalComponent,
    ],
    exports: [
        MessageModalModule,
        NgbMessageModalComponent,
        VideoShareModalComponent,
        TrackPickerModalComponent,
        CropperEditorComponent,
        PreviewModalComponent,
        Scene1LightPreviewComponent,
    ]
})
export class DesignVideoModule { }

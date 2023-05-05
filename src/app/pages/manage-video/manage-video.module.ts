import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageVideoRoutingModule } from './manage-video.routing.module';
import { FormsModule } from '@angular/forms';
import { ManageVideoComponent } from './manage-video.component';
import { MaterialModule } from '../../material.module';
import { Platform } from '@angular/cdk/platform';

@NgModule({
    imports: [
        CommonModule,
        ManageVideoRoutingModule,
        MaterialModule,
        FormsModule,
    ],
    declarations: [
        ManageVideoComponent
    ],
    providers: [
        Platform,
    ],
    entryComponents: [
        
    ],
    exports: [
    ]
})
export class ManageVideoModule { }

/* tslint:disable */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import isNil from 'lodash/isNil';
import { Subject } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';


/* LAT_scene_04 */
@Component({
    selector: 'scene-4',
    templateUrl: './scene-4.component.html',
    styleUrls: ['../scenes.scss'],
})
export class Scene4Component implements OnInit {
    @Input() sceneHelper;
    @Output() update: EventEmitter<any> = new EventEmitter<any>();
    @Output() updateInfo: EventEmitter<any> = new EventEmitter<any>();

    public regexp = /(\r\n|\n|\r)/gm;
    private modelChanged = new Subject();

    constructor() {
        this.modelChanged.pipe(debounceTime(1500),distinctUntilChanged())
        .subscribe(() => {
            this.updateInfo.emit();
        })
    }

    _updateInfo() {
        this.modelChanged.next();
    }

    ngOnInit() {
        this._validate();
    }

    _update() {
        this.update.emit();
    }

    _validate() {
        if (isNil(this.sceneHelper._infoErrors)) {
            Object.assign(
                this.sceneHelper,
                {
                    _infoErrors: {
                        rightText: false,
                        leftTezt: false,
                    },
                },
            );
        }

        this.sceneHelper.model.rightText = this.sceneHelper.model.rightText.replace(this.regexp,'');
        this.sceneHelper.model.leftText = this.sceneHelper.model.leftText.replace(this.regexp,'');

        this.sceneHelper._infoErrors.rightText = this.sceneHelper.model.rightText.trim('\r').trim().trim('\r') === '';
        this.sceneHelper._infoErrors.leftText = this.sceneHelper.model.leftText.trim('\r').trim().trim('\r') === '';
    }

    validate(event, field) {
        if (isNil(this.sceneHelper._infoErrors)) {
            Object.assign(
                this.sceneHelper,
                {
                    _infoErrors: {},
                },
            );
        }

        this.sceneHelper._infoErrors[field] = event.trim('\r').trim().trim('\r') === '';
        this._updateInfo();
    }
}

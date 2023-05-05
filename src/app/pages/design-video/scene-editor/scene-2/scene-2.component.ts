import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import isNil from 'lodash/isNil';
import { Subject ,  timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
    selector: 'scene-2',
    templateUrl: './scene-2.component.html',
    styleUrls: ['../scenes.scss'],
})
export class Scene2Component implements OnInit {
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
                        description: false,
                    },
                },
            );
        }

        this.sceneHelper.model.description = this.sceneHelper.model.description.replace(this.regexp,'');
        this.sceneHelper._infoErrors.description = this.sceneHelper.model.description.trim('\r').trim().trim('\r') === '';
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

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import isNil from 'lodash/isNil';
import { Subject ,  timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
    selector: 'scene-1',
    templateUrl: './scene-1.component.html',
    styleUrls: ['../scenes.scss'],
})
export class Scene1Component implements OnInit, OnDestroy {
    @Input() sceneHelper;
    @Input() package;
    @Output() update: EventEmitter<any> = new EventEmitter<any>();
    @Output() updateInfo: EventEmitter<any> = new EventEmitter<any>();

    public updateCount = 0;
    public regexp = /(\r\n|\n|\r)/gm;
    private modelChanged = new Subject();

    constructor() {
        this.modelChanged.pipe(debounceTime(1500),distinctUntilChanged())
        .subscribe(() => {
            this.updateInfo.emit();
        })
    }
   
    ngOnInit() {
        this._validate();
    }

    ngOnDestroy() {
        this.modelChanged.unsubscribe();
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
                        firstName: false,
                        lastName: false,
                    },
                },
            );
        }

        this.sceneHelper._infoErrors.firstName = this.sceneHelper.model.firstName.trim('\r').trim().trim('\r') === '';
        this.sceneHelper._infoErrors.lastName = this.sceneHelper.model.lastName.trim('\r').trim().trim('\r') === '';
        this.sceneHelper.model.description = this.sceneHelper.model.description.replace(this.regexp,'');
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

    _updateInfo() {
        this.modelChanged.next();
    }

    clearDate() {
        this.sceneHelper.model.deathDate = '';
        this.sceneHelper.model.birthDate = '';
        this._updateInfo();
    }
}

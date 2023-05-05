import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';
import * as isNil from 'lodash/isNil';

@Component({
    selector: 'scene-selector',
    templateUrl: './scene-selector.component.html',
    styleUrls: ['./scene-selector.component.scss'],
})
export class SceneSelectorComponent implements OnInit {
    @ViewChild('slickModal',{static:true}) slickModal;
    @ViewChild('scrollWindow',{static:true}) scrollWindow;
    @ViewChild('scrollStrip',{static:true}) scrollStrip;
    @ViewChild('slider',{static:true}) slider;
    @Input()
    set scenes(sc: any[]) {
        this._scenes = sc;
        this.first = sc[0];
        const c = cloneDeep(sc);
        c.shift();
        c.push({
          addItem: true
        });
        this.sortable = c;
    }

    public _scenes = [];

    @Input() uiHelpers;

    first: any;

    @Input() selectedScene: number;
    @Output() selectScene: EventEmitter<any> = new EventEmitter<any>();
    @Output() updateScenes: EventEmitter<any> = new EventEmitter<any>();
    @Output() addScene: EventEmitter<any> = new EventEmitter<any>();
    @Output() reorderScene: EventEmitter<any> = new EventEmitter<any>();

    public sortable: any[] = [];
    public stripCursor = 0;
    public relativeStripCursor = 0;
    public scrollPadding = 20;

    constructor () {
    }

    slideConfig = {
      "swipeToSlide": false,
      "touchMove": false,
      "infinite": false,
      "slidesToShow": 5,
      "slidesToScroll": 5,
      "draggable": false,
      "center": false,
      "nextArrow": `
        <button class="scroll-button desktop">
          <i class="material-icons" ngbtooltip="Help">chevron_right</i>
        </button>`,
      "prevArrow": `
        <button class="scroll-button desktop">
          <i class="material-icons" ngbtooltip="Help">chevron_left</i>
        </button>`,
      "responsive": [
        {
          "breakpoint": 980,
          "settings": {
            "slidesToShow": 4,
            "slidesToScroll": 4
          }
        },
        {
          "breakpoint": 750,
          "settings": {
            "slidesToShow": 3,
            "slidesToScroll": 3
          }
        },
        {
          "breakpoint": 540,
          "settings": {
            "slidesToShow": 2,
            "slidesToScroll": 2
          }
        }
      ]
    };

    ngOnInit() {
        this.updateScenes.emit('example');
    }

    add() {
        this.addScene.emit();
    }

    reorder() {
        this.reorderScene.emit();
    }

    select(index) {
        this.selectScene.emit(index);
        this.moveToScope(index);
    }

    moveToLast() {
        const target = this._scenes.length - 1;
        this.selectScene.emit(target);
        this.moveToScope(target);
    }

    isValidScene(index) {
        if (isNil(this.uiHelpers[index]._infoErrors)) {
            Object.assign(this.uiHelpers[index], {_infoErrors: {}});
        }

        if (isNil(this.uiHelpers[index]._mediaErrors)) {
            Object.assign(this.uiHelpers[index], {_mediaErrors: {}});
        }

        const errors = { ...this.uiHelpers[index]._infoErrors, ...this.uiHelpers[index]._mediaErrors};

        return !Object.keys(errors).some((key) => errors[key]);
    }

    moveToScope(i) {
      this.slickModal.slickGoTo(i);
    }
}

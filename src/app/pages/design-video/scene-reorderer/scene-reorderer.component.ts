import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
    selector: 'scene-reorderer',
    templateUrl: './scene-reorderer.component.html',
    styleUrls: ['./scene-reorderer.component.scss'],
})
export class SceneReordererComponent implements OnInit {
    @ViewChild('dialog',{static:true}) dialog;
    public set: any[] = [];
    public _reorderScenes;

    public type = '';
    public selectedLayouts: any[] =  [];
    public dialogRef;

    constructor (private dragulaService: DragulaService, private modal: NgbModal) {

        dragulaService.destroy(this.MANY_ITEMS);

        dragulaService.createGroup(this.MANY_ITEMS, {
            moves: function (el: any, container: any, handle: any): any {
                if (el.classList.contains('dragula-disabled')) {
                    return false;
                }

                return true;
            }
        });

        this.subs.add(this.dragulaService.dropModel(this.MANY_ITEMS)
        .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
          console.log('targetModel', targetModel);
        })
        );
    }

    subs = new Subscription();

    MANY_ITEMS = 'MANY_ITEMS';

    ngOnInit() {
    }

    public open(type) {
        this.type = type;
        this.dialogRef = this.modal.open(this.dialog);
    }

    array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            let k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    }

    moveRight(index) {
      if (index >= this.set.length - 1) {
        return false;
      }
      this.set = this.array_move(this.set, index, index + 1);
    }

    moveLeft(index) {
      if (index == 0 || index == 1) {
        return false;
      }
      this.set = this.array_move(this.set, index, index -1);
    }

    reorderScenes() {
        this._reorderScenes(this.set);
    }

    close() {
        this.dialogRef.close();
    }
}

import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DraftOrdersService } from '../draft-orders/draft-orders.service';
import { ModalMessages } from './constants/modal-messages';
import { WibbitzService } from '../../shared/services';
import * as cloneDeep from 'lodash/cloneDeep';
import * as omit from 'lodash/omit';
import * as moment from 'moment';
import { LayoutIdentifiers } from './constants';

//import { element } from 'protractor';
//import { BADQUERY } from 'dns';

@Component({
    selector: 'video-player',
    templateUrl: './video-player.component.html'
})
export class VideoPlayerComponent implements OnInit {
    constructor(
        public activeModal: NgbActiveModal, 
        private route: ActivatedRoute,
        private draftOrdersService: DraftOrdersService,
        private wibbitzOrderService: WibbitzService,
    ) {
    }

    videoUrl : string; 
    width : string = '100%';

    ngOnInit() {
    }
}
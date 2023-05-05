import { Component, OnInit } from '@angular/core';
import { BaseClass } from '../../../../shared/base.class';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css']
})
export class GuidelinesComponent extends BaseClass implements OnInit {

  constructor(public activeModal: NgbActiveModal,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {

  }

}

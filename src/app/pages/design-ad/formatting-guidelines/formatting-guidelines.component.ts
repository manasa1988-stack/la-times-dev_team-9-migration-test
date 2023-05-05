import { Component, OnInit } from '@angular/core';
import { BaseClass } from '../../../shared/base.class';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'app-guidelines',
  templateUrl: './formatting-guidelines.component.html',
  styleUrls: ['./formatting-guidelines.component.css']
})
export class FormattingGuidelinesComponent extends BaseClass implements OnInit {

  constructor(public activeModal: NgbActiveModal,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {

  }

}

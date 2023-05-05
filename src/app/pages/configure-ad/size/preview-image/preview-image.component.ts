import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseClass } from '../../../../shared/base.class';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.css']
})
export class PreviewImageComponent extends BaseClass {

  imageUrl : any; 
  height : string;
  min: number = 50;
  max: number = 100;  
  step: number = 1;
  isDesignAdMaterialPreview: boolean = false;
  imgHeight: string;
  imgWidth: string;
  heading: string = "Preview image at full resolution does not represent actual ad size";
  
  constructor(public activeModal: NgbActiveModal,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
  
    if(!this.isDesignAdMaterialPreview)
      this.imgHeight = this.height;
  };

  zoom(value) {

  }

  changeInHeight(value) {
    this.height = value;
  }

}

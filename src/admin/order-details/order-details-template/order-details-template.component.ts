import { Component, OnInit } from '@angular/core';
import { AdminBaseClass } from "../../shared/admin-base.class";
import { IOrderTemplate } from '../../models/setting.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAdTemplate, IAttribute, IAttributeDisplayGroup } from '../../../app/models/order-item.model';
import { isNullOrUndefined } from 'util';
import * as adssMetaData from '../../shared/admin-adss.metadata';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'order-details-template',
  templateUrl: './order-details-template.component.html',
  styleUrls: ['./order-details-template.component.css']
})
export class TemplateComponent extends AdminBaseClass {

  templates: IOrderTemplate[];
  adTemplate: IAdTemplate;

  attributes: {};
  attributeDisplayGroups: IAttributeDisplayGroup[]

  fieldType = adssMetaData.FieldType;

  dataType: string;
  dataToDisplay = [];

  constructor(public activeModal: NgbActiveModal, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.dataPopulator();
  }

  dataPopulator() {
    this.dataToDisplay = [];

    switch (this.dataType) {
      case "template":
        this.getTemplateData();
        break;
      case "attribute":
        this.getOrderAttributes();
        break;
      default:
    }
  }

  getTemplateData() {
    let isImage = false;
    this.templates.forEach(template => {
      if (!isNullOrUndefined(this.adTemplate)) {
        this.adTemplate.DataFieldGroups.forEach(dataFieldGroup => {
          dataFieldGroup.Fields.forEach(field => {
            if (field.Name === template.Name) {
              isImage = field.IsImage;
            }
          });
          this.dataToDisplay.push({
            Name: template.Name,
            Value: isImage ? template.Value.split(",") : template.Value,
            isTypeImage: isImage
          });

        });
      }
    });
  }

  getOrderAttributes() {
    let isImage = false;
    Object.keys(this.attributes).forEach(key => {
      this.attributeDisplayGroups.forEach(displayGroup => {
        displayGroup.Attributes.forEach(attribute => {
          isImage = (key == attribute.Name) && (attribute.Type.Id == this.fieldType['Image'] || attribute.Type.Id == this.fieldType['ImageList']);
        });
      });

      this.dataToDisplay.push({
        Name: key,
        Value: isImage ? (this.attributes[key].Value.split(",").length > 0 && this.attributes[key].Value.split(",")) : this.attributes[key].Value,
        isTypeImage: isImage
      })
    });
  }

}

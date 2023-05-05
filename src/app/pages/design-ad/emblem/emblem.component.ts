import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseClass } from '../../../shared/base.class';
import { DesignAService } from '../design-ad.service';
import { DraftOrdersService } from '../../draft-orders/draft-orders.service';
import { IEmblem } from '../../../models/designAd.model';
import { IPhoto } from '../../../models/photo.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'emblem',
  templateUrl: './emblem.component.html',
  styleUrls: ['./emblem.component.css']
})

export class EmblemComponent extends BaseClass {
  emblem: IEmblem;
  emblemImages: any[] = [];
  fileName: string;
  title: string = "SELECT ";
  type: string;
  logoLibrary: IPhoto[] = [];

  constructor(private activeModal: NgbActiveModal,
    private DesignAdService: DesignAService,
    private draftOrdersService: DraftOrdersService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  emblemSelected(emblemImg) {

    this.emblem.FileName = this.getImageName(emblemImg);
    this.DesignAdService.saveEmblem(this.emblem).subscribe(data => {
      if (data.IsSuccess)
        this.activeModal.close({ data: 'success', selectedEmblemImg: emblemImg });
    },
      (error) => {

      });
  }

  logoSelected(logo) {

    this.emblem.FileName = logo.Name;
    this.DesignAdService.saveLogo(this.emblem).subscribe(data => {
      if (data.IsSuccess)
        this.activeModal.close({ data: 'success', selectedLogoImg: logo });
    },
      (error) => {

      });
  }

  getImageName(filename) {
    return filename.slice((filename.lastIndexOf("/") - 1 >>> 0) + 2);
  }

  onClose() {
    this.activeModal.close();
  }

  validationInit() {
    switch (this.type) {
      case "logo":
        this.title += "A LOGO";
        break;
      case "emblem":
        this.title += "AN EMBLEM";
        break;
      default:
    }

    if (this.emblem == undefined) {
      this.emblem = <IEmblem>{};
    }
  }
}

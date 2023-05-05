import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { AdminBaseClass } from "../shared/admin-base.class";
import { Router } from '@angular/router';
import { IPortalProductGroupLink } from '../../app/models/setting.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'app-regression',
  templateUrl: './regression.component.html',
  styleUrls: ['./regression.component.css']
})
export class RegressionComponent extends AdminBaseClass {

  regressionLinks: IPortalProductGroupLink[];
  isDataReady: boolean = false;
  portals: any[];
  displayError: boolean = false;

  constructor(private adminService: AdminService, private router: Router, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.regressionLinksPopulator();
  }

  regressionLinksPopulator() {
    this.adminService.getRegressionLinks().subscribe(data => {
        this.regressionLinks = data.Links;
        this.portalsPopulator(data);
      },
      (err) => {       
		    this.isDataReady = true;
        this.displayError = true;
      }
    );
  }

  portalsPopulator(data) {
    this.portals = data.PortalConfig.PortalBusinessUnits;
    this.isDataReady = true;
  }

}

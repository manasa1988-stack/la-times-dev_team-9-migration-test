import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminBaseClass } from "../shared/admin-base.class";
import { AdminService } from '../admin.service';
import { StorageService } from '../../app/shared/storage.service';
import { DOCUMENT } from '@angular/common';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: 'portal',
  templateUrl: './portal.component.html',
})

export class PortalComponent extends AdminBaseClass {

  portalPageData;
  isDataReady: boolean = false;
  hostNames: string[];
  portals: any[];
  selectedPortalData;
  selectedPortalProductGroups: any[];
  displayError: boolean = false;
  classifiedPackage;

  currentHostname: string;

  constructor(private adminService: AdminService,
    private router: Router,
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: any, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.currentHostname = this.document.location.hostname;
    this.getPortalData();
  }

  getPortalData() {
    this.adminService.getPortalData().subscribe((data) => {
      this.portalPageData = data
    },
      (err) => {
        this.isDataReady = true;
        this.displayError = true;
      }
      ,
      () => {
        this.portalsPopulator(this.portalPageData);
        this.selectedPortalDataPopulator(this.portals);
      }
    );
  }

  classifiedPackagePopulator(selectedPortalProductGroups) {
    if (selectedPortalProductGroups.find(product => product.Name.includes('Classified Package'))) {
      let subCategories = Array.from(new Set(selectedPortalProductGroups.find(product => product.Name.includes('Classified Package')).PortalProductGroupLinks
        .map(product => product.SubCategoryDescription)));
      this.classifiedPackage = subCategories.map(subCategory => Object({ name: subCategory, value: selectedPortalProductGroups[selectedPortalProductGroups.length - 1].PortalProductGroupLinks.filter(selectedPortal => selectedPortal.SubCategoryDescription == subCategory) }))
    }
    this.isDataReady = true;
  }

  selectedPortalProductGroupsPopulator(SelectedPortalData) {
    if (SelectedPortalData && SelectedPortalData.PortalProductGroups) 
    {
      this.selectedPortalProductGroups = SelectedPortalData.PortalProductGroups;
      this.classifiedPackagePopulator(this.selectedPortalProductGroups);
    }
  }

  selectedPortalDataPopulator(data) {
    var host = this.storageService.getHOST();
    var code = host.CommunityCode ? host.Code + host.CommunityCode : host.Code;
    this.selectedPortalData = data.find(portal => portal.Code == code);
    this.selectedPortalProductGroupsPopulator(this.selectedPortalData);
  }

  portalsPopulator(data) {
    this.portals = data.PortalConfig.PortalBusinessUnits;
  }


}

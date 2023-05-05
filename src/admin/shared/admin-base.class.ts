import {OnInit} from "@angular/core";
//import { Console } from "console";
// import { environment } from "../../environments/environment";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
export abstract class AdminBaseClass implements OnInit{
   
    environmentName: string;
    assetsHostUrl: string;
    imagesUrl: string;
    productsUrl: string;
    logoUrl: string;
    templateUrl: string;
    templateSample: string;
    pageSize: number;
    adminUrl: string;
    portalUrl: string;
    _configSvc :RuntimeConfigLoaderService;
    

    constructor(       
       configSvc: RuntimeConfigLoaderService
      ) {
this._configSvc = configSvc;
  }

    
  ngOnInit() {
    
    this.environmentName = this._configSvc.getConfigObjectKey("name");
    this.assetsHostUrl = this._configSvc.getConfigObjectKey("assetsHost");
    this.imagesUrl = this._configSvc.getConfigObjectKey("imagesUrl");
    this.productsUrl = this._configSvc.getConfigObjectKey("productsUrl");
    this.logoUrl = this._configSvc.getConfigObjectKey("logoUrl");
    this.templateUrl = this._configSvc.getConfigObjectKey("templateUrl");
    this.templateSample = this._configSvc.getConfigObjectKey("templateSample");
    this.pageSize = this._configSvc.getConfigObjectKey("pageSize");
    this.adminUrl = this._configSvc.getConfigObjectKey("adminUrl");
    this.portalUrl =  this._configSvc.getConfigObjectKey("portalUrl");
    console.log('from admin baseclass');
    console.log(this.environmentName);
    console.log(this.assetsHostUrl);
    console.log(this.imagesUrl );
    console.log(this.productsUrl);
    console.log(this.logoUrl);
    console.log(this.templateUrl);
    console.log(this.templateSample);
    console.log(this.pageSize);
    console.log(this.adminUrl);
    console.log(this.portalUrl);
      this.validationInit();
  }
  
  maxLengthMessage(fieldName: string, length: number) {
    return fieldName + " cannot be more than " + length + " chars in length.";
  }
  
  getRequiredMessage(field) {
    return "The " + field + " field is Required.";
  }

  pleaseEnterMessage(fieldName) {
    return "Please enter the " + fieldName;
  }

  abstract validationInit() : void ;
}
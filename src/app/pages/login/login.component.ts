import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '../../shared/cookies.service';
import { StorageService } from '../../shared/storage.service';
import { UserDetailsService } from '../../pages/user-details/user-details.service';
import { isNullOrUndefined } from 'util';
// import { environment } from "../../../environments/environment";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {

    private intervalId: any;
    isFetching: Boolean = false;
    return: string = '';
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
    constructor(private modalService: NgbModal,
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService,
        private userDetailsService: UserDetailsService,
        private _configSvc: RuntimeConfigLoaderService,
        private cookieService: CookieService) {

        this.route.queryParams
            .subscribe(params => this.return = params['return'] || '/dashboard');

        (<any>window)._trackPage('ADSS - Login', this.route.snapshot.url);
    }

    openRegisterComponent() {
        const modalRef = this.modalService.open(RegisterComponent, {
            size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
        });
    }

    checkStatus = function () {
        if (this.isUserLoggedIn()) {
            if (this.storageService.getUserInfo() == null) {
                if (!this.isFetching) {
                    this.isFetching = true;
                    this.userDetailsService.getUser().subscribe((data) => {
                        this.userDetailsService.storeUserDetails(data);
                        this.redirect();
                    });
                }
            }
            else {

                this.redirect();
            }
        }
        else {
            this.storageService.removeUserInfo();
        }
    }

    redirect() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.router.navigateByUrl(this.return);
    }

    isUserLoggedIn() {
        return this.cookieService.check('c_mId');
    }
    
    ngOnInit() {
       // console.log('config obh:'+this._configSvc);
            //const envConfig = this._configSvc.getConfig();
            // console.log('in login '+envConfig);
            // console.log("new :"+envConfig.assetsHost);
            // console.log("new :"+envConfig.name);
            // console.log(envConfig.environment);
            this.environmentName = this._configSvc.getConfigObjectKey("name");
            console.log(this.environmentName);
            this.assetsHostUrl = this._configSvc.getConfigObjectKey("assetsHost");
            console.log(this.assetsHostUrl);
            this.imagesUrl = this._configSvc.getConfigObjectKey("imagesUrl");
            console.log(this.imagesUrl);
            this.productsUrl = this._configSvc.getConfigObjectKey("productsUrl");
            console.log(this.productsUrl);
            this.logoUrl = this._configSvc.getConfigObjectKey("logoUrl");
            console.log(this.logoUrl);
            this.templateUrl = this._configSvc.getConfigObjectKey("templateUrl");
            console.log(this.templateUrl);
            this.templateSample = this._configSvc.getConfigObjectKey("templateSample");
            console.log(this.templateSample);
            this.pageSize = this._configSvc.getConfigObjectKey("pageSize");
            console.log(this.pageSize);
            this.adminUrl = this._configSvc.getConfigObjectKey("adminUrl");
            console.log(this.adminUrl);
            this.portalUrl =  this._configSvc.getConfigObjectKey("portalUrl");
            console.log(this.portalUrl);
    
         
      
       
        this.checkStatus();
        this.intervalId = setInterval(() => { this.checkStatus(); }, 1000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

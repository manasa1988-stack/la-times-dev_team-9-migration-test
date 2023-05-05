import { Component, OnInit, Inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MasterDataService } from './pages/master/master.data.service';
import { StorageService } from './shared/storage.service';
import { DOCUMENT } from '@angular/common';
import { Broadcaster } from './shared/broadcast.service';
import * as events from './shared/adss.events';
import { SpinnerService } from './shared/spinner.service';
import { CookieService } from './shared/cookies.service';
import { UserDetailsService } from './pages/user-details/user-details.service';
import { RegisterComponent } from './pages/register/register.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ServerResponse } from './models/server.response.model';
import { Validators } from '@angular/forms';
import { required } from './shared/custom-validators';
//import { ModalComponent} from './pages/adblocker/modal.component';
import { Title } from '@angular/platform-browser';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'app';
    hostname: string;
    submitting: boolean = false;
    isDataReady: boolean = false;
    isUserReady: boolean = false;

    @ViewChild('top', { static: true }) public top: ElementRef;
    

    constructor(private storageService: StorageService,
        private masterDataService: MasterDataService,
        private modalService: NgbModal,
        private broadcaster: Broadcaster,
        private spinnerService: SpinnerService,
        private cookieService: CookieService,
        private userDetailsService: UserDetailsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        @Inject(DOCUMENT) private document: any) {
        this.registerBroadcastEvents();
        this.hostname = this.document.location.hostname;

    }

    /*ngAfterViewInit(){

        //setTimeout(() => { this.init();},100);
      }*/

  /* adsBlocked(callback){
     let testURL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
     let myRequest = new Request(testURL, {
       method: 'HEAD',
       mode: 'no-cors'
     });

     fetch(myRequest).then((response) => {
       return response;
     }).then((response) => {

       callback(false)
     }).catch((e) => {
        console.log("coming here",e);
       callback(true)
     });
   }
   init(){
     this.adsBlocked((blocked) => {
         console.log("coming here",blocked);
       if(blocked){
           //this.openRegisterComponent();
           alert('ads  blocked');
          const modalRefBlk = this.modalService.open(ModalComponent);
       } else {
        // alert('ads not blocked');
       }
     })
   }*/

 

    setDocTitle() {
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                const child = this.activatedRoute.firstChild.snapshot.data['videoGalleryTitle'];

                const origin = window['origin'].replace(/(^\w+:|^)\/\//, '');
                const pattern2 = new RegExp("^advertising.sandiegouniontribune.com" , "i");
                const utcpPattern2 = new RegExp("^advertising.utcommunitypress.com" , "i");
                
                const marketRegex = new RegExp("^(advertising|advertiser|advertisingv2|advertisingv2x)-(qa|stage|local).([a-z]+)-test-dss.caltimes.io$", "g");
                const match = marketRegex.exec(origin);

                let title = '';
                if (pattern2.test(origin) || (match && match[3] && match[3] == 'sandiegouniontribune')) {
                    title = 'San Diego Union-Tribune Video Tributes'
                }
                else if (utcpPattern2.test(origin) || (match && match[3] && match[3] == 'utcommunitypress')) {
                    title = 'Union-Tribune Community Press Video Tributes';
                }
                else {
                    title = 'Los Angeles Times Video Tributes'
                }
                if (!!child) {
                    this.titleService.setTitle(title);
                }

            }
        });
    }

    ngOnInit() {
        //alert('on init fired');
        Validators.required = required;
        console.log('initiating session');
        if (this.storageService.getBrowserSession() == null) {
            var sessionId =  '_' + Math.random().toString(36).substring(2, 9);
            this.storageService.setBrowserSession(sessionId);
        }

        if (this.storageService.getHOST() == null) {
            this.masterDataService.getMarkettingSettings(this.hostname)
                .subscribe(data => {
                    this.storageService.setHOST(data);
                    this.isDataReady = true;
                },
                error => {
                    this.isDataReady = true;
                });
        }
        else {
            this.isDataReady = true;
        }

        if (this.cookieService.check('c_mId')) {
            if (this.storageService.getUserInfo() == null) {
                this.isUserReady = false;
                this.getUser();
            }
            else {
                this.isUserReady = true;
            }
        }
        else {
            this.isUserReady = true;
        }

        this.setDocTitle();
    }

    public onActivate() {
        document.body.scrollTop = 0;
    }

    getUser() {
        this.userDetailsService.getUser().subscribe((data) => {
            this.isUserReady = true;
            this.userDetailsService.storeUserDetails(data);
        });
    }

    registerBroadcastEvents() {
        this.broadcaster.on<boolean>(events.SUBMITTING)
            .subscribe(value => {
                this.submitting = value;
            });

        this.broadcaster.on<boolean>(events.SPINNER_STOP)
            .subscribe(value => {
                this.spinnerService.set(value);
            });

        this.broadcaster.on<boolean>(events.REDIRECT_TO_ERROR)
            .subscribe(data => {
                let obj = <Object>data;
                if (obj['error'].Code == '401' || obj['error'].Code == '500')
                    this.router.navigateByUrl('/errors?code=' + obj['error'].ErrorText, { skipLocationChange: true });
                else
                    this.router.navigateByUrl('/errors?code=' + obj['error'].ErrorText);

            });

    }

    @HostListener('document:click', ['$event'])
    clickout(event) {

        if (event.target.getAttribute("data-reg-handler") &&
            event.target.getAttribute("data-reg-handler") == "signUpHandler") {
            this.openRegisterComponent();
        }
    }

    openRegisterComponent() {
        const modalRef = this.modalService.open(RegisterComponent, {
            size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
        });
    }
}

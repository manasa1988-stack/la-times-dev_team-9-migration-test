import { Component, ComponentRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DraftOrdersService } from '../draft-orders/draft-orders.service';
import { ModalMessages } from './constants/modal-messages';
import { WibbitzService } from '../../shared/services';
import * as cloneDeep from 'lodash/cloneDeep';
import { DiscardModalService } from '../../shared/discard-modal.service';
import * as isNil from 'lodash/isNil';
import { LayoutIdentifiers } from './constants';
import { OrderHistoryService } from '../order-history/order-history.service';
import * as moment from 'moment';
import {
    Scene1Helper,
    Scene2Helper,
    Scene3Helper,
    Scene4Helper,
    Scene5Helper,
    Scene6Helper,
    Scene7Helper,
    Scene8Helper,
    Scene9Helper,
    Scene10Helper,
} from './scene-editor/scenes .helper';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { InfoComponent } from './info-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbMessageModalComponent } from './ngb-message-modal/ngb-message-modal.component';
import { ScenePickerComponent }  from './scene-picker/scene-picker.component';
import { SceneReordererComponent }  from './scene-reorderer/scene-reorderer.component';
import { combineLatest } from 'rxjs';
import { isTemplateExpression } from 'typescript';
//import { t } from '@angular/core/src/render3';

@Component({
    selector: 'design-video',
    templateUrl: './design-video.component.html',
    styleUrls: ['./design-video.component.scss'],
})
export class DesignVideoComponent implements OnInit {
    @ViewChild('trackPicker',{static:true}) trackPicker;
    @ViewChild('picker',{static:true}) picker;
    @ViewChild('showSubmitSuccess',{static:true}) showSubmitSuccess;
    @ViewChild('info',{static:true}) info;
    @ViewChild('sceneSelector',{static:true}) sceneSelector;

    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    public aditId: number = 0;
    public isFromAdit: boolean = false;
    public isAditOriginated: boolean = false;
    public isCustomerSession: boolean = false;
    public isValidSingleVideoEditSession: boolean = false;
    public isVideoEditSessionExpired: boolean = false;
    private videoValidatationIntervalId: any;
    public aditBusinessUnit: string;
    public adLogin:number;
    public isEditVideo: boolean = false;
    public loading = false;
    public saving = false;
    public orderInfo: any;
    public wibbitzBase: any;
    private wibbitzVideoDraftId: string;
    public wibbitzOrderId: number;
    public personData: any;
    public selectedScene = 0;
    public payload: any = {
        uiHelper: [],
        layouts: [],
        selectedAudio: '',
        draftId: '',
    };
    public coverSrc = '';

    constructor(
        private route: ActivatedRoute,
        private draftOrdersService: DraftOrdersService,
        private wibbitzOrderService: WibbitzService,
        private router: Router,
        public snackBar: MatSnackBar,
        private discardModalService: DiscardModalService,
        private orderHistoryService: OrderHistoryService,
        private ngbModal: NgbModal,
    ) {
    }

    addAudioTrack() {
        this.trackPicker.open();
    }

    addTrack(track) {
        this.trackPicker.open();
    }

    setTrack(track) {
        this.payload.selectedAudio = track;
    }

    addScene(e) {
        this.openPicker('multiple');
    }

    reorderScene() {
      this.openReorderer();
    }

    selectScene(index) {
        this.selectedScene = -1;
        setTimeout(() => this.selectedScene = index, 100);
    }

    validateVideoEditSession(draftId){
        this.wibbitzOrderService.initiateCustomerVideoEditSession(draftId).subscribe(
            r => {
                this.isValidSingleVideoEditSession = r == "true"
                if(this.isValidSingleVideoEditSession) {
                    this.videoValidatationIntervalId = setInterval(() => {
                        this.wibbitzOrderService.validateCustomerVideoEditSession(draftId).subscribe(
                            r => {
                                
                                this.isVideoEditSessionExpired = r == "true"
                                console.log('interval id : ' + this.videoValidatationIntervalId + ', session expired : ' + this.isVideoEditSessionExpired);

                                if (this.isVideoEditSessionExpired){
                                    clearInterval(this.videoValidatationIntervalId);
                                }
                            },
                            err => {
                                this.isVideoEditSessionExpired = false;
                            }
                        );
                      }, 60000);
                }
            },
            err => {
                this.isValidSingleVideoEditSession = false;
            }
        );

        
    }

    ngOnInit() {
        if(this.route.queryParams){
            this.route.queryParams.subscribe(params => {
                this.isFromAdit = params["system"] && params["system"] == "adit";
                this.isAditOriginated = params["origin"] && params["origin"] == "adit";
                this.aditBusinessUnit = params["bu"];
                this.adLogin = params["adlogin"];
                this.isCustomerSession = params["cses"] == "true";

                this.isEditVideo = params["editvideo"];
                if(!this.isEditVideo) this.isEditVideo = false;
                if (this.isAditOriginated || this.isCustomerSession)
                {
                    let videoDraftId = params["videodraftid"];
                    let productId = params["productid"];
                    let videoJson: any;
                    const orderId: number = +this.route.snapshot.paramMap.get('draftId');

                    if(this.isCustomerSession)
                    {
                        this.validateVideoEditSession(videoDraftId);
                    }

                    
                    // console.log(orderId);
                    this.loading = true;
                    this.orderHistoryService.getOrderSummary(orderId, this.isCustomerSession)
                        .subscribe(
                            order => {
                                this.aditId = orderId;
                                this.orderInfo = order;
                                this.personData = order.AttributeValues ? order.AttributeValues : {};
                                videoDraftId = videoDraftId ? videoDraftId : ''

                                var payLoad = {};
                                const printAttr = this.personData;
                                let birthDate: any = '';
                                if (printAttr.BirthMonth.Value && printAttr.BirthDay.Value && printAttr.BirthYear.Value)
                                {
                                    birthDate = new Date(`${printAttr.BirthMonth.Value.substring(0, 3)} ${printAttr.BirthDay.Value}, ${printAttr.BirthYear.Value}`);
                                }

                                let deathDate: any = '';
                                if (printAttr.DeathMonth.Value && printAttr.DeathDay.Value && printAttr.DeathYear.Value)
                                {
                                    deathDate = new Date(`${printAttr.DeathMonth.Value.substring(0,3)} ${printAttr.DeathDay.Value}, ${printAttr.DeathYear.Value}`);
                                }

                                const age = (birthDate !== '' && deathDate !== '') ? `${+printAttr.DeathYear.Value - +printAttr.BirthYear.Value}` : '';

                                const dateFormat = 'MMMM DD, YYYY';
                                const bDay = birthDate !== '' ? moment(birthDate).format(dateFormat) : '';
                                const dDay = deathDate !== '' ? moment(deathDate).format(dateFormat) : '';

                                let firstName = printAttr.NameFirst && printAttr.NameFirst.Value && printAttr.NameFirst.Value != null ? printAttr.NameFirst.Value.trim() : '';
                                let lastName = printAttr.NameLast && printAttr.NameLast.Value && printAttr.NameLast.Value != null ? printAttr.NameLast.Value.trim() : '';
                                let middleName = printAttr.NameMiddle && printAttr.NameMiddle.Value && printAttr.NameMiddle.Value != null ? printAttr.NameMiddle.Value.trim() : '';
                                let nickName = printAttr.NameNick && printAttr.NameNick.Value && printAttr.NameNick.Value != null ? printAttr.NameLast.Value.trim() : '';

                                payLoad["businessUnit"] = this.aditBusinessUnit;
                                payLoad["modifiedBy"] = this.adLogin;
                                payLoad["draftId"] = videoDraftId;
                                payLoad["productId"] = productId;
                                payLoad["orderId"] = orderId;
                                payLoad["orderItemId"] = 0;
                                payLoad["adMaterialId"] = 0;
                                payLoad["Name"] = `${firstName}${middleName? ` ${middleName}` : ''}${nickName? ` '${nickName}'` : ''} ${lastName}`;
                                payLoad["smallText"] = 'In loving memory.';
                                payLoad["Dates"] = (birthDate !== '' && birthDate !== '') ? `${bDay}\r${dDay}` : '';
                                payLoad["Age"] = this.getAge(printAttr);
                                payLoad["mediaComp"] = printAttr.Photo1.Value ? printAttr.Photo1.Value : '';

                                this.wibbitzOrderService.createOrGetDraft(payLoad).subscribe(re => {
                                    const response: any = re;
                                    videoDraftId = response.draftId;
                                    videoJson = response;
                                    this.wibbitzVideoDraftId = videoDraftId;

                                    this.wibbitzOrderService.getLayout().subscribe(
                                        base => {
                                            this.wibbitzBase = base;

                                            this.payload.draftId = videoDraftId;
                                            const payload = videoJson;
                                            this.payload = payload;

                                            if (!this.payload.uiHelper) {
                                                this.uiHelperInit();
                                            }

                                            this.payload.uiHelper = JSON.parse(this.payload.uiHelper);

                                            this.disableDefaultFromBaseScenes();
                                            this.loading = false;
                                        },
                                        err => { this.loading = false; console.error(err) }
                                    );
                                },
                                err => console.error(err),
                                );
                                this.loading = false;
                        },
                    (error) => {
                        this.loading = false;
                     });
                }
                else if(!this.isAditOriginated && !this.isCustomerSession)
                {
                    const draftId: number = +this.route.snapshot.paramMap.get('draftId');
                    // console.log(draftId);

                    this.loading = true;
                    this.draftOrdersService.getDraftSummary(draftId, null).subscribe(
                        order => {
                            this.orderInfo = order;
                            this.personData = order.AttributeValues;
                            const wibbitzOrder = order.OrderItems.find(item => item.IsWibbitzProduct);
                            this.wibbitzVideoDraftId = wibbitzOrder.VideoDraftId;
                            this.wibbitzOrderId = wibbitzOrder.Id;

                            // first check: if there is an order
                            if (!wibbitzOrder) {
                                console.error('Wibbitz item not found');
                                return;
                            }

                            this.loading = false;

                            // second check : if there is already a videJson
                            const wibbitzParams = {};
                            /*
                            if (wibbitzOder.VideoDraftId) {
                                Object.assign(wibbitzParams, {draftid: wibbitzOder.VideoDraftId});
                            }
                            */

                            this.wibbitzOrderService.getLayout().subscribe(
                                base => {
                                    this.wibbitzBase = base;
                                    if (!wibbitzOrder.VideoJson) {
                                        this.scenesInit();
                                    } else {
                                        this.payload.draftId = this.wibbitzVideoDraftId;
                                        const payload = JSON.parse(wibbitzOrder.VideoJson);
                                        this.payload = payload;

                                        if (!this.payload.uiHelper) {
                                            this.uiHelperInit();
                                        }

                                        this.payload.uiHelper = JSON.parse(this.payload.uiHelper);

                                    }

                                    this.disableDefaultFromBaseScenes();

                                    this.selectedScene = 0;
                                },
                                err => console.error(err),
                            );
                        },
                        err => {
                            this.loading = false; console.error(err);
                        },
                    );
                }
            });
        }


    }

    openPicker(type) {
        // this.picker.open(type);
        const dialogRef = this.ngbModal.open(ScenePickerComponent, {
            backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered la-video-class'
        });
        dialogRef.componentInstance.set = this.wibbitzBase.layouts;
        dialogRef.componentInstance.close = () => dialogRef.close();
        dialogRef.componentInstance._addLayouts = (r) => {
            this.addScenes(r);
            dialogRef.componentInstance.selectedLayouts = [];
            dialogRef.close();
        }
        dialogRef.componentInstance.type = type;

    }

    openReorderer() {
        // this.picker.open(type);
        const dialogRef = this.ngbModal.open(SceneReordererComponent, {
            backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered la-video-class'
        });
        dialogRef.componentInstance.set = cloneDeep(this.payload.layouts);
        dialogRef.componentInstance.close = () => {
          dialogRef.close();
        };
        dialogRef.componentInstance._reorderScenes = (r) => {
          this.reorder(r);
          dialogRef.close();
        }

    }

    showSnack(type, message, time = 5000) {
        this.snackBar.openFromComponent(InfoComponent, {
            data: {
                type,
                message,
            },
            duration: time,
            panelClass: ['latimes-snackbar'],
        });
    }

    findAndReplaceDuplicateSceneNames(layouts) {
        let temp = layouts[0].freeName.split('(');
        let sceneName = temp[0];
        let sceneIndex = 0;

        layouts.forEach((l, index) => {
            var layoutNumber = l.freeName.match(/\((.*?)\)/g);
            if(layoutNumber && layoutNumber.length == 1) {
                let number = layoutNumber[0].replace('(', '').replace(')', ''); 
                if(parseInt(number) > sceneIndex) {
                    sceneIndex = parseInt(number);
                }
            }
        });

        return sceneName + '(' + (sceneIndex + 1) + ')';
    }

    addScenes(layoutsSet) {
        const layouts = JSON.parse(layoutsSet);
        let itemCount = this.payload && this.payload.uiHelper ? this.payload.uiHelper.length : 0;
        layouts.forEach((sc, index) => {
            const res = cloneDeep(sc);
            res.elements = layouts[index].elements;

            if(
                res.name === 'LAT_scene_07'
                || res.name === 'LAT_scene_08'
                || res.name === 'LAT_scene_09'
                || res.name === 'LAT_scene_10'
            ) {
                res
                .elements
                .find(r => r.id === 'mediaComp')
                .value = cloneDeep(this.payload.layouts[0].elements.find(r => r.id === 'mediaComp').value);
            }

            /* main ui helper */
            res.uiHelper = cloneDeep(
                Object.values(LayoutIdentifiers).find(model => model.name === res.name),
            );
            /* end ui helper */

            //console.log('add scene');
            //console.log(this.payload.layouts);
            //console.log(res);

            let checkIfExisting = this.payload.layouts.find(r => r.name === res.name);
            
            if(checkIfExisting) {
                var duplicateLayouts = this.payload.layouts.filter(r => r.name === res.name);
                if(duplicateLayouts) {
                    res.freeName = this.findAndReplaceDuplicateSceneNames(duplicateLayouts);
                }
            }

            this.payload.layouts.push(res);
            this.payload.uiHelper.push(
                cloneDeep(
                    Object.values(LayoutIdentifiers).find(model => model.name === res.name),
                ),
            );
        });
        this.submitVideo(() => {
          this.selectedScene = itemCount;
          this.sceneSelector.moveToScope(itemCount);
        });
    }

    deleteScene(guid) {
        if (!guid) {
            const payload = cloneDeep(this.payload);
            payload.layouts = payload.layouts.filter((layout, index) => index !== this.selectedScene);
            payload.uiHelper = payload.uiHelper.filter((uiElement, index) => index !== this.selectedScene);
            this.payload = payload;
            this.selectedScene = 0;
            this.sceneSelector.moveToScope(0);
            this.submitVideo();
            return;
        }

        this.wibbitzOrderService.deleteScene(this.wibbitzVideoDraftId, guid).subscribe(r => {
          const parsedResponse: any = r;
            if (parsedResponse.uiHelper)
            {
              parsedResponse.uiHelper = JSON.parse(parsedResponse.uiHelper);
              parsedResponse.uiHelper = parsedResponse.uiHelper.filter((uih, index) => index !== this.selectedScene);
            }

            this.payload = parsedResponse;
            this.selectedScene = 0;
            this.sceneSelector.moveToScope(0);
            this.submitVideo();
        });
    }

    duplicateSceneProcess(guid) {
        this.wibbitzOrderService.duplicateScene(this.wibbitzVideoDraftId, guid).subscribe(r => {
            const parsedResponse: any = r;
            parsedResponse.uiHelper = JSON.parse(parsedResponse.uiHelper);
            const uiHelperItem = parsedResponse.uiHelper[this.selectedScene];
            parsedResponse.uiHelper.push(uiHelperItem);

            // disable default
            parsedResponse.layouts = parsedResponse.layouts.map((layout, index) => {
                if (index > 0 && layout.isDefaultScene) {
                    layout.isDefaultScene = false;
                }

                return layout;
            });

            this.payload = parsedResponse;
            this.submitVideo(() => {
              this.sceneSelector.moveToLast();
            });
        });
    }

    duplicateScene(guid) {
        this.payload.draftId = this.wibbitzVideoDraftId;

        this.parsePayload();

        const payload = cloneDeep(this.payload);
        payload.uiHelper = JSON.stringify(payload.uiHelper);

        this.wibbitzOrderService.uploadDraft(this.wibbitzOrderId, this.aditId, payload).subscribe(re => {

            const parsedResponse: any = re;
            parsedResponse.uiHelper = JSON.parse(parsedResponse.uiHelper);

            this.payload = parsedResponse;

            this.duplicateSceneProcess(guid);
        },
        err => this.showSnack('error', `An error ocurred ${err}.`),
        );
    }

    /* this one runs when the video has already been redered with /createdefault endpoint */
    uiHelperInit() {
        const uiHelper = [
            cloneDeep(
                Object.values(LayoutIdentifiers).find(model => model.name === LayoutIdentifiers.LAT_SCENE_01_PERSON.name),
            ),
        ];

        let birthDate: any = '';
        if (this.personData.BirthMonth.Value && this.personData.BirthDay.Value && this.personData.BirthYear.Value) {
          birthDate = new Date(`${this.personData.BirthMonth.Value.substring(0, 3)} ${this.personData.BirthDay.Value}, ${this.personData.BirthYear.Value}`);
        }

        let deathDate: any = '';
        if (this.personData.DeathMonth.Value && this.personData.DeathDay.Value && this.personData.DeathYear.Value) {
          deathDate = new Date(`${this.personData.DeathMonth.Value.substring(0,3)} ${this.personData.DeathDay.Value}, ${this.personData.DeathYear.Value}`);
        }

        const age = (birthDate !== '' && deathDate !== '') ? `${+this.personData.DeathYear.Value - +this.personData.BirthYear.Value}` : '';

        uiHelper[0].model.firstName = !isNil(this.personData.NameFirst.Value) ? this.personData.NameFirst.Value : '';
        uiHelper[0].model.lastName = !isNil(this.personData.NameLast.Value) ? this.personData.NameLast.Value : '';
        uiHelper[0].model.middleName = isNil(this.personData.NameMiddle) ? '' : this.personData.NameMiddle.Value;
        uiHelper[0].model.nickName = isNil(this.personData.NameNick) ? '' : this.personData.NameNick.Value;
        uiHelper[0].model.description = 'In loving memory.';
        uiHelper[0].model.birthDate = birthDate ? birthDate : '';
        uiHelper[0].model.deathDate = deathDate ? deathDate : '';
        uiHelper[0].model.age = this.getAge(this.personData);

        this.payload.uiHelper = JSON.stringify(uiHelper);
    }

    getAge({
        BirthMonth,
        BirthDay,
        BirthYear,
        DeathMonth,
        DeathDay,
        DeathYear,
    }) {

        const M2N = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,

        }

        if (
        !BirthMonth.Value
        || !BirthDay.Value
        || !BirthYear.Value
        || !DeathMonth.Value
        || !DeathDay.Value
        || !DeathYear.Value
        ) {
        return '';
        }

        if (BirthYear.Value !== DeathYear.Value) {
            if (BirthYear.Value > DeathYear.Value) {
              return '';
            }

            if (M2N[DeathMonth.Value] !== M2N[BirthMonth.Value]) {
              const minus = (M2N[DeathMonth.Value] - M2N[BirthMonth.Value] < 0 ? 1 : 0);
              return `Age ${DeathYear.Value - BirthYear.Value - minus}`;
            } else {
              const minus = (DeathDay.Value - BirthDay.Value < 0 ? 1 : 0);
              return `Age ${DeathYear.Value - BirthYear.Value - minus}`;
            }
        }

        if (BirthMonth.Value !== DeathMonth.Value) {
          if (BirthMonth.Value > DeathMonth.Value) {
            return '';
          }
        const minus = (DeathDay.Value - BirthDay.Value < 0 ? 1 : 0);
        return `Age ${M2N[DeathMonth.Value] - M2N[BirthMonth.Value] - minus} mths`;
        }

        if (BirthDay.Value !== DeathDay.Value) {
          if (BirthDay.Value > DeathDay.Value) {
            return '';
          }
        return `Age ${DeathDay.Value - BirthDay.Value} dys`;
        }

        return `1 day`;
    }

    findIndex(layouts, guid) {
        let index = 0;
        layouts.forEach((l, i) => {
            if (l.guid === guid) {
                index = i;
            }
        });
        return index;
    }

    reorder(newTargets) {
        const currentInfo = this.payload.layouts.map((layout, index) => {
          return {
            layoutInfo: layout,
            uiHelperInfo: this.payload.uiHelper[index]
          }
        });

        const newUiHelper = newTargets.map((item) => {
          const element = currentInfo.find(info => info.layoutInfo.guid === item.guid);
          return element ? element.uiHelperInfo : null;
        });

        this.payload.layouts = cloneDeep(newTargets);
        this.payload.uiHelper = cloneDeep(newUiHelper);
        this.selectedScene = 0;
        this.submitVideo();
    }

    scenesInit() {
        const defaultLayout = this.wibbitzBase.layouts.find(layout => layout.isDefaultScene);
        this.payload.layouts = [
            cloneDeep(defaultLayout),
        ];

        this.payload.layouts[0].elements = this.payload.layouts[0].elements.map((element) => {
            element.value = '';
            return element;
        });

        this.payload.uiHelper = [
            cloneDeep(
                Object.values(LayoutIdentifiers).find(model => model.name === defaultLayout.name),
            ),
        ];

        let birthDate = this.personData.BirthMonth ? new Date(`${this.personData.BirthMonth.Value.substring(0,3)} ${this.personData.BirthDay.Value}, ${this.personData.BirthYear.Value}`) : undefined;
        let deathDate = this.personData.DeathMonth ? new Date(`${this.personData.DeathMonth.Value.substring(0,3)} ${this.personData.DeathDay.Value}, ${this.personData.DeathYear.Value}`) : undefined;
        let isValidDate: boolean = birthDate && !isNaN(birthDate.getTime()) && !isNaN(deathDate.getTime());
        let age = isValidDate ? `${+this.personData.DeathYear.Value - +this.personData.BirthYear.Value}` : '';

        this.payload.uiHelper[0].model.firstName = isNil(this.personData.NameFirst.Value) ? '' : this.personData.NameFirst.Value;
        this.payload.uiHelper[0].model.lastName = isNil(this.personData.NameLast.Value) ? '' : this.personData.NameLast.Value;
        this.payload.uiHelper[0].model.middleName = isNil(this.personData.NameMiddle.Value) ? '' : this.personData.NameMiddle.Value;
        this.payload.uiHelper[0].model.nickName = isNil(this.personData.NameNick.Value) ? '' : this.personData.NameNick.Value;
        this.payload.uiHelper[0].model.description = 'In loving memory.';
        this.payload.uiHelper[0].model.birthDate = birthDate ? birthDate : '';
        this.payload.uiHelper[0].model.deathDate = deathDate ? deathDate : '';
        this.payload.uiHelper[0].model.age = this.getAge(this.personData);

        this.payload.selectedAudio = this.wibbitzBase.audioTracks[0];

        this.submitVideo();
        // this.payload.selectedAudio = this.wibbitzBase()
    }

    disableDefaultFromBaseScenes() {
        this.wibbitzBase.layouts = this.wibbitzBase.layouts.map(layout => {
            if (layout.isDefaultScene) {
                layout.isDefaultScene = false;
            }

            return layout;
        });
    }

    checkForNames() {
        return this.payload.uiHelper.some((helper) => {
            if (helper.name === 'LAT_scene_01_person') {
                if (helper.model.firstName === '') {
                    this.showSnack('alert', 'No value present for the element Name in layout Person Intro.');
                    return true;
                }

                if (helper.model.lastName  === '') {
                    this.showSnack('alert', 'No value present for the element LastName in layout Person Intro.');
                    return true;
                }
            }

            return false;
        });
    }

    submitVideo(callback?: any) {
        this.saving = true;
        this.payload.draftId = this.wibbitzVideoDraftId;

        this.parsePayload();

        const payload = cloneDeep(this.payload);

        payload.uiHelper = JSON.stringify(payload.uiHelper);
        this.wibbitzOrderService.uploadDraft(this.wibbitzOrderId, this.aditId, payload).subscribe(re => {
            const parsedResponse: any = re;
            parsedResponse.uiHelper = JSON.parse(parsedResponse.uiHelper);

            this.payload = parsedResponse;
            this.saving = false;
            if (callback) {
              callback();
            }

            /* this.wibbitzOrderService.validatePayload(this.wibbitzOrderId, this.payload).subscribe((r: string) => {
                if (r.length) {
                    this.showSnack('warning', `Draft saved. ${r}`, 2000);
                } else  {
                    this.showSnack('info', `Draft saved.`, 2000);
                }
            },
            error => {
                this.showSnack('error', `An error ocurred ${error}.`);
            });*/
        },
        err => {
            console.error(err);
            this.saving = false;
        });
    }

    getAdPrintImage() {
        return null;
        // const printOrderItem = this.orderInfo.find()
    }

    saveVideoTrack(track) {
        this.payload.selectedAudio = track;
        this.submitVideo();
    }

    /*postVideo() {
        this.wibbitzOrderService.uploadDraft(this.wibbitzOrderId, this.aditId, this.payload).subscribe((re: any) => {
            if (re.statusMessage) {
                this.showSnack('alert', `${re.statusMessage}`);
            } else  {
                this.showSnack('info', `Draft saved.`);
            };
        });
    }*/

    parsePayload() {
        this.payload.layouts = this.payload.layouts.map((layout, index) => {

            // rules to to pass uiHelper info  to layouts
            if (layout.name === LayoutIdentifiers.LAT_SCENE_01_PERSON.name) {
                layout.elements = Scene1Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_03.name) {
                layout.elements = Scene2Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_02_EVENTS.name) {
                layout.elements = Scene3Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_04.name) {
                layout.elements = Scene4Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_05.name) {
                layout.elements = Scene5Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_06.name) {
                layout.elements = Scene6Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_07.name) {
                layout.elements = Scene7Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_08.name) {
                layout.elements = Scene8Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_09.name) {
                layout.elements = Scene9Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            if (layout.name === LayoutIdentifiers.LAT_SCENE_10.name) {
                layout.elements = Scene10Helper.parse(layout.elements, this.payload.uiHelper[index].model);
            }

            return layout;
        });
    }

    backRedirect() {
        this.payload.draftId = this.wibbitzVideoDraftId;
        this.parsePayload();
        const payload = cloneDeep(this.payload);
        payload.uiHelper = JSON.stringify(payload.uiHelper);
        this.wibbitzOrderService.uploadDraft(this.wibbitzOrderId, this.aditId, payload).subscribe(re => {
            this.showSnack('info', `Draft saved`, 2000);
            
            if (!this.isCustomerSession)
            {
                setTimeout(() => {
                    if (!this.orderInfo.AditId) {
                        this.router.navigateByUrl(`/drafts/${this.orderInfo.AdSSId}/configure?selectedTab=3`);
                        return;
                    }
                    this.router.navigate([`/orders/${this.orderInfo.AditId}`]);
                },2000);
            }
        },
        err => console.error(err),
        );
    }

    srcToFile(src, fileName, mimeType){
        return (fetch(src)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], fileName, {type:mimeType});})
        );
    }

    saveAndSubmit() {
        if (this.checkForNames()) {
            return;
        }

        this.saving = true;

        this.parsePayload();

        const payload = cloneDeep(this.payload);

        payload.uiHelper = JSON.stringify(payload.uiHelper);
        let file = null;
        this.srcToFile(
            this.coverSrc,
            'cover',
            'data:image/png;base64',
        ).then((f)=>{
            file = f;
            combineLatest([
                this.wibbitzOrderService.uploadVideoCover(this.wibbitzVideoDraftId, file),
                this.wibbitzOrderService.submitDraft(this.wibbitzOrderId, this.aditId, this.adLogin, this.isEditVideo, payload),
            ]).subscribe(([cover, submit]) => {
                const parsedResponse: any = submit;
                parsedResponse.uiHelper = JSON.parse(parsedResponse.uiHelper);

                this.payload = parsedResponse;

                this.saving = false;
                if (parsedResponse.StatusMessage) {
                    this.showSnack('alert', `${parsedResponse.StatusMessage}`, 9000);
                } else  {
                    if(!this.isFromAdit || this.isCustomerSession){
                        this.showSubmitSuccessModal();
                    } else {
                        let body = "You will be returned to Order Entry.";
                        let confirmPopup = this.discardModalService.showAditMessage(body);
                        window.parent && window.parent.postMessage('wibbitzvideosubmit', "*");
                    }
                };
            },
            err => {
                console.error(err);
                this.saving = false;
            });
        });

    }

    showSubmitSuccessModal() {
        const modalRef = this.ngbModal.open(NgbMessageModalComponent, {
          backdrop: 'static'
        });
        modalRef.componentInstance.message = ModalMessages.VIDEO_SUBMIT_SUCCESS_MESSAGE;
        modalRef.componentInstance.close = () => modalRef.close();
        modalRef.componentInstance.primaryAction = () => {
            this.redirectToOrder();
            modalRef.close();
        };
        modalRef.componentInstance.secondaryAction = null;
    }

    redirectToOrder() {
        if (this.isCustomerSession) {
            this.router.navigate([`/managevideo/${this.wibbitzVideoDraftId}`]);
        }
        else {
            this.router.navigate([`/orders/${this.orderInfo.AditId}`]);
        }
    }

    open() {

    }

    refresh() {
        this.wibbitzOrderService.getVideoDraft(this.wibbitzVideoDraftId).subscribe((response: any) => {
            response.uiHelper = JSON.parse(response.uiHelper);
            this.payload = response;
        });
    }

    refreshInfo() {
        this.parsePayload();
        this.payload = cloneDeep(this.payload);

        this.payload.draftId = this.wibbitzVideoDraftId;
        this.parsePayload();
        const payload = cloneDeep(this.payload);
        payload.uiHelper = JSON.stringify(payload.uiHelper);
        this.wibbitzOrderService.uploadDraft(this.wibbitzOrderId, this.aditId, payload).subscribe(re => {

        });
    }

}

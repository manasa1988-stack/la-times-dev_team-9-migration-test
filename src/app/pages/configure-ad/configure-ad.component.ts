import { Component, ViewChild, ElementRef } from "@angular/core";
import { BaseClass } from "../../shared/base.class";
import { Router, ActivatedRoute, Params, RouterStateSnapshot } from '@angular/router';
import { ICreateOrderRequest } from '../../models/create-order.request.model';
import { IOrder, IOrderItem, IVolumeDiscount } from '../../models/order-item.model';
import { ConfigureAdService } from './configure-ad.service';
import { DraftOrdersService } from '../draft-orders/draft-orders.service';
import * as adssMetadata from '../../shared/adss.metadata';
import { FormControlName, FormGroup, FormBuilder, Validator, Validators, FormArray, FormControl } from "@angular/forms";
import { StorageService } from "../../shared/storage.service";
import { IUser } from "../../models/user.model";
import { isNullOrUndefined, isNull } from 'util';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { IAvailableDates } from "../../models/availabledates.model";
import { IImpression } from "../../models/impression.model";
import { IGetPriceRequest, IUpdateOrderState } from '../../models/getPrice.request.model';
import { IEditOrderItem } from "../../models/edit-order-item.model";
import { DateFormatPipe } from '../../filters/dateformat.pipe';
import { IOrderItemPrice } from "../../models/order-item-price.model";
import { IConfigureDFPData } from "../../models/dfp-data.model";
import { DiscardModalService } from "../../shared/discard-modal.service";
import { CookieService } from "../../shared/cookies.service";
import { IMarketSettings } from "../../models/market-settings.model";
import { UserDetailsService } from "../user-details/user-details.service";
import { SizeComponent } from "./size/size.component";
import { ILayoutCarouselItem, ILayout } from "../../models/layout.model";
import { LayoutService } from "./size/layout.service";
import { OtherInfoComponent } from "./other-info/other-info.component";
import { WibbitzService } from '../../shared/services';
import * as moment from 'moment';
import * as isNil from 'lodash/isNil';
import * as cloneDeep from 'lodash/cloneDeep';
import { LayoutIdentifiers } from "../design-video/constants";
// import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { IOptOutSubscription } from "../../models/optoutsubscription.model";
import { ThemeSettingsService } from "../../../admin/theme-settings/theme-settings.service";
//import { t } from "@angular/core/src/render3";
@Component({
  selector: "configure-ad",
  templateUrl: "./configure-ad.component.html",
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1, display: 'block' })),
      state('false', style({ opacity: '0', display: 'none' })),
      transition('0 => 1', animate('.75s')),
      transition('1 => 0', animate('.75s'))
    ])
  ]
})
export class ConfigureAdComponent extends BaseClass {
  campaignNameForm: FormGroup;
  projectNameForm: FormGroup;
  request: ICreateOrderRequest[] = [];
  order: IOrder;
  currentOrderItem: IOrderItem;
  adssId: number;
  currentOrderItemId: number;
  isOrderReady: boolean = false;
  selectedIndex: number = 0;
  updateDraftParam: boolean = false;
  panelOpenState: boolean = false;
  hideShowAnimator: boolean = false;
  searchedText: string;
  isCartOpen: boolean = false;
  hideLinesForSectionIds: number[];
  orderItemTypes = adssMetadata.OrderItemType;
  user: IUser;
  availableDates: IAvailableDates;
  selectedZones: number[];
  isScheduleCompleted: boolean = true;
  isLayoutCompleted: boolean = true;
  isOtherInfoCompleted: boolean = true;
  // selectedPubDates: Date[];
  selectedZonesCsv: string;
  volumeDiscounts: IVolumeDiscount[];
  impressions: IImpression[] = [];
  orderItemPrice: IOrderItemPrice;
  getpriceRequest: IGetPriceRequest;
  otherInfoFormValues: FormArray;
  upsellFormGroup: FormGroup;
  upsellFormArray: any[] = [];
  otherInfoFormGrp: any[] = [];
  volumeDiscountID: number = -1;
  upsellVisible: boolean = false;
  fieldType = adssMetadata.FieldType;
  upsellFormObject: any;
  configureDFPData: IConfigureDFPData;
  updateOrderState: IUpdateOrderState;
  warningMessageCss: string = '';
  warningIcon: string = '';
  errorMessagesFromResponse: string[] = [];
  currentorderItemPrice: number;
  customerSupport: IMarketSettings;
  campaingnNameValid: boolean = true;
  campaignNameErrorMessage: string = '';
  count: number = 0;
  private intervalId: any;
  showRefreshLoader: boolean = false;
  layoutData: ILayoutCarouselItem;
  selectedAdSize: ILayout;
  isFetchingUserData: Boolean = false;
  public renderInfo = {};
  selectedOptOutReasonId:number;
  optOutReasonRequired:boolean;
  OptOutReason:string;
  OtherOptOutReason:string;
  OptOutSubscription:IOptOutSubscription;
  eventFromadditionalProducts: Boolean  = false;
  @ViewChild('cover',{static:true}) cover;
  @ViewChild('configure',{static:true}) public configure: ElementRef;
  @ViewChild('top',{static:true}) public top: ElementRef;
  @ViewChild('campaign',{static:true}) public campaign: ElementRef;
  @ViewChild(SizeComponent,{static:true}) sizeComponent: SizeComponent;
  @ViewChild(OtherInfoComponent,{static:true}) otherInfoComponent: OtherInfoComponent;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private configureAdService: ConfigureAdService,
    private draftOrdersService: DraftOrdersService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private dateFormatPipe: DateFormatPipe,
    private cookieService: CookieService,
    private discardModalService: DiscardModalService,
    private userDetailsService: UserDetailsService,
    private layoutService: LayoutService,
    private http: HttpClient,
    private wibbitzService: WibbitzService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);

    (<any>window)._trackPage('ADSS - Configure - Ad', this.route.snapshot.url);
    this.configureAdService.tabIndexObservable.subscribe(value => {
      this.selectedIndex = value;
      this.moveToSpecificView(this.selectedIndex);
    });
    this.user = this.storageService.getUserInfo();
    this.hideLinesForSectionIds = isNullOrUndefined(this.storageService.getHOST()) ? null : this.storageService.getHOST().HideLinesForSectionIds;
  }

  createOrderRequest() {
    this.currentOrderItemId = undefined;
    this.order = undefined;
    this.currentOrderItem = undefined;
    this.isOrderReady = false;
    // this.availableDates = undefined;
    this.availableDates = undefined;
    this.selectedZones = undefined;
    this.isScheduleCompleted = true;
    this.isLayoutCompleted = true;
    this.isOtherInfoCompleted = true;
    this.selectedZonesCsv = ''
    this.volumeDiscounts = undefined;
    this.impressions = undefined;
    this.orderItemPrice = undefined;
    this.getpriceRequest = undefined;
    this.otherInfoFormValues = undefined;
    this.upsellFormGroup = undefined;
    this.upsellFormArray = undefined;
    this.otherInfoFormGrp = undefined;
    this.volumeDiscountID = undefined;
    this.upsellVisible = false;
    this.upsellFormObject = undefined;
    this.configureDFPData = undefined;
    this.updateOrderState = undefined;
    this.currentorderItemPrice = undefined;
    this.campaingnNameValid = true;
    this.layoutData = undefined;
    

    this.route.params.subscribe((params: Params) => {

      this.adssId = params['draftId'] ? params['draftId'] : null;
      this.currentOrderItemId = params['currentOrderItemId'] ? params['currentOrderItemId'] : null;
      if (this.adssId) {
        this.getOrderConfigurationData();
      }
    });
  }

  validationInit() {
    this.warningMessageCss = 'alert bg-warning';
    this.warningIcon = 'fa fa-exclamation-triangle';
    this.customerSupport = <IMarketSettings>this.storageService.getHOST();
    this.checkStatus();
    this.intervalId = setInterval(() => { this.checkStatus(); }, 1000);
    this.createOrderRequest();
  }

  checkStatus = function () {
    if (this.isUserLoggedIn()) {
      if (this.storageService.getUserInfo() == null) {
        if (!this.isFetchingUserData) {
          this.isFetchingUserData = true;
          this.userDetailsService.getUser().subscribe((data) => {
            this.userDetailsService.storeUserDetails(data);
            ////this.redirect();
          });
        }
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
    window.location.reload();
  }

  isUserLoggedIn() {
    return this.cookieService.check('c_mId');
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  campaignNameEntered(event) {
    this.searchedText = event.target.value;
  }

  submit() {
    this.router.navigateByUrl("/drafts/" + this.adssId + "/purchase");
  }

  getOrderConfigurationData() {
    this.isOrderReady = false;
    this.draftOrdersService.getDraftSummary(this.adssId, this.currentOrderItemId)
      .subscribe(data => {
        console.log(data);
        this.order = data;
        if (!this.order.IsDraft) {
          let orderId = !isNullOrUndefined(this.order.AditId) && this.order.AditId > 0 ? this.order.AditId : this.order.AdSSId
          this.order.AditId > 0 ? this.router.navigateByUrl("/orders/" + orderId) : this.router.navigateByUrl("/queued/" + orderId)
        }
        this.processResponse();
      },
        (error) => {
          // if (!isNullOrUndefined(error.error) && !isNullOrUndefined(error.error.ExceptionMessage)) {
          //    if (error.error.ExceptionMessage.includes('OrderNotFound'))
          //      this.router.navigateByUrl("/errors?code=OrderNotFound");
          // }
          this.isOrderReady = true;
        });
  }

  getOrderItemData() {

    if (this.currentOrderItem.IsDfpOrderItem) {
      this.isOrderReady = false;
      this.configureAdService.getDFPOrderDetails(this.adssId, this.currentOrderItem.Id).subscribe(receivedOrder => {
        if (receivedOrder.IsSuccess && !isNullOrUndefined(receivedOrder.Result)) {
          this.configureDFPData = receivedOrder.Result;
        }
        this.isOrderReady = true;
      });
    }
    else
      this.getImpressions();

    if (this.currentOrderItem.NumTargetOptions > 0 && !this.currentOrderItem.IsDfpOrderItem)
      this.selectedZones = this.currentOrderItem.TargetIds && this.currentOrderItem.TargetIds.length > 0 ? this.currentOrderItem.TargetIds : [];
    else
      this.selectedZones = this.currentOrderItem.ZoneIds && this.currentOrderItem.ZoneIds.length > 0 ? this.currentOrderItem.ZoneIds : [];
    this.orderItemPrice = <IOrderItemPrice>{};
    this.orderItemPrice.OrderPrice = this.order.Price;
    this.orderItemPrice.OrderItemPrice = this.currentOrderItem.Price;
    this.orderItemPrice.VolumeDiscountID = -1;
    this.getLayoutsData();
    this.getAvailableDates();
    this.getVolumeDiscounts();
    this.updateScheduleTabStatus();
    this.updateOtherInfoTabStatus();
    this.updateLayoutTabStatus();

    this.route.queryParams
      .subscribe(params => {
        if (params.selectedTab) {
          this.selectedIndex = params.selectedTab;
          this.updateDraftParam = params.updateDraft;
          this.moveToSpecificView(this.selectedIndex);
        }
      });

  }

  processResponse() {
    this.order.OrderItems.forEach(item => {
      item.showLines = this.hideLinesForSectionIds != undefined && this.hideLinesForSectionIds != null ? !this.hideLinesForSectionIds.includes(item.SectionId) : true;
      item.isScheduleCompleted = true;
      item.isLayoutCompleted = true;
      item.isOtherInfoCompleted = true;

      if (item.NumTargetOptions > 0 && !item.IsDfpOrderItem) {
        if (!item.TargetIds || item.TargetIds.length == 0)
          item.isScheduleCompleted = false;
      }
      else if (!item.IsHideZoneSection) {
        if (!item.ZoneIds || item.ZoneIds.length == 0)
          item.isScheduleCompleted = false;
      }
      if (item.IsDfpOrderItem) {
        if (isNullOrUndefined(item.NumImpressions) || item.NumImpressions == 0 || isNullOrUndefined(item.NumDays) || item.NumDays == 0 || isNullOrUndefined(item.AvailableUnits) || item.AvailableUnits == 0 ||
          (!isNullOrUndefined(item.StartDate) && !isNullOrUndefined(item.EndDate) && item.EndDate <= item.StartDate)) {
          item.isScheduleCompleted = false;
        }
      }
      if ((!item.RunDates || item.RunDates.length == 0) && !item.RunDateString) {
        item.isScheduleCompleted = false;
      }

      if(this.order.HasSubscriptionLine && this.order.IsPackageOrder)
      {
        
        var orderItem =this.order.OrderItems.filter(x => x.Section.IsSubscriptionSection);
        
        if(!orderItem || orderItem.length==0)
        {
          
          if(this.optOutReasonRequired)
          {
            
            if(isNullOrUndefined(this.selectedOptOutReasonId))
            {
              
              item.isScheduleCompleted = false;
            }
            else if(this.selectedOptOutReasonId <= 0 && (this.OtherOptOutReason == '' || this.OtherOptOutReason == undefined))
            {
              
              item.isScheduleCompleted = false;
            }
            else{
              //insert optout
              if(this.eventFromadditionalProducts)
             this.prepareOptOutReasonAddData();
            }
          }
          else{
            //insert optout
            if(this.eventFromadditionalProducts)
           this.prepareOptOutReasonAddData();
          }
        }
        else{
          this.configureAdService.deleteSubOptOutFromCache(this.order.AdSSId).subscribe(data => {
            
            if (data.IsSuccess) {
            }
          });;
        }
      }

      if (item.ClassCodeGroup && item.ClassCodeGroup.ClassCodes && item.ClassCodeGroup.ClassCodes.length > 1) {
        if (isNullOrUndefined(item.ClassCodeValue) || item.ClassCodeValue == '')
          item.isLayoutCompleted = false;
      }
      if (item.TypeId == this.orderItemTypes['OnlineDisplayOrderItem'] || item.IsDfpOrderItem) {
        if (!item.IsValidClickThroughUrl) {
          item.isLayoutCompleted = false;
        }
      }
      if (item.IsAdMaterialRequired) {
        if (!item.HasAdMaterialDefined) {
          item.isLayoutCompleted = false;
        }
      }

      if (!isNullOrUndefined(item.UpsellAttributes) && item.UpsellAttributes.length > 0) {
        this.order.isOtherInfoVisible = true;
      }



      let inCompleteTabNames = [];
      if (!item.isScheduleCompleted)
        inCompleteTabNames.push(" <i class='fa fa-calendar font-21'></i> Schedule");
      if (!item.isLayoutCompleted)
        inCompleteTabNames.push(" <i class='fa fa-laptop font-21'></i> Layout");
      if (!item.isOtherInfoCompleted)
        inCompleteTabNames.push(" <i class='material-icons font-21 align-top'>note_add</i> Other-Info");
      if (inCompleteTabNames.length > 0)
        item.inCompleteTabNames = inCompleteTabNames.join(",");

    });

    for (let grp of this.order.AttributeDisplayGroups) {
      let attributeGroup: any[] = [];
      for (let attribute of grp.Attributes) {
        if ((attribute.Type['Id'] != this.fieldType['Image'] || attribute.IsOnlineClassifiedAttribute) && !attribute.IsForMaterial && (!attribute.IsForVerification || (attribute.IsForVerification && !this.order.IsVendor))) {
          attributeGroup.push(attribute);
        }
      }
      let filterAttributeGroup = attributeGroup.filter(data => data.ChargeTypeId == null);
      if (filterAttributeGroup.length > 0) {
        this.order.isOtherInfoVisible = true
        break;
      }

    }

    if (this.order.IsDocumentUpload || this.order.IsDocumentUploadRequired) { //&& this.order.IsLegalDocUpload
      this.order.isOtherInfoVisible = true;
    }

    if (this.currentOrderItemId) {
      this.currentOrderItem = this.order.OrderItems.find(orderItem => orderItem.Id == this.currentOrderItemId);
    }
    else if (this.order.PrimaryOrderItem)
      this.currentOrderItem = this.order.PrimaryOrderItem;
    else
      this.currentOrderItem = this.order.OrderItems[0];


    this.currentorderItemPrice = this.currentOrderItem.Price;
    this.currentOrderItemId = this.currentOrderItem.Id;
    this.getOrderItemData();
    // this.isOrderReady = true;
    this.currentOrderItem.IsDfpOrderItem ? this.buildCampaignForm() : '';
    this.buildProjectName();

    console.log('print ad verified : ' + this.currentOrderItem.isLayoutCompleted);
    if(this.currentOrderItem.isLayoutCompleted){
      const wibbitzOrderItem = this.order.OrderItems.find(item => item.IsWibbitzProduct);
      if (!isNil(wibbitzOrderItem) && !wibbitzOrderItem.VideoDraftId) {
        var payLoad = {};
        let printAttr: any;
        printAttr = this.order.AttributeValues;
        let birthDate: any = '';
        if (printAttr.BirthMonth.Value && printAttr.BirthDay.Value && printAttr.BirthYear.Value) {
          birthDate = new Date(`${printAttr.BirthMonth.Value.substring(0, 3)} ${printAttr.BirthDay.Value}, ${printAttr.BirthYear.Value}`);
        }

        let deathDate: any = '';
        if (printAttr.DeathMonth.Value && printAttr.DeathDay.Value && printAttr.DeathYear.Value) {
          deathDate = new Date(`${printAttr.DeathMonth.Value.substring(0,3)} ${printAttr.DeathDay.Value}, ${printAttr.DeathYear.Value}`);
        }

        const dateFormat = 'MMMM DD, YYYY';
        const bDay = birthDate !== '' ? moment(birthDate).format(dateFormat) : '';
        const dDay = deathDate !== '' ? moment(deathDate).format(dateFormat) : '';

        let firstName = printAttr.NameFirst && printAttr.NameFirst.Value && printAttr.NameFirst.Value != null ? printAttr.NameFirst.Value.trim() : '';
        let lastName = printAttr.NameLast && printAttr.NameLast.Value && printAttr.NameLast.Value != null ? printAttr.NameLast.Value.trim() : '';
        let middleName = printAttr.NameMiddle && printAttr.NameMiddle.Value && printAttr.NameMiddle.Value != null ? printAttr.NameMiddle.Value.trim() : '';
        let nickName = printAttr.NameNick && printAttr.NameNick.Value && printAttr.NameNick.Value != null ? printAttr.NameNick.Value.trim() : '';

        payLoad["orderId"] = this.order.AdSSId;
        payLoad["orderItemId"] = wibbitzOrderItem.Id;
        payLoad["adMaterialId"] = this.currentOrderItem.AdMaterial[0].Id;
        payLoad["Name"] = `${firstName}${middleName? ` ${middleName}` : ''}${nickName? ` '${nickName}'` : ''} ${lastName}`;
        payLoad["smallText"] = 'In loving memory.';
        payLoad["Dates"] = `${bDay}\r${dDay}`;
        payLoad["Age"] = this.getAge(printAttr);
        payLoad["mediaComp"] = printAttr.Photo1.Value ? printAttr.Photo1.Value : '';

        console.log('create draft payload', payLoad);
        this.wibbitzService.createDraft(payLoad).subscribe(re => {
          const response: any = re;
          wibbitzOrderItem.VideoDraftId = response.draftId;

          this.cover.wibbitzVideoDraftId = response.draftId;
          this.cover.info = {
            name: `${firstName}${middleName? ` ${middleName}` : ''}${nickName? ` '${nickName}'` : ''} ${lastName}`,
            dates: (birthDate !== '' && birthDate !== '') ? `${bDay}\r${dDay}` : '',
            smallText:'In loving memory.',
            media: response.layouts[0].elements.find(r=>r.id==='mediaComp').value,
            age: this.getAge(printAttr),
          }

          this.cover.startRendering();

          this.order.OrderItems = this.order.OrderItems.map((item) => {
            if (item.IsWibbitzProduct) {
              item.VideoDraftId = response.draftId;
            }

            return item;
          });
        },
        err => console.error(err),
        );
      }
      /* else if (!isNil(wibbitzOrderItem) && wibbitzOrderItem.VideoDraftId && this.updateDraftParam) {
        console.log('this.updateDraftParam',this.updateDraftParam);
        const payload: any = JSON.parse(wibbitzOrderItem.VideoJson);
        let noHelper = false;

        if(!payload.uiHelper) {
          payload.uiHelper = [cloneDeep(LayoutIdentifiers.LAT_SCENE_01_PERSON)];
          noHelper = true;
        } else {
          payload.uiHelper = JSON.parse(payload.uiHelper);
        }
        let printAttr: any;
        printAttr = this.order.AttributeValues;
        let birthDate: any = '';
        if (
          printAttr.BirthMonth.Value !== ''
          && printAttr.BirthDay.Value !== ''
          && printAttr.BirthYear.Value !== ''
        ) {
          birthDate = new Date(`${printAttr.BirthMonth.Value.substring(0, 3)} ${printAttr.BirthDay.Value}, ${printAttr.BirthYear.Value}`);
        }

        let deathDate: any = '';
        if (
          printAttr.DeathMonth.Value !== ''
          && printAttr.DeathDay.Value !== ''
          && printAttr.DeathYear.Value !== ''
        ) {
          deathDate = new Date(`${printAttr.DeathMonth.Value.substring(0,3)} ${printAttr.DeathDay.Value}, ${printAttr.DeathYear.Value}`);
        }

        const dateFormat = 'MMMM DD, YYYY';
        const bDay = birthDate !== '' ? moment(birthDate).format(dateFormat) : '';
        const dDay = deathDate !== '' ? moment(deathDate).format(dateFormat) : '';

        let firstName = printAttr.NameFirst && printAttr.NameFirst.Value && printAttr.NameFirst.Value != null ? printAttr.NameFirst.Value : '';
        let lastName = printAttr.NameLast && printAttr.NameLast.Value && printAttr.NameLast.Value != null ? printAttr.NameLast.Value : '';
        let middleName = printAttr.NameMiddle && printAttr.NameMiddle.Value && printAttr.NameMiddle.Value != null ? printAttr.NameMiddle.Value : '';
        let nickName = printAttr.NameNick && printAttr.NameNick.Value && printAttr.NameNick.Value != null ? printAttr.NameNick.Value : '';

        payload.layouts[0].elements.find((r) => r.id === "Name").value = `${firstName}${middleName? ` ${middleName}` : ''}${nickName? ` '${nickName}'` : ''} ${lastName}`;
        payload.layouts[0].elements.find((r) => r.id === "Dates").value = (birthDate !== '' && birthDate !== '') ? `${bDay}\r${dDay}` : '';
        payload.layouts[0].elements.find((r) => r.id === "Age").value = this.getAge(printAttr);

        payload.uiHelper[0].model.firstName = firstName;
        payload.uiHelper[0].model.lastName = lastName;
        payload.uiHelper[0].model.birthDate = birthDate;
        payload.uiHelper[0].model.deathDate = deathDate;
        payload.uiHelper[0].model.middleName = middleName;
        payload.uiHelper[0].model.nickName = nickName;

        if (noHelper) {
          payload.uiHelper[0].model.description = 'In loving memory.';
        }

        payload.uiHelper[0].model.age = this.getAge(printAttr);
        payload.layouts[0].elements.find((r) => r.id === "Age").value = this.getAge(printAttr);

        payload.uiHelper = JSON.stringify(payload.uiHelper);

        this.wibbitzService.uploadDraft(wibbitzOrderItem.Id,null,payload).subscribe(
          re => console.log('Draft saved'),
          err => console.error(err),
        );
      }
      */
    }
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

  buildCampaignForm() {
    this.campaignNameForm = this.formBuilder.group({
      'campaignName': [!isNullOrUndefined(this.order) ? this.order.DfpCampaignName : '', Validators.required]
    });

    if (this.currentOrderItem.IsDfpOrderItem){
      if(!this.campaignNameForm.valid)
      {
        this.campaingnNameValid = false;
        this.campaignNameMessage = "required."
      }
      else{
        this.campaingnNameValid = true;
        this.campaignNameMessage = "set."
      }

    }

  }

  buildProjectName() {
    this.projectNameForm = this.formBuilder.group({
      'projectName': [this.order.Description, Validators.maxLength(40)]
    })

  }

  switchTab(index: number) {
    if (index == 0)
      (<any>window)._trackEvent('Configure Ad', 'Click Schedule Tab', 'Toggle', 'Schedule Tab Active');
    else if (index == 1)
      (<any>window)._trackEvent('Configure Ad', 'Click Layout Tab', 'Toggle', 'Layout Tab Active');
    else if (index == 2)
      (<any>window)._trackEvent('Configure Ad', 'Click OtherInfo Tab', 'Toggle', 'OtherInfo Tab Active');
    else if (index == 3)
      this.saveDraft(false);

    // this.selectedIndex = index;
    this.configureAdService.setTabIndex(index);

  }

  showMore() {
    this.hideShowAnimator = !this.hideShowAnimator;
  }


  updateScheduleTabStatus() {
    this.isScheduleCompleted = true;
    if (this.currentOrderItem.NumTargetOptions > 0 && !this.currentOrderItem.IsDfpOrderItem) {
      if (!this.currentOrderItem.TargetIds || this.currentOrderItem.TargetIds.length == 0)
        this.isScheduleCompleted = false;
    }
    else if (!this.currentOrderItem.IsHideZoneSection) {
      if (!this.currentOrderItem.ZoneIds || this.currentOrderItem.ZoneIds.length == 0)
        this.isScheduleCompleted = false;
    }
    if (this.currentOrderItem.IsDfpOrderItem) {

      if (isNullOrUndefined(this.currentOrderItem.NumImpressions) || this.currentOrderItem.NumImpressions == 0 || isNullOrUndefined(this.currentOrderItem.NumDays) || this.currentOrderItem.NumDays == 0 || isNullOrUndefined(this.currentOrderItem.AvailableUnits) || this.currentOrderItem.AvailableUnits == 0 ||
        isNullOrUndefined(this.currentOrderItem.StartDate) || isNullOrUndefined(this.currentOrderItem.EndDate) ||
        (!isNullOrUndefined(this.currentOrderItem.StartDate) && !isNullOrUndefined(this.currentOrderItem.EndDate) && this.currentOrderItem.EndDate <= this.currentOrderItem.StartDate)) {
        this.isScheduleCompleted = false;
      }
    }
    else {
      if ((!this.currentOrderItem.RunDates || this.currentOrderItem.RunDates.length == 0) && !this.currentOrderItem.RunDateString) {
        this.isScheduleCompleted = false;
      }
      if (this.currentOrderItem.NumOfInsertions > 0 && (!this.currentOrderItem.RunDates || this.currentOrderItem.NumOfInsertions > this.currentOrderItem.RunDates.length)) {
        this.isScheduleCompleted = false;
      }
    }
    if(this.order.HasSubscriptionLine && this.order.IsPackageOrder)
    {
      
      var orderItem =this.order.OrderItems.filter(x => x.Section.IsSubscriptionSection);
      
      if(!orderItem || orderItem.length==0)
      {
        
        if(this.optOutReasonRequired)
        {
          
          if(isNullOrUndefined(this.selectedOptOutReasonId))
          {
            
            this.isScheduleCompleted = false;
          }
          else if(this.selectedOptOutReasonId <= 0 && (this.OtherOptOutReason == '' || this.OtherOptOutReason == undefined))
          {
            
            this.isScheduleCompleted = false;
          }
          else{
            
            //insert optout
            if(this.eventFromadditionalProducts)
            this.prepareOptOutReasonAddData();
            
          }
        }
        else{
          //insert optout
          if(this.eventFromadditionalProducts)
          this.prepareOptOutReasonAddData();
        }
      }
      else{
        this.configureAdService.deleteSubOptOutFromCache(this.order.AdSSId).subscribe(data => {
          
          if (data.IsSuccess) {
          }
        });;
      }
    }

    this.order.OrderItems.find(e => e.Id == this.currentOrderItem.Id).isScheduleCompleted = this.isScheduleCompleted;
    this.currentOrderItem.isScheduleCompleted = this.isScheduleCompleted;
    this.currentOrderItem.IsOrderItemComplete = this.isScheduleCompleted && this.isLayoutCompleted && this.isOtherInfoCompleted && this.campaingnNameValid;
    this.order.OrderItems.find(e => e.Id == this.currentOrderItem.Id).IsOrderItemComplete = this.currentOrderItem.IsOrderItemComplete;
  }
  prepareOptOutReasonAddData()
  {
    
//if(this.selectedOptOutReasonId)
{
  this.OptOutSubscription = new IOptOutSubscription();
  this.OptOutSubscription.packageId = this.order.RemovableLines[0].PackageId;
  this.OptOutSubscription.packageName = this.order.PackageCode;
  this.OptOutSubscription.buCode = this.order.BUCode;
  this.OptOutSubscription.orderID = this.order.AdSSId;
  this.OptOutSubscription.optOutReasonID = this.selectedOptOutReasonId;
  this.OptOutSubscription.optOutReason = this.selectedOptOutReasonId && this.selectedOptOutReasonId > 0 ? this.OptOutReason : this.OtherOptOutReason;
  this.OptOutSubscription.customerID = null;
  this.OptOutSubscription.customerName ='';
  this.OptOutSubscription.customerNumber='';
  this.OptOutSubscription.salesRep='';
  
  this.configureAdService.saveSubOptOutInCache(this.OptOutSubscription).subscribe(data => {
    
    if (data.IsSuccess) {
    }
  });
}
    
  }

  updateLayoutTabStatus() {

    this.isLayoutCompleted = true;
    if (this.currentOrderItem.ClassCodeGroup && this.currentOrderItem.ClassCodeGroup.ClassCodes && this.currentOrderItem.ClassCodeGroup.ClassCodes.length > 1) {
      if (isNullOrUndefined(this.currentOrderItem.ClassCodeValue) || this.currentOrderItem.ClassCodeValue == '')
        this.isLayoutCompleted = false;
    }
    if (this.currentOrderItem.TypeId == this.orderItemTypes['OnlineDisplayOrderItem'] || this.currentOrderItem.IsDfpOrderItem) {
      if (!this.currentOrderItem.IsValidClickThroughUrl) {
        this.isLayoutCompleted = false;
      }
    }

    if (this.currentOrderItem.IsAdMaterialRequired) {
      if (!this.currentOrderItem.HasAdMaterialDefined)
        this.isLayoutCompleted = false;
    }


    this.order.OrderItems.find(e => e.Id == this.currentOrderItem.Id).isLayoutCompleted = this.isLayoutCompleted;
    this.currentOrderItem.isLayoutCompleted = this.isLayoutCompleted;
  }

  updateOtherInfoTabStatus() {

    this.currentOrderItem.isOtherInfoCompleted = this.isOtherInfoCompleted;
    this.order.OrderItems.find(e => e.Id == this.currentOrderItem.Id).isOtherInfoCompleted = this.isOtherInfoCompleted;

    this.currentOrderItem.IsOrderItemComplete = this.isScheduleCompleted && this.isLayoutCompleted && this.isOtherInfoCompleted && this.campaingnNameValid;
    this.order.OrderItems.find(e => e.Id == this.currentOrderItem.Id).IsOrderItemComplete = this.currentOrderItem.IsOrderItemComplete;
  
    if(this.isOtherInfoCompleted)
    {
        this.isOtherInfoCompleted = (this.order.IsDocumentUploadRequired && this.currentOrderItem.LstLegalDocs.length <= 0) ? false : true;
        this.currentOrderItem.isOtherInfoCompleted = this.isOtherInfoCompleted;
    }
  }

    onNotify($event: any) {
    if ($event.fromChild == "updateSection") {
      this.getOrderConfigurationData();
    }
    else {
      let callUpdateOrderState: boolean = false;
      if ($event.fromChild == "dfpDigitalProduct" || $event.fromChild == "NonDfpProduct") {
        callUpdateOrderState = true;
      }
      else
        if ($event.fromChild == "Schedule") {
          this.availableDates = $event.availableDates;
          this.selectedZones = $event.selectedZones;
        }
        else if($event.fromChild == "additionalProducts")
        {
          console.log('got event additionalProducts');
          console.log('$event.selectedOptOutReasonId '+$event.selectedOptOutReasonId);
          console.log('$event.optOutReasonRequired '+$event.optOutReasonRequired);
          console.log('$event.OtherOptOutReason '+$event.OtherOptOutReason);
          console.log('$event.OptOutReason '+$event.OptOutReason);
          this.eventFromadditionalProducts = true;
          this.selectedOptOutReasonId = $event.selectedOptOutReasonId;
          this.optOutReasonRequired = $event.optOutReasonRequired;
          this.OtherOptOutReason = $event.OtherOptOutReason;
          this.OptOutReason = $event.OptOutReason;
          callUpdateOrderState = true;

        }
        else
          if ($event.fromChild == "OtherInfo") {
            this.isOtherInfoCompleted = true;
            if (!isNullOrUndefined($event.grandChild) && $event.grandChild == "UploadLegalDoc") {
              this.updateOtherInfoTabStatus();
            }
            else {
              this.upsellFormGroup = $event.upsellFormGroup;
              this.otherInfoFormGrp = $event.formGroup;
              this.onNotifyOtherInfoChanges(this.otherInfoFormGrp);
              callUpdateOrderState = $event.callUpdateOrderState;
              if (!isNullOrUndefined(this.upsellFormGroup)) {
                let upsellFormArray = this.upsellFormGroup.value;
                for (let key of Object.keys(upsellFormArray)) {
                  this.order.AttributeValues[key].Value = upsellFormArray[key];
                }
              }
            }
          }

      if ($event.currentOrderItem != undefined) {
        this.currentOrderItem = $event.currentOrderItem;
      }

      if ($event.action && $event.action == 'startOver') {
        this.startOver($event);
      }
      else {
        if (!isNullOrUndefined($event.grandChild) && $event.grandChild == "adSize") {
          this.selectedAdSize = this.layoutData.ApiapplicableAdSize.find(o => o.AdSize.Id == this.currentOrderItem.AdSizeId);
        }
      }


      if (!isNullOrUndefined($event.grandChild)) {
        if ($event.grandChild == "selectTemplate" || $event.grandChild == "dfpTargetting" || $event.grandChild == "nonMaterialLayoutFields" || ($event.grandChild == "dfpInventory" && !isNullOrUndefined(this.currentOrderItem.RunDates) && this.currentOrderItem.RunDates.length == 0))
          callUpdateOrderState = true;
      }
      this.getpriceRequest = <IGetPriceRequest>{};
      this.updateOrderState = <IUpdateOrderState>{};
      let editOrderItemData = <IEditOrderItem>{};
      editOrderItemData.OrderId = this.order.AdSSId;
      editOrderItemData.OrderItemId = this.currentOrderItem.Id;
      editOrderItemData.AdSizeId = this.currentOrderItem.AdSizeId;
      editOrderItemData.AdTemplateCode = '';
      editOrderItemData.IsColor = this.currentOrderItem.IsColor;
      editOrderItemData.ClassCodeValue = !isNullOrUndefined(this.currentOrderItem.ClassCodeValue) ? this.currentOrderItem.ClassCodeValue : '';
      let pubdt: string[] = [];
      if (!isNullOrUndefined(this.currentOrderItem.RunDates) && this.currentOrderItem.RunDates.length > 0) {
        this.currentOrderItem.RunDates.forEach(dt => {
          pubdt.push(this.dateFormatPipe.transform(dt, "MM-dd-yyyy"));
        });

        editOrderItemData.PubDatesCsv = pubdt.join(",");
      }
      else
        editOrderItemData.PubDatesCsv = "";

      if (this.currentOrderItem.NumTargetOptions > 0)
        editOrderItemData.ZoneIdsCsv = !isNullOrUndefined(this.currentOrderItem.TargetIds) && this.currentOrderItem.TargetIds.length > 0 ? this.currentOrderItem.TargetIds.join(",") : '';
      else
        editOrderItemData.ZoneIdsCsv = !isNullOrUndefined(this.currentOrderItem.ZoneIds) && this.currentOrderItem.ZoneIds.length > 0 ? this.currentOrderItem.ZoneIds.join(",") : '';
      editOrderItemData.StartDate = this.dateFormatPipe.transform(this.currentOrderItem.StartDate, "MM-dd-yyyy");

      if (this.currentOrderItem.TypeId == this.orderItemTypes['OnlineDisplayOrderItem'] || this.currentOrderItem.IsDfpOrderItem)
        editOrderItemData.NumImpressions = this.currentOrderItem.NumImpressions;
      else
        editOrderItemData.NumImpressions = 0;

      if (this.currentOrderItem.IsDfpOrderItem)
        editOrderItemData.NumDays = !isNullOrUndefined(this.currentOrderItem.RunDates) ? this.currentOrderItem.RunDates.length : 0;
      else
        editOrderItemData.NumDays = isNullOrUndefined(this.currentOrderItem.NumDays) ? 0 : this.currentOrderItem.NumDays;
      editOrderItemData.DfpGeoTargetting = this.currentOrderItem.DfpGeoTargetting;
      editOrderItemData.SubsectionId = isNullOrUndefined(this.currentOrderItem.SubsectionId) ? 0 : this.currentOrderItem.SubsectionId;
      editOrderItemData.DfpCampaignName = this.order.DfpCampaignName;
      editOrderItemData.PositionHeaderId = this.currentOrderItem.PositionHeaderId;
      editOrderItemData.AvailableUnits = this.currentOrderItem.AvailableUnits;
      editOrderItemData.DFPCostModel = this.currentOrderItem.DFPCostModel;
      editOrderItemData.DFPProductId = 0;
      editOrderItemData.DFPProductName = '';
      editOrderItemData.ClickThroughUrl = this.currentOrderItem.ClickThroughUrl;
     // editOrderItemData.IsOnlineProductStartDateModifiedByUser = true;

      this.getpriceRequest.FormCollection = {};

      if (!isNullOrUndefined(this.order.Description))
        this.getpriceRequest.FormCollection = { "Order.Description": this.order.Description };

      if (!isNullOrUndefined(this.otherInfoFormGrp) && this.otherInfoFormGrp.length > 0) {
        for (let form of this.otherInfoFormGrp) {
          Object.keys(form.formgrp.value).forEach(k => {
            if(k.indexOf('_ngbdate') > -1){
              delete form.formgrp.value[k];
            }
          })
          this.getpriceRequest.FormCollection = Object.assign(this.getpriceRequest.FormCollection, form.formgrp.value);
        }
      }

      this.getpriceRequest.FormCollection = Object.assign(this.getpriceRequest.FormCollection, !isNullOrUndefined(this.upsellFormGroup) ? this.upsellFormGroup.value : {});

      this.getpriceRequest.ApiEditOrderItemData = editOrderItemData;
      this.updateOrderState.EditOrderItemData = editOrderItemData;
      this.updateOrderState.FormCollection = this.getpriceRequest.FormCollection;
      if (isNullOrUndefined($event.skipPriceCalulcation)) {
        if ((!isNullOrUndefined(this.currentOrderItem.RunDates) && this.currentOrderItem.RunDates.length > 0) && (this.currentOrderItem.IsHideZoneSection || (!this.currentOrderItem.IsHideZoneSection && (!isNullOrUndefined(this.currentOrderItem.ZoneIds) && this.currentOrderItem.ZoneIds.length > 0))) && !callUpdateOrderState)
          this.getOrderItemPrice();
        else
          this.UpdateOrderItemStatus();
      }

      this.updateScheduleTabStatus();
      this.updateLayoutTabStatus();


      let inCompleteTabNames = [];
      if (!this.currentOrderItem.isScheduleCompleted)
        inCompleteTabNames.push(" <i class='fa fa-calendar font-21'></i> Schedule");
      if (!this.currentOrderItem.isLayoutCompleted)
        inCompleteTabNames.push(" <i class='fa fa-laptop font-21'></i> Layout");
      if (!this.currentOrderItem.isOtherInfoCompleted)
        inCompleteTabNames.push(" <i class='material-icons font-21 align-top'>note_add</i> Other-Info");
      if (inCompleteTabNames.length > 0)
        this.currentOrderItem.inCompleteTabNames = inCompleteTabNames.join(",");

      this.currentOrderItem.IsOrderItemComplete = this.isScheduleCompleted && this.isLayoutCompleted && this.isOtherInfoCompleted && this.campaingnNameValid;
      this.order.OrderItems.find(e => e.Id == this.currentOrderItem.Id).IsOrderItemComplete = this.currentOrderItem.IsOrderItemComplete;
      if (!isNullOrUndefined($event.grandChild) && $event.grandChild == "selectTemplate") {
        let url = $event.routerDetails.routerLink;
        this.router.navigateByUrl(url);
        this.router.navigate([url], {
          queryParams: $event.routerDetails.queryParams
        });
      }
    }
  }

  onNotifyOtherInfoChanges(formGroup) {
    // if ($event.fromChild == "OtherInfo") {
    this.otherInfoFormValues = new FormArray([]);
    for (let form of formGroup) {
      this.otherInfoFormValues.push(form.formgrp);
      //   }
      this.isOtherInfoCompleted = this.otherInfoFormValues.valid;
      if(this.isOtherInfoCompleted)
      {
        this.isOtherInfoCompleted = (this.order.IsDocumentUploadRequired && this.currentOrderItem.LstLegalDocs.length <= 0) ? false : true;
        this.currentOrderItem.isOtherInfoCompleted = this.isOtherInfoCompleted;
      }
      if (!this.otherInfoFormValues.valid) {
        break;
      }
    }

    this.updateOtherInfoTabStatus();
    // this.currentOrderItem.IsOrderItemComplete = this.isScheduleCompleted && this.isLayoutCompleted && this.isOtherInfoCompleted;
    // this.order.OrderItems.find(e => e.Id == this.currentOrderItem.Id).IsOrderItemComplete = this.currentOrderItem.IsOrderItemComplete;
  }

  getOrderItemPrice() {
    this.showRefreshLoader = true;
    this.configureAdService.getOrderItemPrice(this.getpriceRequest).subscribe(data => {
      this.orderItemPrice = data;
      this.order.Price = data.OrderPrice;
      this.currentOrderItem.Price = data.OrderItemPrice;
      this.currentorderItemPrice = this.currentOrderItem.Price;
      this.volumeDiscountID = data.VolumeDiscountID;
      this.showRefreshLoader = false;
    },
      (error) => {
        this.showRefreshLoader = false;
      });
  }

  UpdateOrderItemStatus() {
    this.configureAdService.updateOrderItem(this.updateOrderState).subscribe(data => {
      if (data.IsSuccess && !isNullOrUndefined(data.Result)) {
      }
    });
  }

  getLayoutsData() {
    this.layoutData = undefined;
    this.layoutService.getLayouts(this.order.AdSSId, this.currentOrderItem.Id).subscribe((data) => {
      this.layoutData = data;
    });
  }

  getAvailableDates() {
    this.availableDates = undefined;
    this.isOrderReady = false;
    this.configureAdService.getAvailableDates(this.order.AdSSId, this.currentOrderItem.Id)
      .subscribe(data => {
        this.availableDates = data;

        if (data.NumTargetOptions > 0) {
          if (this.availableDates.OnlineDisplayTarget.length == 1) {
            this.selectedZones = [];
            this.selectedZones.push(this.availableDates.OnlineDisplayTarget[0].Id);
          }
          if (this.selectedZones && this.selectedZones.length > 0) {
            this.selectedZones.forEach(target => {
              if (this.availableDates.OnlineDisplayTarget.find(elm => elm.Id == target))
                this.availableDates.OnlineDisplayTarget.find(elm => elm.Id == target).isChecked = true;
              if (this.availableDates.AvailableZoneMaps.find(elm => elm.ZoneId == target))
                this.availableDates.AvailableZoneMaps.find(elm => elm.ZoneId == target).isSelected = true;
            });
          }
        }
        else {
          if (this.availableDates.ZoneFullRun && (!this.availableDates.AvailableZones || this.availableDates.AvailableZones.length == 0)) {
            this.selectedZones = [];
            this.selectedZones.push(this.availableDates.ZoneFullRun.Id);
          }
          if (this.selectedZones && this.selectedZones.length > 0) {
            for (let zone of this.selectedZones) {
              if (this.availableDates.ZoneFullRun.Id == zone) {

                this.availableDates.ZoneFullRun.isChecked = true;
                if (this.availableDates.AvailableZones && this.availableDates.AvailableZones.length > 0) {
                  this.availableDates.AvailableZones.forEach(e => {
                    e.isChecked = true;
                  });
                }
                if (this.availableDates.AvailableZoneMaps && this.availableDates.AvailableZoneMaps.length > 0) {
                  if (this.availableDates.AvailableZoneMaps.find(elm => elm.ZoneId == zone))
                    this.availableDates.AvailableZoneMaps.find(elm => elm.ZoneId == zone).isSelected = true;
                }
                break;
              }
              else {
                if (this.availableDates.AvailableZones && this.availableDates.AvailableZones.length > 0) {
                  if (this.availableDates.AvailableZones.find(elm => elm.Id == zone))
                    this.availableDates.AvailableZones.find(elm => elm.Id == zone).isChecked = true;
                }
                if (this.availableDates.AvailableZoneMaps && this.availableDates.AvailableZoneMaps.length > 0) {
                  if (this.availableDates.AvailableZoneMaps.find(elm => elm.ZoneId == zone))
                    this.availableDates.AvailableZoneMaps.find(elm => elm.ZoneId == zone).isSelected = true;
                }
              }

            }
          }
        }

        if (this.selectedZones && this.selectedZones.length > 0)
          this.selectedZonesCsv = this.selectedZones.join(",");
        this.currentOrderItem.ZoneIds = this.selectedZones;
        this.isOrderReady = true;
      },
        (error) => {
          this.isOrderReady = true;
        });
  }

  getVolumeDiscounts() {
    this.configureAdService.getVolumeDiscounts(this.order.AdSSId, this.currentOrderItem.Id)
      .subscribe(data => {
        this.volumeDiscounts = data;

      });
  }

  getImpressions() {
    this.configureAdService.getImpressions(this.order.AdSSId, this.currentOrderItem.Id)
      .subscribe((data) => {
        if (!isNullOrUndefined(data))
          this.impressions = data;
      })
  }

  saveDraft(redirect) {
    console.log('save draft 2');
    (<any>window)._trackEvent('Configure Ad SaveDraft', 'Save Draft Click', 'Save Draft', 'Save Draft Click');
    this.configureAdService.savedraft(this.getpriceRequest)
      .subscribe(data => {
        this.errorMessagesFromResponse = data.ErrorMessage;
      })
    if (!this.cookieService.check('c_mId')) {
      let body = "You must be signed in to save your work. Would you like to sign in now?";
      let header = "Saving Draft";
      let confirmPopup = this.discardModalService.deleteOrCancel(body, header);
      confirmPopup.result.then(result => {
        if (result !== undefined && result.data && result.data == "continue") {
          this.router.navigate(['/login'], {
            queryParams: {
              return: this.router.url
            }
          });
        }
      });
    }

  }

  reviewAndSubmit(redirect) {
    (<any>window)._trackEvent('Configure Ad ReviewAndSubmit', 'Review and Submit Click', 'Review and Submit', 'Review and Submit Click');
    this.count = 0;
    this.sizeComponent.updateDropdownValidity();
    

    if (this.order.isOtherInfoVisible)
    {
      this.onNotifyOtherInfoChanges(this.otherInfoFormGrp);
      this.otherInfoComponent.updateFormValidity();
      var isDocUploaded = this.otherInfoComponent.isDocumentUploaded();
      this.isOtherInfoCompleted = this.isOtherInfoCompleted && isDocUploaded;
      this.currentOrderItem.isOtherInfoCompleted = this.isOtherInfoCompleted;
      if(!this.isOtherInfoCompleted)
      {
        this.assignDangerClass();
      }
    }

    if (this.currentOrderItem.IsDfpOrderItem) {
      this.campaignNameForm.controls['campaignName'].markAsTouched();
      this.campaingnNameValid = this.campaignNameForm.valid;
      if (this.isOtherInfoCompleted && this.isScheduleCompleted && this.isLayoutCompleted && this.campaingnNameValid)
        this.postReviewAndSubmitApi(this.getpriceRequest);
      else
        this.assignDangerClass();
    }
    else if (this.order.HasMultipleConfigurableItems && this.order.OrderItems.length > 1) {
      this.order.OrderItems.forEach(e => {
        if (e.isScheduleCompleted && e.isLayoutCompleted && e.isOtherInfoCompleted) {
          this.count++;
        }
        else {
          if (e.TypeId == this.orderItemTypes['OnlineDisplayOrderItem']) {
            if (!isNullOrUndefined(this.sizeComponent) && !isNullOrUndefined(this.sizeComponent.clickThroughURLForm))
              this.sizeComponent.updateValidity();
          }
        }
      });
      if (this.order.OrderItems.length == this.count) {
        this.postReviewAndSubmitApi(this.getpriceRequest);
      }
      else {
        this.assignDangerClass();
      }
    }
    else if (this.isOtherInfoCompleted && this.isScheduleCompleted && this.isLayoutCompleted)
      this.postReviewAndSubmitApi(this.getpriceRequest);
    else {
      if (this.currentOrderItem.TypeId == this.orderItemTypes['OnlineDisplayOrderItem']) {
        this.sizeComponent.updateValidity();
      }
      this.assignDangerClass();
    }

  }

  postReviewAndSubmitApi(getpriceRequest: IGetPriceRequest) {

    this.getpriceRequest.ApiEditOrderItemData.IsValidate = true;

    this.configureAdService.reviewAndSubmit(getpriceRequest)
      .subscribe(data => {
        if (data.IsSuccess)
          this.router.navigateByUrl("/drafts/" + this.adssId + "/purchase");
        else {
          this.errorMessagesFromResponse = data.ErrorMessage;
        }
      })
  }

  removeOrderItemData(currentOrderItemId) {
    let body = "Are you sure to delete this order item?";
    let header = "Confirmation";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.configureAdService.deleteDfpOrderItem(currentOrderItemId).subscribe((data:any) => {
          if (data.IsSuccess) {
            this.currentOrderItemId = this.order.OrderItems.find(item => item.Id != currentOrderItemId).Id;
            this.getOrderConfigurationData();
            this.router.navigate(['/drafts/' + this.order.AdSSId + '/' + this.currentOrderItemId + '/configure']);
          }
        },
          (error) => {

          });
      }
    });
  }

  removeProduct(currentOrderItemId) {
    if (this.configureDFPData.DfpOrderItems.length > 1) {
      this.removeOrderItemData(currentOrderItemId);
    } else {
      let body = "There must be atleast one order item for the order.";
      let header = "Alert!";
      this.discardModalService.showMessage(body, header);
    }
  }

  saveCampaignName(event) {
    this.order.DfpCampaignName = this.campaignNameForm.controls['campaignName'].value;
    if (!isNullOrUndefined(this.order.DfpCampaignName) && this.order.DfpCampaignName.length > 0) {
      this.campaingnNameValid = true;
      this.campaignNameMessage = "set.";
    } else {
      this.campaingnNameValid = false;
      this.campaignNameMessage = "required."
    }
    this.onNotify(event);
  }

  saveProjectName(event) {
    this.order.Description = this.projectNameForm.controls['projectName'].value;
    this.onNotify(event);
  }

  public moveToSpecificView(selectedIndex) {
    setTimeout(() => {
      if (!isNullOrUndefined(this.configure))
        this.configure.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    });
  }

  public moveToTopView() {
    setTimeout(() => {
      if (!isNullOrUndefined(this.top)) {
        this.top.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 100);
    this.switchTab(0);
  }

  moveToCampaignName() {
    setTimeout(() => {
      if (!isNullOrUndefined(this.campaign))
        this.campaign.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    });
  }

  assignDangerClass() {
    this.warningMessageCss = 'alert alert-danger';
    this.warningIcon = 'fa fa-times-circle';
  }

  navigateProduct($event) {
    if($event) {
      this.getpriceRequest.ApiEditOrderItemData.IsValidate = false;
      this.configureAdService.reviewAndSubmit(this.getpriceRequest)
        .subscribe(data => {
          let url = "/drafts/" + this.order.AdSSId + "/" + $event.nextOrderItemId + "/configure";
          this.moveToTopView();
          if (!isNullOrUndefined($event.selectedTab))
            url += "?selectedTab=" + $event.selectedTab;
          if (data.IsSuccess)
            this.router.navigateByUrl(url);
        });
    }
  }

  startOver($event?) {
    let body = "By starting over, you may lose any uploaded images or content. Do you wish to proceed?";
    let header = "Starting Over";
    let startOverPopup = this.discardModalService.deleteOrCancel(body, header);
    startOverPopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.layoutService.deleteUploadedMaterial(this.order.AdSSId, this.currentOrderItem.Id)
          .subscribe(data => {
            if (data.IsSuccess) {
              this.currentOrderItem.HasAdMaterialDefined = false;
              this.currentOrderItem.HasUploadedAd = false;
              this.currentOrderItem.HasDesignedAd = false;
              this.currentOrderItem.IsOrderItemComplete = false;
              this.selectedAdSize = !isNullOrUndefined($event.selectedTile) ? $event.selectedTile : this.layoutData.ApiapplicableAdSize.find(e => e.AdSize.Id == this.currentOrderItem.AdSizeId);
              this.currentOrderItem.AdSize = this.selectedAdSize.AdSize;
              this.currentOrderItem.AdSizeId = this.selectedAdSize.AdSize.Id;
              this.getpriceRequest.ApiEditOrderItemData.AdSizeId = this.currentOrderItem.AdSizeId;
              this.updateOrderState.EditOrderItemData.AdSizeId = this.currentOrderItem.AdSizeId;
              this.layoutData.ApiapplicableAdSize.forEach(size => {
                if (size.AdSize.Id != this.currentOrderItem.AdSizeId)
                  size.Ischecked = false;
                else
                  size.Ischecked = true;
              });
              this.updateLayoutTabStatus();
              if (isNullOrUndefined($event.selectedTile)) {
                if ((!isNullOrUndefined(this.currentOrderItem.RunDates) && this.currentOrderItem.RunDates.length > 0) && (this.currentOrderItem.IsHideZoneSection || (!this.currentOrderItem.IsHideZoneSection && (!isNullOrUndefined(this.currentOrderItem.ZoneIds) && this.currentOrderItem.ZoneIds.length > 0))))
                  this.getOrderItemPrice();
                else
                  this.UpdateOrderItemStatus();
              }

            }
          })
      }
    });
  }

  isWibbitz() {
    return this.order.OrderItems.some(orderItem => orderItem.IsWibbitzProduct);
  }
}




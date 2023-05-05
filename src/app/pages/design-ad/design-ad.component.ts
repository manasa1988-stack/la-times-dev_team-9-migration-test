import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DateFormatPipe } from "../../filters/dateformat.pipe";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BaseClass } from '../../shared/base.class';
import * as lengthValiation from '../../shared/adss.metadata';
import { CharactersOnlyValidator } from '../../shared/custom-validators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmblemComponent } from './emblem/emblem.component';
import { ILayoutCarouselItem } from "../../models/layout.model";
import { IOrder, IOrderItem, IAdTemplate, IFieldGroup, IField, IAttribute } from '../../models/order-item.model'
import { LayoutService } from "../configure-ad/size/layout.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DiscardModalService } from "../../shared/discard-modal.service";
import { DesignAService } from './design-ad.service';
import { IGetDesignAdRequest, IDesignAdMaterial, IGetDesignAdPreviewRequest, IDesignAdPreview, ISaveDesignAdRequest, IEmblem } from '../../models/designAd.model';
import { isNullOrUndefined } from 'util';
import * as adssMetadata from '../../shared/adss.metadata';
import { EmailValidator } from "../../shared/custom-validators";
import { StorageService } from '../../shared/storage.service';
import { ImageEditorComponent } from '../configure-ad/size/image-editor/image-editor.component';
import { PhotoLibraryService } from '../photo-library/photo-library.service';
import { IPhoto } from '../../models/photo.model';
import { birthAndDeathyearsPopulator, daysPopulator } from '../../shared/common.functions';
import { PreviewImageComponent } from '../configure-ad/size/preview-image/preview-image.component';
import { IGetDesignAdExternalRequest, IDocumentAdMaterial } from '../../models/designDocument.model';
import { UploadDocService } from '../upload-doc/upload-doc.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { NguCarousel, NguCarouselStore, NguCarouselConfig } from '@ngu/carousel'
import { CookieService } from '../../shared/cookies.service';
import { FormattingGuidelinesComponent } from './formatting-guidelines/formatting-guidelines.component';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'app-design-ad',
  templateUrl: './design-ad.component.html',
  styleUrls: ['./design-ad.component.css'],
  providers: [DiscardModalService]
})

export class DesignAdComponent extends BaseClass {

  aditId: number;

  designAdForm: FormGroup;
  layoutItem: ILayoutCarouselItem;
  isComponentReady: boolean = false;
  adssId: number;
  templateCode: string;
  PubDatesCsv: string;
  pid: string;
  currentOrderItemId: number;
  adSizeId: number;
  adMaterialId: number;
  externalMaterialId: number;
  isColor: boolean;
  packageCode: string;
  sectionId: number;
  selectedPubDates: Date[] =[];
  positionID: number;
  templates: IAdTemplate[] = [];
  attributes: IField[];
  designAdRequest: IGetDesignAdRequest;
  designAdExternalRequest: IGetDesignAdExternalRequest;
  designAdPreviewRequest: IGetDesignAdPreviewRequest
  designAdMaterial: IDesignAdMaterial;
  documentAdMaterial: IDocumentAdMaterial;
  fieldTypes = adssMetadata.DesignAdFieldType;
  adTemplate: IAdTemplate;
  config: any;
  emblemImage: string = 'wwwroot/assets/img/emblem.jpg';
  isFormReady: boolean = false;
  designAdPreview: IDesignAdPreview;
  saveDesignAdRequest: ISaveDesignAdRequest;
  customerNumber: string;
//   public designAdCarousel: NguCarouselConfig;
  logoImageUrl = 'wwwroot/assets/img/logo.jpg';
  photoImageUrl = 'wwwroot/assets/img/photo.jpg';
  showError: boolean = false;
  emblemImages: any[] = [];
  emblem: IEmblem;
  buCode: string;
  logoLibrary: IPhoto[];
  logosCount: number;
  dataFieldGroups: IFieldGroup[] = [];
  dataFieldGroupsOriginal: IFieldGroup[] = [];
  monthOptionsList: { Key: any, Value: any }[] = [];
  yearOptionsList: { Key: any, Value: any }[] = [];
  dayOptionsList: { Key: any, Value: any }[] = [];
  date = new Date().getTime();
  isPreviewOpen: boolean = false;
  isEditing: boolean = false;
  isImageRequired: boolean = false;
  grpName: string = "group";
  showUploadLogo: boolean = false;
  isFromAdit: boolean = false;
  isEditFromAdit: boolean = false;
  csr: string;
  orderAttributes: IAttribute[];
  systemName: string = "adss";

  showLines: boolean = true;
  hideLinesForSectionIds: number[];
  fetchingPreview: boolean = false;
  private carouselLoaded: boolean = false;
  private popOverLoaded: boolean = false;
  isWhite: boolean = true;
  showLinesexceededMsg: boolean = false;
  errorMesgsFromAPI = [];
  errorMesgsFromPreviewAPI = [];
  designAdErrors = [];

  noTemplateChange: string;
  previewMsg: string = "";

  marketNotAvailable: boolean = true;
  loadCarousel: boolean = true;

  
  focusOut = {};

  @ViewChild('previewImg',{static:true}) public previewImg: ElementRef;
  @ViewChild('popOver',{static:true}) public popOver: NgbPopover;
//   @ViewChild('templateCarousel') templateCarousel: NguCarousel;

  // public editorConfig = {
  //   placeholder: "html",
  //   modules: {
  //     toolbar: [
  //       ['bold', 'italic', 'underline']
  //     ]
  //   }
  // };

  public editorConfig = {
    placeholder: "html",
    modules: {
      toolbar: []
    }
  };

  constructor(private formBuilder: FormBuilder,
    private route: Router,
    private currentRoute: ActivatedRoute,
    private modalService: NgbModal,
    private layoutService: LayoutService,
    private discardModalService: DiscardModalService,
    private designAService: DesignAService,
    private photoLibraryService: PhotoLibraryService,
    private storageService: StorageService,
    private uploadDocService: UploadDocService,
    private breakpointObserver: BreakpointObserver,
    private dateFormatPipe: DateFormatPipe,
    private cookieService: CookieService,_configSvc: RuntimeConfigLoaderService
  ) {
    super(_configSvc);
    // this.config = {
    //   editable: true,
    //   spellcheck: true,
    //   height: "auto",
    //   minHeight: "0",
    //   width: "auto",
    //   minWidth: "0",
    //   translate: "yes",
    //   enableToolbar: true,
    //   showToolbar: true,
    //   placeholder: "Enter text here...",
    //   imageEndPoint: "",
    //   toolbar: [
    //     [
    //       "bold",
    //       "italic",
    //       "underline"
    //     ]
    //   ]
    // };

    adssMetadata.months.map(item => {
      return {
        Key: item.monthNumber,
        Value: item.monthName
      }
    }).forEach(item => {
      this.monthOptionsList.push(item);
    });

    (<any>window)._trackPage('ADSS - Design-ad', this.currentRoute.snapshot.url);

    if (isNullOrUndefined(this.storageService.getHOST()))
      this.marketNotAvailable = true;
    else
      this.marketNotAvailable = false;

  }

  ngAfterViewChecked() {
    this.onCarouselLoaded();
    //this.onPopoverLoad();
  }

  onCarouselLoaded() {
    // if (this.templateCarousel && !this.carouselLoaded) {
    //   this.carouselLoaded = true;
    //   let itemsShown = this.templateCarousel.data.items;
    //   let currentIndex = this.getCarouselSlideIndex(itemsShown >= 0 ? itemsShown : 1);
    //   this.templateCarousel.moveTo(currentIndex);
    // }
  }

  getCarouselSlideIndex(itemsPerSlide: number) {
    let templateIndex = 0;
    if (this.templateCode != '') {
      let codes = this.templates.map(e => e.Code);
      let itemIndex = codes.indexOf(this.templateCode);
      if (itemIndex >= 0) {
        templateIndex = itemIndex + 1;
      }
    }

    let totalSlides = this.templates.length - itemsPerSlide;
    if (templateIndex < itemsPerSlide) {
      return 0;
    }
    else {
      var minPage = templateIndex - itemsPerSlide;
      var maxPage = minPage + Math.floor(itemsPerSlide / 2);
      return maxPage <= totalSlides ? maxPage : minPage;
    }
  }

  validationInit() {
    if (this.route.url.includes('/adit/')) {
      this.isFromAdit = true;
      this.systemName = "adit";
    }
    this.currentRoute.params.subscribe((params: Params) => {
      this.adssId = params['draftId'] ? params['draftId'] : 0;
      this.currentOrderItemId = params['currentOrderItemId'] ? params['currentOrderItemId'] : 0;
      this.adSizeId = params['adSizeId'] ? params['adSizeId'] : 0;
    });    

    this.currentRoute.queryParams.subscribe((params: Params) => {
      this.adSizeId = params['adSizeId'] ? params['adSizeId'] : 0;
      this.templateCode = params['templateCode'] ? params['templateCode'] : '';
      this.adMaterialId = params['adMaterialId'] ? params['adMaterialId'] : 0;
      this.externalMaterialId = params['externalMaterialId'] ? params['externalMaterialId'] : 0;
      this.isColor = params['isColor'] ? params['isColor'] : false;
      this.packageCode = params['packageCode'] ? params['packageCode'] : '';
      this.sectionId = params['sectionId'] ? params['sectionId'] : 0;
      //this.positionID = params['positionId'] ? params['positionId'] : 0;
      this.positionID = params['positionId'] ? params['positionId'] : null;
      this.PubDatesCsv = params['selectedPubDate'] ? params['selectedPubDate'] : null;
      this.selectedPubDates = params['selectedRunDate'] ? params['selectedRunDate'] : null;     
      this.buCode = params['buCode'] ? params['buCode'] : '';
      this.isEditing = params['isEditing'] ? params['isEditing'] : false;
      this.aditId = params['aditId'] ? params['aditId'] : null;
      this.customerNumber = params['CustomerNumber'] ? params['CustomerNumber'] : '';
      this.csr = params['csr'] ? params['csr'] : '';
      this.noTemplateChange = params['noTemplateChange'] ? params['noTemplateChange'] : 'false';
      this.pid = params['pid'] ? params['pid'] : '';
      if (params['isFromAdit'] && params['isFromAdit'] == 'true') {
        this.isEditFromAdit = params['isFromAdit'];
      }
    });
    this.hideLinesForSectionIds = isNullOrUndefined(this.storageService.getHOST()) ? null : this.storageService.getHOST().HideLinesForSectionIds;
    let pubdt: string[] = [];
  
      if (!isNullOrUndefined(this.selectedPubDates) && this.selectedPubDates.length > 0) {
        this.selectedPubDates.forEach(dt => {
          pubdt.push(this.dateFormatPipe.transform(dt, "MM/dd/yy"));          
        });
        
  
        this.PubDatesCsv = pubdt.join(", ");
      }
      else if(!isNullOrUndefined(this.PubDatesCsv) && this.PubDatesCsv.length > 0)
      {
        let pubdate: string[] = [];
        this.PubDatesCsv.split(",").forEach(dat => {
          pubdate.push(this.dateFormatPipe.transform(dat, "MM/dd/yy"));
        });
        this.PubDatesCsv = pubdate.join(", ");         
        
      }      
      else
      {
        this.PubDatesCsv = "";
      }
    if (isNullOrUndefined(this.customerNumber) || this.customerNumber == '')
      this.customerNumber = isNullOrUndefined(this.storageService.getUserInfo()) ? null : this.storageService.getUserInfo().customerNumber;
       
        
    this.getLogoLibrary();
    // this.getEmblemImages();
    if (this.isEditingDesignOnlyAd()) {
      this.templates = [];
      this.getDesignAdMaterial();
    }
    else {
      this.getTemplates();
    }
    //this.showLines = this.hideLinesForSectionIds != null ? !this.hideLinesForSectionIds.includes(this.sectionId) : true;
    // this.designAdCarousel = {
    //   grid: { xs: 1, sm: 3, md: 4, lg: 6, all: 0 },
    //   speed: 200,
    //   slide: 1,
    //   animation: 'lazy',
    //   point: {
    //     visible: false,
    //   },
    //   load: 2,
    //   touch: true,
    //   easing: 'ease'
    // };

  }

  isEditingDesignOnlyAd() {
    return this.noTemplateChange.includes("true") && !isNullOrUndefined(this.aditId) && this.aditId > 0;
  }

  getTemplates() {
    this.layoutService.getTemplates(this.adSizeId, this.sectionId, this.positionID, this.customerNumber).subscribe((data) => {
      this.templates = data;
      this.templateCode = this.isFromAdit ? this.templateCode ? this.templateCode : null : this.templateCode ? this.templateCode : this.templates[0].Code;
      this.showLines =  this.templates ? this.templates[0].showLines : false ;
      this.getDesignAdMaterial();
      this.isComponentReady = true;
    },
      (error) => {
        this.isComponentReady = true;
        this.showError = true;
      });
  }

  getDesignAdMaterial() {
    this.showError = false;
    this.dataFieldGroupsOriginal = [];
    this.dataFieldGroups = [];
    this.errorMesgsFromAPI = [];
    this.errorMesgsFromPreviewAPI = [];
    this.designAdErrors = [];
    this.isFormReady = false;

    if (this.isFromAdit) {
      this.designAdExternalRequest = <IGetDesignAdExternalRequest>{};
      this.designAdExternalRequest.SystemName = "adit";
      this.designAdExternalRequest.SectionID = this.sectionId;
      this.designAdExternalRequest.PositionID = this.positionID;
      this.designAdExternalRequest.IsEditing = this.isEditing;
      this.designAdExternalRequest.CSR = this.csr;
      this.designAdExternalRequest.CustomerNumber = this.customerNumber;
      this.designAdExternalRequest.IsUpload = false;
      this.designAdExternalRequest.CopiedOrderID = 0;
      this.designAdExternalRequest.OrderID = this.adssId;
      this.designAdExternalRequest.OrderItemID = 0;
      this.designAdExternalRequest.AdMaterialID = this.adMaterialId;
      this.designAdExternalRequest.ExternalMaterialID = this.externalMaterialId;
      this.designAdExternalRequest.AdSizeID = this.adSizeId;
      this.designAdExternalRequest.ID = this.templateCode;
      this.designAdExternalRequest.PID = this.pid;
      this.designAdExternalRequest.IsColor = this.isColor;
      this.designAdExternalRequest.FormCollection = this.designAdForm ? Object.assign({}, this.designAdForm.value) : {};
      this.designAdExternalRequest.FormCollection['PubDay']=this.PubDatesCsv;            
      if (this.attributes && this.attributes.length > 0) {
        this.attributes.forEach(el => {
          if (el.IsImage) {
            if (isNullOrUndefined(el.Value)) {
              this.designAdExternalRequest.FormCollection[el.InDesignTagName] = "true";
            }
            else
              this.designAdExternalRequest.FormCollection[el.InDesignTagName] = el.Value;
          }
        });
      }
      this.designAdExternalRequest.PackageCode = this.packageCode;
      this.designAdExternalRequest.HasEdited = false;
      this.designAdExternalRequest.ChangedAdSizeOnDesignAd = "";
      this.uploadDocService.getDesignAdMaterial(this.designAdExternalRequest).subscribe((data) => {
        this.documentAdMaterial = data.Result;
        this.adTemplate = this.documentAdMaterial.AdTemplate;
        this.templateCode = this.adTemplate.Code;
        if (this.loadCarousel) {
          this.loadCarousel = false;
          this.carouselLoaded = false;
          this.onCarouselLoaded();
        }

        this.adMaterialId = !isNullOrUndefined(this.documentAdMaterial.Material) ? this.documentAdMaterial.Material.Id : 0;
        if (isNullOrUndefined(this.buCode) || this.buCode == '' || this.buCode.length == 0) {
          this.buCode = !isNullOrUndefined(this.documentAdMaterial.Section) && !isNullOrUndefined(this.documentAdMaterial.Section.Product.BusinessUnit) ? this.documentAdMaterial.Section.Product.BusinessUnit.Code : '';
        }
        if (this.isEditingDesignOnlyAd()) {
          let codes = this.templates.map(e => e.Code);
          let itemIndex = codes.indexOf(this.adTemplate.Code);
          if (itemIndex < 0) {
              this.templates.push(this.adTemplate);
            }
        }
        this.editorConfig.modules.toolbar = [this.documentAdMaterial.HtmlStyles];
        this.orderAttributes = this.documentAdMaterial.OrderAttributes;
        this.createFormData();
        this.isComponentReady = true;
        this.onPopoverLoad();
      },
        (error) => {
          this.showError = true;
        });
    }

    else {
      this.designAdRequest = <IGetDesignAdRequest>{};
      this.designAdRequest.OrderID = this.adssId;
      this.designAdRequest.OrderItemID = this.currentOrderItemId;
      this.designAdRequest.AdMaterialID = this.adMaterialId;
      this.designAdRequest.ExternalMaterialID = this.externalMaterialId;
      this.designAdRequest.AdSizeID = this.adSizeId;
      this.designAdRequest.ID = this.templateCode;;
      this.designAdRequest.PID = this.pid;
      this.designAdRequest.IsColor = this.isColor;
      this.designAdRequest.FormCollection = this.designAdForm ? Object.assign({}, this.designAdForm.value) : {};
      if (this.attributes && this.attributes.length > 0) {
        this.attributes.forEach(el => {
          if (el.IsImage) {
            if (isNullOrUndefined(el.Value)) {
              this.designAdRequest.FormCollection[el.InDesignTagName] = "true";
            }
            else
              this.designAdRequest.FormCollection[el.InDesignTagName] = el.Value;
          }
        });
      }
      this.designAdRequest.PackageCode = this.packageCode;
      this.designAdRequest.HasEdited = this.isEditing;
      this.designAService.getDesignAdMaterial(this.designAdRequest).subscribe((data) => {
        this.designAdMaterial = data.Result;
        this.adTemplate = this.designAdMaterial.AdTemplate;
        if (this.isEditingDesignOnlyAd()) {
          let codes = this.templates.map(e => e.Code);
          let itemIndex = codes.indexOf(this.adTemplate.Code);
          if (itemIndex < 0) {
              this.templates.push(this.adTemplate);
            }
        }
        this.orderAttributes = this.designAdMaterial.OrderAttributes;
        this.editorConfig.modules.toolbar = [this.designAdMaterial.HtmlStyles];
        this.createFormData();
        this.isComponentReady = true;
        this.onPopoverLoad();
      },
        (error) => {
          this.showError = true;
        });
    }
  }

  createFormData() {
    this.dataFieldGroupsOriginal = [];
    if (!isNullOrUndefined(this.adTemplate.DataFieldGroups) && this.adTemplate.DataFieldGroups.length > 0) {
      for (let attributeGrp of this.adTemplate.DataFieldGroups) {
        this.dataFieldGroupsOriginal.push(attributeGrp);
      }
      let relatedFields, allChangingFields;
      for (let Group of this.dataFieldGroupsOriginal) {
        for (let attribute of Group.Fields) {

          if (attribute.ElementType == this.fieldTypes["TemplateSection"]) {
            for (let child of attribute.Fields) {
              if (child.ElementType == this.fieldTypes["DropDownList"]) {
                relatedFields = this.dropDownListAttributeData(child);
                allChangingFields = this.combineAllFields(child);
              }
              if (child.ElementType == this.fieldTypes["Emblem"]) {
                this.getEmblemImages();
              }
              if (child.ElementType == this.fieldTypes["WebId"]) {
                this.WebIdAttributeData(child);
              }
            }
          }
          else {
            if (attribute.ElementType == this.fieldTypes["DropDownList"]) {
              relatedFields = this.dropDownListAttributeData(attribute);
              allChangingFields = this.combineAllFields(attribute);
            }
            else {
              if (attribute.ElementType == this.fieldTypes["Emblem"]) {
                this.getEmblemImages();
              }
              if (attribute.ElementType == this.fieldTypes["WebId"]) {
                this.WebIdAttributeData(attribute);
              }
            }
          }
        }
      }
      this.formBuilderFunction(relatedFields, allChangingFields);
    }
    else {
      this.showError = true;
    }

  }

  combineAllFields(attribute) {
    let allChangingFields = [];
    for (let itemOption of attribute.Options) {
      if (!isNullOrUndefined(itemOption.RelatedFields)) {
        let allowedFields = itemOption.RelatedFields.split(",");
        for (let item of allowedFields) {
          if (allChangingFields.indexOf(item) == -1) {
            allChangingFields.push(item);
          }
        }
      }
    }
    return allChangingFields;
  }

  WebIdAttributeData(attribute) {
    if (this.isFromAdit) {
      if (this.documentAdMaterial.UseWebId) {
        attribute.Value = this.documentAdMaterial.WebId;
      }
      attribute.IsRequired = this.documentAdMaterial.UseWebId;
    }
    else {
      if (this.designAdMaterial.UseWebId) {
        attribute.Value = this.designAdMaterial.WebId;
      }
      attribute.IsRequired = this.designAdMaterial.UseWebId;
    }
  }


  dropDownListAttributeData(attribute) {
    let relatedFields;

    if (isNullOrUndefined(attribute.Options) || attribute.Options.length == 0 || !attribute.MetaDataOnly) {
      attribute = this.populateDropDownList(attribute);
    }

    if (isNullOrUndefined(attribute.Value) && !isNullOrUndefined(attribute.Options[0]) && !isNullOrUndefined(attribute.Options[0].RelatedFields)) {
      attribute.Value = attribute.Options[0].Value;
    }

    let selectedOption = attribute.Options.find(e => e.Value == attribute.Value);
    if (!isNullOrUndefined(selectedOption) && !isNullOrUndefined(selectedOption.RelatedFields)) {
      relatedFields = selectedOption.RelatedFields.split(",");

    }
    return relatedFields;
  }

  showField(attribute, relatedFields, allChangingFields) {
    let showField = true;
    if (!isNullOrUndefined(relatedFields) && !isNullOrUndefined(allChangingFields) && allChangingFields.length > 0) {
      showField = relatedFields.indexOf(attribute.InDesignTagName) > -1 || allChangingFields.indexOf(attribute.InDesignTagName) == -1;
    }
    return showField;
  }

  formBuilderFunction(relatedFields?: string[], allChangingFields?: string[]) {
    this.attributes = [];
    this.isFormReady = false;
    let formGroup = {};
    this.designAdForm = new FormGroup(formGroup);
    this.dataFieldGroups = [];
    this.isImageRequired = false;
    let index = 0;
    if (!isNullOrUndefined(this.dataFieldGroupsOriginal) && this.dataFieldGroupsOriginal.length > 0) {
      for (let attributeGrp of this.dataFieldGroupsOriginal) {
        let attrGrp = <IFieldGroup>{};
        attrGrp.Name = attributeGrp.Name;
        attrGrp.Fields = [];
        for (let attribute of attributeGrp.Fields) {
          index += 1;
          let showAttribute = this.showField(attribute, relatedFields, allChangingFields);

          switch (attribute.ElementType) {
            case "Emblem":
              this.createAttributeElement(attrGrp, attribute, index);
              if (showAttribute) {
                attrGrp.Fields.push(attribute);
              }
              break;
            case "TemplateSection":
              if (!isNullOrUndefined(attribute.Fields)) {
                for (let child of attribute.Fields) {
                  this.createAttributeElement(attrGrp, child, index);
                  showAttribute = this.showField(child, relatedFields, allChangingFields);
                  if (showAttribute) {
                    attrGrp.Fields.push(child);
                  }
                  this.createFormControl(formGroup, child);
                }
              }
              break;
            default:
              this.createAttributeElement(attrGrp, attribute, index);
              if (showAttribute) {
                attrGrp.Fields.push(attribute);
                this.createFormControl(formGroup, attribute);
              }
              else {
                //attrGrp.Fields.push(attribute);
                if (!attribute.IsImage) {
                  formGroup[attribute.InDesignTagName] = new FormControl('');
                }
              }
              break;
          }

        }
        this.dataFieldGroups.push(attrGrp);
      }
      this.designAdForm = new FormGroup(formGroup);
      this.isFormReady = true;
      this.getPreview();
    }

  }

  createAttributeElement(attrGrp, attribute, index) {
    attribute.Grp = this.grpName + '_' + index;
    this.attributes.push(attribute);

  }

  createFormControl(formGroup, attribute) {
    if (!attribute.IsImage) {
      formGroup[attribute.InDesignTagName] = new FormControl(isNullOrUndefined(attribute.Value) ? "" : attribute.Value, this.mapValidators(attribute));
    }

  }

  populateYearDropdownList(attribute) {
    this.yearOptionsList = [];
    let totalYrs = 100;
    if (attribute.InDesignTagName == "DeathYear") {
      if (attribute.MaxValue && attribute.MinValue) {
        totalYrs = attribute.MaxValue - attribute.MinValue
      }
      else {
        totalYrs = 100;
      }
    }
    else
      if (attribute.InDesignTagName == "BirthYear") {
        if (attribute.MaxValue && attribute.MinValue) {
          totalYrs = attribute.MaxValue - attribute.MinValue
        }
        else {
          totalYrs = 150;
        }
      }
    let yrs = birthAndDeathyearsPopulator(totalYrs);
    yrs.map(item => {
      return {
        Key: item,
        Value: item
      }
    }).forEach(item => {
      this.yearOptionsList.push(item);
    });
    attribute.Options = this.yearOptionsList;

  }

  populateMonthDropdownList(attribute) {
    attribute.Options = this.monthOptionsList;
  }



  populateDayDropdownList(month, year) {
    this.dayOptionsList = [];
    let days = daysPopulator(month, year);
    days.map(item => {
      return {
        Key: item,
        Value: item
      }
    }).forEach(item => {
      this.dayOptionsList.push(item);
    });
    // attribute.Options = this.dayOptionsList;
  }

  populateYearMonthDayDropdownLists(attribute) {
    if (attribute.Class == 'month') {
      this.populateMonthDropdownList(attribute);
      if (!isNullOrUndefined(attribute.Value) && attribute.Value.length > 0) {
        let month = adssMetadata.months.find(m => m.monthName == attribute.Value).monthNumber;
        this.populateDayDropdownList(month, new Date().getFullYear());
      }
    }

    if (attribute.Class == 'year') {
      this.populateYearDropdownList(attribute);
      if (!isNullOrUndefined(attribute.Value) && attribute.Value.length > 0) {
        if (attribute.Value % 4 == 0 && this.dayOptionsList.length == 28) {
          this.populateDayDropdownList(2, attribute.Value);
        }
      }
    }
    if (attribute.Class == 'day')
      attribute.Options = this.dayOptionsList;
  }

  populateDropDownList(attribute): any {
    if (!isNullOrUndefined(this.orderAttributes) && this.orderAttributes.length > 0) {
      let orderAttribute = this.orderAttributes.find(e => e.Name == attribute.InDesignTagName);
      if (!isNullOrUndefined(orderAttribute)) {
        attribute.Options = orderAttribute.Options;
        let selectedOption = orderAttribute.Options.find(a => a.Value == attribute.Value);
        if (!isNullOrUndefined(selectedOption) && selectedOption.HasChildAttributes) {
          selectedOption.Attributes.forEach(option => {
            this.dataFieldGroupsOriginal
              .forEach(grp => {
                let field = grp.Fields.find(f => f.InDesignTagName == option['Name']);
                if (!isNullOrUndefined(field)) {
                  field.Options = option['Options'];
                }
                else{
                  grp.Fields.forEach(innerField =>
                    {
                      if(innerField.ElementType == this.fieldTypes['TemplateSection']){
                        let nestedfield = innerField.Fields.find(f => f.InDesignTagName == option['Name']);
                        if (!isNullOrUndefined(nestedfield)) {
                          nestedfield.Options = option['Options'];
                        }
                    }
                  });
                }
              });
          });
        }
      }
      else {
        this.populateYearMonthDayDropdownLists(attribute);
      }
    }
    else {
      this.populateYearMonthDayDropdownLists(attribute);
    }
    return attribute;
  }

  selectEmblem(DataFieldIdsName) {
    let modalRef = this.modalService.open(EmblemComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.emblemImages = this.emblemImages;
    modalRef.componentInstance.type = 'emblem';
    this.emblem = <IEmblem>{};
    this.emblem.SystemName = this.systemName;
    this.emblem.SystemKey = this.adssId;
    this.emblem.AdMaterialId = this.adMaterialId;
    this.emblem.ExternalAdMaterialId = this.externalMaterialId;
    this.emblem.AdTemplateDataFieldIdsName = DataFieldIdsName;
    this.emblem.BUCode = this.buCode;
    this.emblem.PackageCode = this.packageCode;
    this.emblem.CustomerNumber = this.customerNumber;
    modalRef.componentInstance.emblem = this.emblem;
    modalRef.result.then(response => {
      if (response != undefined && response.data != undefined && response.data == 'success') {
        this.date = new Date().getTime();
        if(response.selectedEmblemImg != undefined){
          this.attributes.find(e => e.InDesignTagName == DataFieldIdsName).Value = response.selectedEmblemImg;
        } else {
          this.attributes.find(e => e.InDesignTagName == DataFieldIdsName).Value = "false";
        }       
        
        this.getPreview();
      };
    })
  }

  selectLogo(DataFieldIdsName) {
    this.showUploadLogo = false;
    let modalRef = this.modalService.open(EmblemComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered' });
    modalRef.componentInstance.logoLibrary = this.logoLibrary;
    modalRef.componentInstance.type = 'logo';
    this.emblem = <IEmblem>{};
    this.emblem.SystemName = this.systemName;
    this.emblem.SystemKey = this.adssId;
    this.emblem.AdMaterialId = this.adMaterialId;
    this.emblem.ExternalAdMaterialId = this.externalMaterialId;
    this.emblem.AdTemplateDataFieldIdsName = DataFieldIdsName;
    this.emblem.BUCode = this.buCode;
    this.emblem.PackageCode = this.packageCode;
    this.emblem.CustomerNumber = this.customerNumber;
    modalRef.componentInstance.emblem = this.emblem;
    modalRef.result.then(response => {
      if (response != undefined && response.data != undefined && response.data == 'success') {
        this.date = new Date().getTime();
        // this.logoImageUrl = response.selectedLogoImg.Url;
        this.attributes.find(e => e.InDesignTagName == DataFieldIdsName).Value = "false";
        this.getPreview();
      };
    })
  }


  openImageEditorModal(attribute, editImage?: string) {
    (<any>window)._trackEvent('Edit Material Upload', 'Upload Material Click', 'Upload File', 'Upload File');
    if (!isNullOrUndefined(editImage) && editImage == 'logo' && this.logosCount > 0)
      this.showUploadLogo = false;
    const modalRef = this.modalService.open(ImageEditorComponent, {
      size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
    });
    modalRef.componentInstance.odrerId = this.adssId;
    modalRef.componentInstance.currentOrderItemId = this.currentOrderItemId;
    modalRef.componentInstance.adMaterialId = this.adMaterialId;
    modalRef.componentInstance.externalMaterialId = this.externalMaterialId;
    modalRef.componentInstance.adSizeId = this.adSizeId;
    modalRef.componentInstance.sectionId = this.sectionId;
    //modalRef.componentInstance.selectedPubDates=this.dateFormatPipe.transform(this.selectedPubDates, 'MM/DD/YYYY');
    modalRef.componentInstance.isColor = this.isColor;
    modalRef.componentInstance.isEditImage = false;
    modalRef.componentInstance.dataFieldIdName = attribute.InDesignTagName;
    modalRef.componentInstance.isTemplateImage = true;
    modalRef.componentInstance.widthInPixels = Math.round(96 * attribute.Width);
    modalRef.componentInstance.heightInPixels = Math.round(96 * attribute.Height);
    modalRef.componentInstance.isFromDesignAdTemplate = true;
    modalRef.componentInstance.systemName = this.systemName;
    modalRef.componentInstance.imageUrl = (attribute.Value && attribute.Value.includes('false')) ? 'api/designAd/GetAdTemplateImage?systemName=' + this.systemName + '&systemKey=' + this.adssId + '&adMaterialId=' + this.adMaterialId + '&externalAdMaterialId=' + this.externalMaterialId + '&adTemplateDataFieldIdsName=' + attribute.InDesignTagName + '&isEmblem=false&isTemp=false&pathType=Original&ts=' + new Date().getTime() : this.photoImageUrl;
    modalRef.componentInstance.isRecropping = attribute.Value ? true : false;
    modalRef.componentInstance.isImageChanged = attribute.Value ? true : false;
    modalRef.componentInstance.customerNumber = this.customerNumber;

    if (editImage == 'logo') {
      if (isNullOrUndefined(this.customerNumber) || this.customerNumber == '') //|| this.isFromAdit || this.isEditFromAdit || !this.cookieService.check('c_mId')
      {
        modalRef.componentInstance.showSaveToLogoLibCheckbox = false;
      }
      else
        modalRef.componentInstance.showSaveToLogoLibCheckbox = true;

      modalRef.componentInstance.imageUrl = (attribute.Value && attribute.Value.includes('false')) ? 'api/designAd/GetAdTemplateImage?systemName=' + this.systemName + '&systemKey=' + this.adssId + '&adMaterialId=' + this.adMaterialId + '&externalAdMaterialId=' + this.externalMaterialId + '&adTemplateDataFieldIdsName=' + attribute.InDesignTagName + '&isEmblem=false&isTemp=false&pathType=Original&ts=' + new Date().getTime() : this.logoImageUrl;
    }

    modalRef.result.then(result => {
      if (result !== undefined && result.data && result.data == "acceptAndContinue") {
        this.attributes.find(e => e.InDesignTagName == attribute.InDesignTagName).Value = "false";
        this.date = new Date().getTime();
        if (editImage == 'logo')
          this.getLogoLibrary();
        this.getPreview();

      }
    })
  }


  updateForm($event, attribute) {
    let selectedOption = attribute.Options.find(e => e.Value == $event.target.value);

    if (!isNullOrUndefined(selectedOption) && !isNullOrUndefined(selectedOption.RelatedFields)) {
      let allChangingFields = [];
      for (let itemOption of attribute.Options) {
        if (!isNullOrUndefined(itemOption.RelatedFields)) {
          let allowedFields = itemOption.RelatedFields.split(",");
          for (let item of allowedFields) {
            if (allChangingFields.indexOf(item) == -1) {
              allChangingFields.push(item);
            }
          }
        }
      }

      let relatedFields: string[];
      relatedFields = selectedOption.RelatedFields.split(",");
      let formGroup = {};
      this.designAdForm = <FormGroup>{};
      this.isFormReady = false;
      this.dataFieldGroups = [];
      this.isImageRequired = false;
      for (let attributeGrp of this.dataFieldGroupsOriginal) {
        let attrGrp = <IFieldGroup>{};
        attrGrp.Name = attributeGrp.Name;
        attrGrp.Fields = [];
        for (let attribute of attributeGrp.Fields) {
          if (attribute.ElementType == this.fieldTypes['TemplateSection']) {
            for (let attribField of attribute.Fields) {
              let showField = relatedFields.indexOf(attribField.InDesignTagName) > -1 || allChangingFields.indexOf(attribField.InDesignTagName) == -1;
              if (showField) {
                attrGrp.Fields.push(attribField);
                if (!attribField.IsImage) {
                  formGroup[attribField.InDesignTagName] = new FormControl(isNullOrUndefined(attribField.Value) ? '' : attribField.Value, this.mapValidators(attribField));
                }
              }
              else {
                if (!attribField.IsImage) {
                  formGroup[attribField.InDesignTagName] = new FormControl('');
                }
              }
            }
          }
          else {
            let showField = relatedFields.indexOf(attribute.InDesignTagName) > -1 || allChangingFields.indexOf(attribute.InDesignTagName) == -1;
            if (showField) {
              attrGrp.Fields.push(attribute);
              if (!attribute.IsImage) {
                formGroup[attribute.InDesignTagName] = new FormControl(isNullOrUndefined(attribute.Value) ? '' : attribute.Value, this.mapValidators(attribute));
              }
            }
            else {
              if (!attribute.IsImage) {
                formGroup[attribute.InDesignTagName] = new FormControl('');
              }
            }
          }
        }
        this.dataFieldGroups.push(attrGrp);
      }
      this.designAdForm = new FormGroup(formGroup);
      this.isFormReady = true;
    }
    else {
      if (!isNullOrUndefined(selectedOption) && selectedOption.HasChildAttributes && !isNullOrUndefined(selectedOption.Attributes) && selectedOption.Attributes.length > 0) {
        selectedOption.Attributes.forEach(option => {
          this.dataFieldGroups.forEach(grp => {
            let field = grp.Fields.find(f => f.InDesignTagName == option.Name);
            if (!isNullOrUndefined(field)) {
              field.Options = option.Options;
              field.Value = "";
              this.designAdForm.controls[field.InDesignTagName].setValue("");
            }
          });
        });
      }
      else {
        if (attribute.Options[0].HasChildAttributes && !isNullOrUndefined(attribute.Options[0].Attributes) && attribute.Options[0].Attributes.length > 0) {
          attribute.Options[0].Attributes.forEach(option => {
            this.dataFieldGroups.forEach(grp => {
              let field = grp.Fields.find(f => f.InDesignTagName == option.Name);
              if (!isNullOrUndefined(field)) {
                field.Options = [];
                field.Value = "";
                this.designAdForm.controls[field.InDesignTagName].setValue("");
              }
            });
          });
        }
      }
    }

    this.dataChanged(attribute.InDesignTagName, $event.target.value);
  }

  updateDayList($event, attribute) {
    let daysAttrb = this.attributes.find(e => e.Class == 'day' && e.Grp == attribute.Grp);
    let month, year, yearattr, monthattr;
    if (attribute.Class == 'month') {
      month = adssMetadata.months.find(e => e.monthName == $event.target.value);

      yearattr = this.attributes.find(e => e.Class == 'year' && e.Grp == attribute.Grp);
      if (isNullOrUndefined(yearattr))
        year = new Date().getFullYear();
      else
        year = yearattr.Value;
      if (!isNullOrUndefined(daysAttrb)) {
        daysAttrb.Options = [];
        if (!isNullOrUndefined(month)) {
          let days = daysPopulator(month.monthNumber, year);
          days.map(item => {
            return {
              Key: item,
              Value: item
            }
          }).forEach(item => {
            daysAttrb.Options.push(item);
          });
        }

      }
    }
    else if (attribute.Class == 'year') {

      monthattr = this.attributes.find(e => e.Class == 'month' && e.Grp == attribute.Grp);
      if (!isNullOrUndefined(monthattr))
        month = adssMetadata.months.find(e => e.monthName == monthattr.Value);
      if (!isNullOrUndefined(daysAttrb) && !isNullOrUndefined(monthattr) && !isNullOrUndefined(month) && month.monthNumber == "2") {
        daysAttrb.Options = [];
        let days = daysPopulator(month.monthNumber, $event.target.value);
        days.map(item => {
          return {
            Key: item,
            Value: item
          }
        }).forEach(item => {
          daysAttrb.Options.push(item);
        });
      }
    }

    this.dataChanged(attribute.InDesignTagName);
  }

  replaceTags(FormCollection) {
    let newVal: string;
    let start, end, spantxt;
    this.dataFieldGroups.forEach(grp => {
      grp.Fields.forEach(f => {
        if (f.IsHtmlEditorRequired) {
          newVal = this.attributes.find(e => e.InDesignTagName == f.InDesignTagName).Value;
          if (!isNullOrUndefined(newVal)) {
            while (newVal.includes('<u ')) {
              start = 0;
              end = 0;
              start = newVal.indexOf('<u ');
              end = newVal.indexOf('>', start);
              spantxt = newVal.slice(start, end + 1);
              newVal = newVal.replace(spantxt, '');
            }

            while (newVal.includes('<em ')) {
              start = 0;
              end = 0;
              start = newVal.indexOf('<em ');
              end = newVal.indexOf('>', start);
              spantxt = newVal.slice(start, end + 1);
              newVal = newVal.replace(spantxt, '');
            }

            while (newVal.includes('<strong ')) {
              start = 0;
              end = 0;
              start = newVal.indexOf('<strong ');
              end = newVal.indexOf('>', start);
              spantxt = newVal.slice(start + 7, end);
              newVal = newVal.replace(spantxt, '');
            }

            while (newVal.includes('<span')) {
              start = 0;
              end = 0;
              start = newVal.indexOf('<span');
              end = newVal.indexOf('>', start);
              spantxt = newVal.slice(start, end + 1);
              newVal = newVal.replace(spantxt, '');
            }

            while (newVal.includes('</span>')) {
              start = 0;
              end = 0;
              start = newVal.indexOf('</span');
              end = newVal.indexOf('>', start);
              spantxt = newVal.slice(start, end + 1);
              newVal = newVal.replace(spantxt, '');
            }

          }
          FormCollection[f.InDesignTagName] = newVal;
        }
      });
    })

  }

  focused(attribute) {   
        if (this.designAdForm.controls[attribute.InDesignTagName].value && this.designAdForm.controls[attribute.InDesignTagName].value.length > 0 && this.designAdForm.controls[attribute.InDesignTagName].value == attribute.SampleText) {
      this.designAdForm.controls[attribute.InDesignTagName].setValue('');
    }
  }

  addSpace(attribute) {
    if (this.designAdForm.controls[attribute.InDesignTagName].value && this.designAdForm.controls[attribute.InDesignTagName].value.length > 0 && attribute.WordMaxLen > 0) {
      let modifiedText = this.designAdForm.controls[attribute.InDesignTagName].value.replace(new RegExp("(\\w{" + attribute.WordMaxLen + "})(?=\\w)","g"), "$1 ");
      this.designAdForm.controls[attribute.InDesignTagName].setValue(modifiedText);
    }
  }

  getWorngWords(attribute) {
    let wrongWords = [];
	 let wrongWordsInner = [];
    if (this.designAdForm.controls[attribute.InDesignTagName].value && this.designAdForm.controls[attribute.InDesignTagName].value.length > 0 && attribute.WordMaxLen > 0) {
      let arrayOfWords = this.designAdForm.controls[attribute.InDesignTagName].value.split(" ");
      arrayOfWords.forEach(el => {
        if(el.length > attribute.WordMaxLen){
          wrongWords.push(el);
        }
      });
     let arrayOfWordsarry = this.designAdForm.controls[attribute.InDesignTagName].value.split(" ");
      arrayOfWordsarry.forEach(el => {
        if(el.length > attribute.WordMaxLen){
          let arrayOfWordsarryenter = el.split('\n');
          arrayOfWordsarryenter.forEach(e2 => {
            if(e2.length > attribute.WordMaxLen){
              wrongWordsInner.push(e2);
            }
          });
        }
      });
      if(wrongWordsInner.length > 0){
        let wrongString = wrongWordsInner.join("<br/>");
        let errorMsgForMaxLen="The following word or words exceed the "+ attribute.WordMaxLen +" character limit for this field. Please add a space to resolve the issue:<br/>";
        this.designAdForm.controls[attribute.InDesignTagName].setErrors({
          "wordError": errorMsgForMaxLen  + wrongString
        });
        this.designAdForm.controls[attribute.InDesignTagName].markAsTouched();
      }
    }
    if(wrongWordsInner.length == 0){
      this.dataChanged(attribute.InDesignTagName);
    }
  }

  insertSymbol(symbolType: string, attribute) {
    let symbolText;
    switch (symbolType) {
      case "heart":
        symbolText = "♥";
        break;
      case "star":
        symbolText = "★";
        break;
      case "diamond":
        symbolText = "♦";
        break;
      case "circle":
        symbolText = "•";
        break;
      default:
    }
    let startSubstr, endSubstr, index;
    let appendSymbol = this.designAdForm.controls[attribute.InDesignTagName].value;
    if (appendSymbol && appendSymbol.length > 0) {
      index = appendSymbol.lastIndexOf('</p>');
      if (index > -1) {
        startSubstr = appendSymbol.slice(0, index)
        endSubstr = appendSymbol.slice(index, appendSymbol.length);
        appendSymbol = startSubstr + symbolText + endSubstr;
      }
      else
        appendSymbol += symbolText;
    }
    else
      appendSymbol = symbolText;

    this.designAdForm.controls[attribute.InDesignTagName].setValue(appendSymbol);
  }

  dataChanged(attrName, selectedValue?) {
    this.errorMesgsFromAPI = [];
    let newVal;
    let oldVal = this.attributes.find(e => e.InDesignTagName == attrName).Value;
    if (!isNullOrUndefined(selectedValue)) {
      newVal = selectedValue;
      this.designAdForm.controls[attrName].setValue(selectedValue);
    }
    else {
      newVal = this.designAdForm.controls[attrName].value;
      if (typeof (newVal) == 'string') {
        while (newVal.includes('\n')) {
          newVal = newVal.replace('\n', '\r');
          this.designAdForm.controls[attrName].setValue(newVal);
        }
      }

    }
    if (oldVal !== newVal) {
      this.attributes.find(e => e.InDesignTagName == attrName).Value = newVal;
      this.getPreview();
    }

  }

  getPreview() {
    this.showLinesexceededMsg = false;
    this.errorMesgsFromPreviewAPI = [];
    this.designAdErrors = [];
    this.errorMesgsFromAPI = [];

    for (let el of this.attributes) {
      if (this.designAdForm.controls[el.InDesignTagName]) {
        if(el.InDesignTagName=='PubDay')
        {
          this.designAdForm.controls['PubDay'].disable();
        }
        if (this.designAdForm.controls[el.InDesignTagName].getError('serverError')) {
          this.designAdForm.controls[el.InDesignTagName].setErrors(null);
          this.designAdForm.controls[el.InDesignTagName].updateValueAndValidity();
        }
      }
    }

    this.designAdPreviewRequest = <IGetDesignAdPreviewRequest>{};
    this.designAdPreviewRequest.OrderID = this.adssId;
    this.designAdPreviewRequest.SystemName = this.systemName;
    this.designAdPreviewRequest.OrderItemID = this.currentOrderItemId;
    this.designAdPreviewRequest.SectionId = this.sectionId;
    this.designAdPreviewRequest.AdSizeId = this.adSizeId;
    this.designAdPreviewRequest.PackageCode = this.packageCode;
    this.designAdPreviewRequest.AdMaterialId = this.adMaterialId;
    this.designAdPreviewRequest.ExternalAdMaterialId = this.externalMaterialId;
    this.designAdPreviewRequest.AdTemplateCode = this.templateCode;
    this.designAdPreviewRequest.IsColor = this.isColor;    
    this.designAdPreviewRequest.FormCollection = Object.assign({}, this.designAdForm.value);
    this.designAdPreviewRequest.FormCollection['PubDay']=this.PubDatesCsv;  
    this.designAdForm.patchValue( {'PubDay':this.PubDatesCsv} );
    
    if (this.attributes && this.attributes.length > 0) {   
      this.attributes.forEach(el => {
        if (el.IsImage) {
          if (isNullOrUndefined(el.Value)) {
            this.designAdPreviewRequest.FormCollection[el.InDesignTagName] = "true";           
            
          }
          else
        
            this.designAdPreviewRequest.FormCollection[el.InDesignTagName] = el.Value;
           
        }
      });
    }
    this.replaceTags(this.designAdPreviewRequest.FormCollection);
    

    this.fetchingPreview = true;

    this.designAService.getDesignAdPreview(this.designAdPreviewRequest).subscribe(data => {
      this.onPopoverLoad();
      this.errorMesgsFromPreviewAPI = [];
      this.fetchingPreview = false;
      if (!isNullOrUndefined(data.Result)) {
        this.designAdPreview = data.Result;
        if (!isNullOrUndefined(this.designAdPreview.ImageUrlX2))
          this.designAdPreview.ImageUrlX2 = this.designAdPreview.ImageUrlX2 + "&ts=" + new Date().getTime();
        if (this.adTemplate.MaxLines > 0 && this.designAdPreview.NumberOfLine > this.adTemplate.MaxLines) {
          this.showLinesexceededMsg = true;
        }
      }

      data.ValidationMessage.forEach(validationMesg => {
        if (validationMesg.Key != 'Exception' && validationMesg.Key != 'Error')
          this.errorMesgsFromAPI.push(validationMesg.Value);
        else
          this.errorMesgsFromPreviewAPI.push("There is an error from Server. Please try again.");
      });
      data.ErrorMessage.forEach(errorMessage => {
        if (errorMessage.Key != 'Exception' && errorMessage.Key != 'Error') {
          if (!isNullOrUndefined(this.designAdForm.controls[errorMessage.Key])) {
            this.designAdForm.controls[errorMessage.Key].setErrors({
              "serverError": errorMessage.Value
            });
            this.designAdForm.controls[errorMessage.Key].markAsTouched();
          }
          else
            this.errorMesgsFromPreviewAPI.push(errorMessage.Value);
        }
        else
          this.errorMesgsFromPreviewAPI.push("There is an error from Server. Please try again.");
      });
      setTimeout(() => { this.showPreviewMsg() }, 3000);
    });
  }

  showPreviewMsg() {
    if (!isNullOrUndefined(this.previewImg) && !isNullOrUndefined(this.previewImg.nativeElement) && this.previewImg.nativeElement.height > 0) {
      this.previewMsg = "This is a preview of your material.";
      let imgScale = (this.previewImg.nativeElement.height / this.previewImg.nativeElement.naturalHeight) * 84;
      let adTemplateScalingPercent = (imgScale > 100) ? 100 : (imgScale < 50) ? 50 : imgScale;
      if (this.previewImg.nativeElement.width / 2 < 460) {
        if (adTemplateScalingPercent != 50) {
          this.previewMsg = "This is a magnified preview of your material.";
        }
      }
      else
        this.previewMsg = "This is a preview of your material at a reduced size.";
    }
  }

  private mapValidators(attribute) {
    const formValidators = [];
    if (attribute.IsRequired)
      formValidators.push(Validators.required);
    if (attribute.ElementType == this.fieldTypes['EmailField'])
      formValidators.push(EmailValidator);
    return formValidators;

  }

  openMaterialPreview() {
    let dialogRefPopup = this.modalService.open(PreviewImageComponent, {
      backdrop: "static", size: "lg", windowClass: 'modal-dialog-centered'
    });
    dialogRefPopup.componentInstance.imageUrl = !isNullOrUndefined(this.designAdPreview) ? this.designAdPreview.ImageUrlX2 + "&adPreviewSizeId=0" : '';
    dialogRefPopup.componentInstance.imgHeight = !isNullOrUndefined(this.previewImg.nativeElement) ? this.previewImg.nativeElement.naturalHeight / 100 + "em" : "0em";
    dialogRefPopup.componentInstance.imgWidth = !isNullOrUndefined(this.previewImg.nativeElement) ? this.previewImg.nativeElement.naturalWidth / 100 + "em" : "0em";
    dialogRefPopup.componentInstance.isDesignAdMaterialPreview = true;
    let imgScale = (this.previewImg.nativeElement.height / this.previewImg.nativeElement.naturalHeight) * 84;
    dialogRefPopup.componentInstance.height = (imgScale > 100) ? 100 : (imgScale < 50) ? 50 : imgScale;

  }

  onClose() {
    (<any>window)._trackEvent('Design-ad Cancel', 'Cancel Click', 'Cancel Design-ad', 'Cancelling Design-ad');
    let body = "By cancelling, you will lose uploaded image & content. Do you wish to proceed?";
    let header = "Please confirm";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    let adMaterial = this.designAdMaterial ? this.designAdMaterial : this.documentAdMaterial;
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        if (adMaterial && adMaterial.CancelUrl.includes("drafts"))
          this.route.navigate(['/drafts/' + this.adssId + '/' + this.currentOrderItemId + '/configure'], { queryParams: { selectedTab: 1 } });
        else {
          let oldExtarnalId = adMaterial.CancelUrl.slice(adMaterial.CancelUrl.lastIndexOf("/") + 1,
            adMaterial.CancelUrl.lastIndexOf("?") != -1 ? adMaterial.CancelUrl.lastIndexOf("?") : adMaterial.CancelUrl.length);
          if (this.isEditFromAdit) {
            this.route.navigate(["/orders/" + this.aditId + "/edit/material/" + oldExtarnalId]);
          }
          else {
            this.route.navigate(["/order/edit/" + this.aditId + "/" + oldExtarnalId]);
          }
        }
      }
    });
  }

  saveAndContinue() {
    (<any>window)._trackEvent('Design-ad SaveAndContinue', 'Save and Continue Click', 'Save and Continue Design-ad', 'Save and Continue Design-ad');
    this.designAdErrors = [];
    this.errorMesgsFromAPI = [];
    this.errorMesgsFromPreviewAPI = [];
    let isValidData = true;

    if (this.attributes && this.attributes.length > 0) {
      for (let el of this.attributes) {
        if (el.IsImage && (el.IsRequired || !el.NotForMaterial) && (isNullOrUndefined(el.Value) || el.Value == 'true')) {
          isValidData = false;
          this.isImageRequired = true;
          break;
        }
      }
      for (let el of this.attributes) {
        if (el.ElementType !== this.fieldTypes['HiddenField'] && this.designAdForm.controls[el.InDesignTagName]) {
          if (this.designAdForm.controls[el.InDesignTagName].value && this.designAdForm.controls[el.InDesignTagName].value.length > 0 && this.designAdForm.controls[el.InDesignTagName].value == el.SampleText) {
            this.designAdForm.controls[el.InDesignTagName].setErrors({
              "defaultValue": "This field has sample text value. Please update."
            });
          }
          this.designAdForm.controls[el.InDesignTagName].markAsTouched();
        }
      }
    }

    if (this.designAdForm.valid && isValidData) {

      this.saveDesignAdRequest = <ISaveDesignAdRequest>{};
      this.saveDesignAdRequest.SystemName = this.systemName;
      this.saveDesignAdRequest.SystemKey = this.adssId;
      this.saveDesignAdRequest.SectionID = this.sectionId;
      this.saveDesignAdRequest.PositionID = this.positionID;
      this.saveDesignAdRequest.OrderID = this.adssId;
      this.saveDesignAdRequest.OrderItemID = this.currentOrderItemId;
      this.saveDesignAdRequest.AdTemplateCode = this.templateCode;
      this.saveDesignAdRequest.AdMaterialID = this.adMaterialId;
      this.saveDesignAdRequest.ExternalAdMaterialID = this.externalMaterialId;
      this.saveDesignAdRequest.AdSizeID = this.adSizeId;
      this.saveDesignAdRequest.IsColor = this.isColor;
      this.saveDesignAdRequest.FormCollection = Object.assign({}, this.designAdForm.value);      
      if (this.attributes && this.attributes.length > 0) {
        this.attributes.forEach(el => {

          if (this.designAdForm.controls[el.InDesignTagName]) {
                    if(el.InDesignTagName=='PubDay')
                    {
              this.saveDesignAdRequest.FormCollection["PubDay"]=this.PubDatesCsv;
            }
          }
          
          if (el.IsImage) {
            if (isNullOrUndefined(el.Value)) {
              this.saveDesignAdRequest.FormCollection[el.InDesignTagName] = "true";
            }
            else           
              this.saveDesignAdRequest.FormCollection[el.InDesignTagName] = el.Value;
          }
        });
      }
      this.saveDesignAdRequest.PackageCode = this.packageCode;
      this.saveDesignAdRequest.CustomerNumber = !isNullOrUndefined(this.customerNumber) ? this.customerNumber : '';
      this.designAService.saveDesignAdMaterial(this.saveDesignAdRequest).subscribe(data => {
        this.errorMesgsFromAPI = [];
        if (data.IsSuccess) {
          if (this.isFromAdit) {
            let body = "Ad material successfully created. You will now be returned to Order Entry.";
            let confirmPopup = this.discardModalService.showAditMessage(body);
            window.parent && window.parent.postMessage('editAd', "*");
          }
          else {
            if (this.designAdMaterial && this.designAdMaterial.CancelUrl.includes("drafts"))
              this.route.navigate(['/drafts/' + this.adssId + '/' + this.currentOrderItemId + '/configure'], { queryParams: { selectedTab: 1, updateDraft: true } });
            else
              //redirect to configure page layout tab
              if (this.isEditFromAdit) {
                this.route.navigate(["/orders/" + this.aditId + "/edit/material/" + this.externalMaterialId], {
                  queryParams: {
                    isRedirectedFromDesignAd: true
                  }
                });
              }
              else {
                this.route.navigate(["/order/edit/" + this.aditId + "/" + this.externalMaterialId], {
                  queryParams: {
                    isRedirectedFromDesignAd: true
                  }
                });
              }
          }
        }
        else {
          data.ValidationMessage.forEach(validationMesg => {
            if (validationMesg.Key != 'Exception' && validationMesg.Key != 'Error')
              this.errorMesgsFromAPI.push(validationMesg.Value);
            else
              this.errorMesgsFromAPI.push("There is an error from Server. Please try again.");
          });
          data.ErrorMessage.forEach(errorMessage => {
            if (errorMessage.Key != 'Exception' && errorMessage.Key != 'Error') {
              if (!isNullOrUndefined(this.designAdForm.controls[errorMessage.Key]))
                this.designAdForm.controls[errorMessage.Key].setErrors({
                  "serverError": errorMessage.Value
                });
              else
                this.errorMesgsFromAPI.push(errorMessage.Value);
            }
            else
              this.errorMesgsFromAPI.push("There is an error from Server. Please try again.");
          });
        }
      });

    }
    else {
      this.designAdErrors.push("Please provide all required details or correct invalid field(s).");
    }
  }

  selectTemplate(tile) {
    (<any>window)._trackEvent('Configure Ad Template', 'Template Click', 'Select Template', 'Select Template');
    this.templateCode = tile.Code;
    this.getDesignAdMaterial();
  }

  getEmblemImages() {
    let subCatId: string = this.isFromAdit ? this.documentAdMaterial && this.documentAdMaterial.SubCategoryId > 0 ? this.documentAdMaterial.SubCategoryId.toString() : "0" : this.designAdMaterial && this.designAdMaterial.SubCategoryId > 0 ? this.designAdMaterial.SubCategoryId.toString() : "0";
    this.designAService.getEmblem(this.buCode, subCatId).subscribe(data => {
      this.emblemImages = data.Result;
    },
      (error) => {

      });
  }

  getLogoLibrary() {
    if (!isNullOrUndefined(this.customerNumber) && this.customerNumber !== '') {
      this.photoLibraryService.getLogoLibrary(this.customerNumber)
        .subscribe((data) => {
          this.logoLibrary = data;
          this.logosCount = this.logoLibrary.length;
          this.showUploadLogo = this.logoLibrary.length == 0;
        },
          (error) => {

          })
    }
    else {
      this.showUploadLogo = true;
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {

    this.carouselLoaded = false;
    this.onCarouselLoaded();
    this.popOverLoaded = false;
    this.onPopoverLoad();
  }

  onPopoverLoad() {
    if (this.popOver && !this.popOverLoaded) {
      this.popOverLoaded = true;
      if (this.IsSmallScreen()) {
        if (this.popOver.isOpen()) {
          this.popOver.close();
          this.isPreviewOpen = false;
        }
      }
      else {
        if (!this.popOver.isOpen()) {
          this.popOver.open();
          this.isPreviewOpen = true;
        }
      }
    }
  }

  popOverClicked() {
    this.isPreviewOpen = !this.isPreviewOpen;
    if (this.IsSmallScreen()) {
      if (this.isPreviewOpen) {
        setTimeout(() => { this.showPreviewMsg() }, 3000);
      }
    }
  }

  openFormattingGuidelines() {
    (<any>window)._trackEvent('Design Ad Template', 'Recommended Formatting Guidelines Click', 'Recommended Formatting Guidelines Click', 'Recommended Formatting Guidelines Click');
    const modalRef = this.modalService.open(FormattingGuidelinesComponent, {
      size: 'lg', backdrop: 'static', windowClass: 'modal-dialog-centered'
    });
  }

  assignFocus() {
    this.dataFieldGroups.forEach(dataFieldGroup => {
      dataFieldGroup.Fields.forEach(attribute => {
        if (attribute.ElementType == this.fieldTypes['SingleLineDataField'] || attribute.ElementType == this.fieldTypes['EmailField']) {
          this.focusOut[attribute.Name] = true;
        }
      });
    });
  }

  IsMediumScreen = () => window.innerWidth > 767 && window.innerWidth < 1024;
  IsSmallScreen = () => window.innerWidth <= 767;


}

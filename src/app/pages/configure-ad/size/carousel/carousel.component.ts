import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from "@angular/core";
import { BaseClass } from "../../../../shared/base.class";
import { NguCarousel, NguCarouselStore, NguCarouselConfig } from '@ngu/carousel';
import { ILayout } from "../../../../models/layout.model";
import { IOrder, IOrderItem } from "../../../../models/order-item.model";
import { isNullOrUndefined } from "util";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: "carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.css"]
})
export class CarouselComponent extends BaseClass {

  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Input() itemsList: any[] = [];
  @Input() type: string;
  @Input() IsDesignAdOnly: boolean = false;
  @Input() isColor?: boolean = false;
  @Input() imageWidth: number;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('templateCarousel',{static:true}) templateCarousel: NguCarousel<any>;

  templateSize: number = 0;
  adMaterialId: number;
  externalMaterialId: number;
  adSizeId: number;
  
  packageCode: string;
  sectionId: number;
  positionID: number;
  buCode: string;
  private carouselLoaded: boolean = false;

  public carouselTileTwoItems: Array<any> = [];
  public carouselTileTwo: NguCarouselConfig;
  constructor(_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  ngOnChanges() {
    if (this.type == 'template' || this.type == 'layout') {
      this.packageCode = !isNullOrUndefined(this.order.PackageCode) ? this.order.PackageCode : '';
      this.adSizeId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSizeId : 0;
      this.adMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].Id : 0;
      this.externalMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].ExternalId : 0;
      // this.isColor = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.IsColor : false;
      this.sectionId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.SectionId : 0;
      this.positionID = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.PositionId : 0;
      // this.buCode = this.order.BUCode;
      this.buCode = this.currentOrderItem.Section.Product.BusinessUnit.Code;
    }
  }

  validationInit() {
    this.templateSize  =  this.IsDesignAdOnly  ?  6  :  4;
    let  templateSizeForMediumScreen  =  this.IsDesignAdOnly  ?  4  :  3;
    let  templateSizeForSmallScreen  =  this.IsDesignAdOnly  ?  3  :  2;
    if  (this.type  ==  'template') {
      this.carouselTileTwo  =  {
        grid:  {  xs:  1,  sm:  templateSizeForSmallScreen,  md:  templateSizeForMediumScreen,  lg:  this.templateSize,  all:  0  },
        speed:  200,
        slide:  1,
        animation:  'lazy',
        point:  {
          visible:  false,
        },
        load:  2,
        touch:  true,
        easing:  'ease'
      };

    }
    else  {
      this.carouselTileTwo  =  {
        grid:  {  xs:  1,  sm:  3,  md:  4,  lg:  6,  all:  0  },
        speed:  200,
        slide:  1,
        animation:  'lazy',
        point:  {
          visible:  false,
        },
        load:  2,
        touch:  true,
        easing:  'ease'
      };
    }
    if (this.type == 'template' || this.type == 'layout') {
      this.packageCode = !isNullOrUndefined(this.order.PackageCode) ? this.order.PackageCode : '';
      this.adSizeId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.AdSizeId : 0;
      this.adMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].Id : 0;
      this.externalMaterialId = (!isNullOrUndefined(this.currentOrderItem) && !isNullOrUndefined(this.currentOrderItem.AdMaterial) && this.currentOrderItem.AdMaterial.length > 0) ? this.currentOrderItem.AdMaterial[0].ExternalId : 0;
      // this.isColor = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.IsColor : false;
      this.sectionId = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.SectionId : 0;
      this.positionID = !isNullOrUndefined(this.currentOrderItem) ? this.currentOrderItem.PositionId : 0;
    }
  }

  ngAfterViewChecked() {
    if (this.type == 'layout' || this.type == 'addImage')
      this.onCarouselLoaded();

  }

  onCarouselLoaded() {
    if (this.templateCarousel && !this.carouselLoaded) {
      this.carouselLoaded = true;
      // let itemsShown = this.templateCarousel.data.items;
      // let currentIndex = this.getCarouselSlideIndex(itemsShown >= 0 ? itemsShown : 1);
      // this.templateCarousel.moveTo(currentIndex);
    }
  }

  getCarouselSlideIndex(itemsPerSlide: number) {
    let templateIndex = 0;
    let selectedItem = this.itemsList.find(data => data.Ischecked)
    if (!isNullOrUndefined(selectedItem)) {
      let itemIndex = this.itemsList.indexOf(selectedItem);
      if (itemIndex >= 0) {
        templateIndex = itemIndex + 1;
      }
    }
    let totalSlides = this.itemsList.length - itemsPerSlide;
    if (templateIndex < itemsPerSlide) {
      return 0;
    }
    else {
      var minPage = templateIndex - itemsPerSlide;
      var maxPage = minPage + Math.floor(itemsPerSlide / 2);
      return maxPage <= totalSlides ? maxPage : minPage;
    }
  }


  selectTile(tile, operationToPerform) {
    let routerLink, queryParams;
    if (this.type != 'layout')
      tile.Ischecked = true;
      if (this.type == 'template')
      {
        routerLink = '/drafts/'+this.order.AdSSId +'/' + this.currentOrderItem.Id +'/design-ad';
        queryParams = {noTemplateChange: false, adSizeId: this.adSizeId,  templateCode: tile.Code, adMaterialId: this.adMaterialId, externalMaterialId: this.externalMaterialId, isColor: this.isColor, sectionId: this.sectionId, selectedRunDate: this.currentOrderItem.RunDates, positionId: this.positionID, packageCode: this.packageCode, buCode: this.buCode, isEditing: false}
      }    

    this.passEvent.emit({ selectedTile: tile, operationToPerform: operationToPerform, routerLink: routerLink, queryParams:queryParams });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.carouselLoaded = false;
    this.onCarouselLoaded();
  }

}

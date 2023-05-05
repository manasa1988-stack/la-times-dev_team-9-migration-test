import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseClass } from "../../../shared/base.class";
import { IOrder, IOrderItem, IVolumeDiscount } from '../../../models/order-item.model'
import * as adssMetadata from '../../../shared/adss.metadata';
import { IAvailableDates, IDeadlineMessage } from '../../../models/availabledates.model';
import { ConfigureAdService } from '../configure-ad.service';
import { IImpression } from "../../../models/impression.model";
import { IOrderItemPrice } from "../../../models/order-item-price.model";
import { HostListener } from "@angular/core";
import { isNullOrUndefined } from "util";
import { isEmpty } from "rxjs/operator/isEmpty";
import * as _ from 'lodash';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import {
  NgbDatepickerConfig,
  NgbDateStruct,
  NgbCalendar
} from "@ng-bootstrap/ng-bootstrap";
import { OrderByPipe } from "../../../filters/orderby.pipe";
import { IConfigureDFPData } from "../../../models/dfp-data.model";
import { DateFormatPipe } from "../../../filters/dateformat.pipe";
import { ILayoutCarouselItem } from "../../../models/layout.model";
//import { Console } from "console";

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one &&
  two &&
  two.year === one.year &&
  two.month === one.month &&
  two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
      ? one.month === two.month
        ? one.day === two.day ? false : one.day < two.day
        : one.month < two.month
      : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
      ? one.month === two.month
        ? one.day === two.day ? false : one.day > two.day
        : one.month > two.month
      : one.year > two.year;

const now = new Date();



@Component({
  selector: "schedule-ad",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"]
})
export class ScheduleComponent extends BaseClass {
  impressionNums: number = 0;
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Input() currentorderItemPrice: number;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  orderItemTypes = adssMetadata.OrderItemType;
  @Input() availableDates: IAvailableDates;
  @Input() volumeDiscounts: IVolumeDiscount[];
  @Input() impressions: IImpression[] = [];
  @Input() volumeDiscountID: number;
  @Input() configureDFPData: IConfigureDFPData;
  @Input() layoutData: ILayoutCarouselItem;

  availableDatesNew: IAvailableDates;
  selectedZones: any[];
  selectedTargets: number[];
  selectedZonesCsv: string;
  selectedTargetsCsv: string;
  selectedPubDates: Date[] = [];
  minutesBeforeDeadline: number = 720;
  deadlineMessages: IDeadlineMessage[] = [];
  //  run dates
  currentDate: NgbDateStruct;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  maxDate: any;
  minDate: any;
  startDate: Date;
  endDate: Date;
  navigation: string;
  availableDatesForFullRun: any[];
  allZonesAvailableDaysOfWeek: any[];

  groupedVD: any[];
  selectedDiscountText: string;
  discountApplied: IVolumeDiscount;
  selectedDiscount: IVolumeDiscount;
  displayWidth: number;
  numberOfDisplayMonths: number;
  private intervalId: any;
  currentPageloadTime: number = 0;
  oldOrderItem: IOrderItem;
  constructor(private configureAdService: ConfigureAdService, private orderbypipe: OrderByPipe,
    private dateFormatPipe: DateFormatPipe, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.currentDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.selectedDiscountText = "ALL OFFERS";
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.displayWidth = window.innerWidth;

    if (window.innerWidth < 576) {
      this.numberOfDisplayMonths = 1;
    } else if (window.innerWidth < 768) {
      this.numberOfDisplayMonths = 2;
    } else if (window.innerWidth < 1024) {
      this.numberOfDisplayMonths = 3;
    } else {
      this.numberOfDisplayMonths = 4;
    }

    if (!isNullOrUndefined(this.currentOrderItem) && this.currentOrderItem.IsDfpOrderItem) {
      this.navigation = "arrows";
    }
    else {
      if (this.maxDate && this.minDate) {

        if (this.maxDate.month - this.minDate.month < this.numberOfDisplayMonths && this.maxDate.year == this.minDate.year)
          this.navigation = "none";
        else this.navigation = "arrows";
      }
    }
  }

  offerSelected(event) {
    if (event == "ALL OFFERS") {
      this.selectedDiscountText = event;
    }
    else {
      this.selectedDiscount = event;
      this.selectedDiscountText = Math.ceil(event.key * 100) + '%';
    }
  }

  validationInit() {
    this.selectedZones = this.currentOrderItem.ZoneIds;
    this.intervalId = setInterval(() => {
      this.currentPageloadTime += 60000; //1 min = (1000 * 60 = 60000 miliseconds)
      this.generateDeadLineMessage();
    }, 60000);
  }


  populateRunDates() {
    let pubDates, availablePubDates;
    // let lastAvailableDate = new Date(this.availableDates.LastAvailableDate);
    // let firstAvailableRunDate = new Date(this.availableDates.FirstAvailableDate);

    let lastAvailableDate = new Date(this.dateFormatPipe.transform(this.availableDates.LastAvailableDate, "MM/dd/yyyy"));
    let firstAvailableRunDate = new Date(this.dateFormatPipe.transform(this.availableDates.FirstAvailableDate, "MM/dd/yyyy"));
    firstAvailableRunDate.setHours(0, 0, 0, 0);
    this.maxDate = {
      year: lastAvailableDate.getFullYear(),
      month: lastAvailableDate.getMonth() + 1,
      day: lastAvailableDate.getDate()
    };

    this.minDate = {
      year: firstAvailableRunDate.getFullYear(),
      month: firstAvailableRunDate.getMonth() + 1,
      day: firstAvailableRunDate.getDate()
    };

    if (this.maxDate.month - this.minDate.month < this.numberOfDisplayMonths && this.maxDate.year == this.minDate.year)
      this.navigation = "none";
    else this.navigation = "arrows";

    pubDates = this.currentOrderItem.RunDates;
    this.selectedPubDates = [];
    if (!isNullOrUndefined(pubDates) && pubDates.length > 0) {
      for (let e of pubDates) {
        if (new Date(e) >= now && new Date(e) >= firstAvailableRunDate)
          this.selectedPubDates.push(new Date(e));
      }
    }

    if(!isNullOrUndefined(this.order.IsScheduleRunDatesWeekly) && this.order.IsScheduleRunDatesWeekly)
      {
        var isEqualDate = this.dateFormatPipe.transform(pubDates[0], "yyyyMMdd") ==  this.dateFormatPipe.transform(firstAvailableRunDate, "yyyyMMdd")
        if(!isNullOrUndefined(pubDates) && pubDates.length > 0 && isEqualDate)
        {
        this.selectedPubDates=[];
      this.selectedPubDates.push(new Date(firstAvailableRunDate));
      for (let i = 0; i < this.currentOrderItem.NumOfInsertions -1; i++) {
        let adddt = firstAvailableRunDate.setDate(firstAvailableRunDate.getDate() + 7);
          this.selectedPubDates.push(new Date(adddt));
      }
      }
    }

    if (this.availableDates.IsDefaultLayout && this.selectedPubDates.length == 0 && (isNullOrUndefined(this.currentOrderItem.NumDays) || this.currentOrderItem.NumDays == 0)) 
    {
      if (!isNullOrUndefined(this.availableDates.PubDatesCsv)) {
        availablePubDates = this.availableDates.PubDatesCsv.split(",");
        for (let e of availablePubDates) {
          this.selectedPubDates.push(new Date(this.dateFormatPipe.transform(e, "MM/dd/yyyy")));
        }
      }
      else {
        this.selectedPubDates.push(new Date(firstAvailableRunDate));
      }

    }
    this.impressionNums = 0;
    if (this.currentOrderItem.NumDays && this.currentOrderItem.NumDays > 0) {
      this.impressionNums = this.currentOrderItem.NumDays;
      let sdt;
      if (this.currentOrderItem.StartDate) {
        if (new Date(this.currentOrderItem.StartDate) >= now)
          sdt = new Date(this.currentOrderItem.StartDate)
        else
          sdt = now;
        let date = {
          year: sdt.getFullYear(),
          month: sdt.getMonth() + 1,
          day: sdt.getDate()
        };
        this.calculateImpressionNums(date);
      }
    }
    this.selectedPubDates = this.orderbypipe.transform(this.selectedPubDates);
 
    this.getVolumeDiscounts();
    if (this.currentOrderItem.ZoneIds && this.currentOrderItem.ZoneIds.length > 0 && (isNullOrUndefined(this.currentOrderItem.NumTargetOptions) || this.currentOrderItem.NumTargetOptions <= 0)) {
      this.selectedZonesCsv = this.currentOrderItem.ZoneIds.join(',');
      let tmp = this.selectedZonesCsv.split(",");
      this.selectedZones = tmp;
      this.allZonesAvailableDaysOfWeek = [];
      this.availableDatesForFullRun = [];
      for (let zone of this.selectedZones) {
        if (this.availableDates.ZoneFullRun.Id == zone || !this.availableDates.AvailableZones || this.availableDates.AvailableZones.length == 0) {
          this.allZonesAvailableDaysOfWeek = [];
          this.availableDatesForFullRun = this.availableDates.AvailableDatesForFullRun;
          break;
        }
        else {
          if (this.availableDates.AllZonesAvailableDaysOfWeek && this.availableDates.AllZonesAvailableDaysOfWeek[zone]) {
            this.availableDates.AllZonesAvailableDaysOfWeek[zone].forEach(day => {
              this.allZonesAvailableDaysOfWeek.push(day.toString());
            });
          }
        }
      }

    }
    else {
      this.allZonesAvailableDaysOfWeek = [];
      this.availableDatesForFullRun = this.availableDates.AvailableDatesForFullRun;
    }


    this.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      if (this.availableDatesForFullRun && this.availableDatesForFullRun.length > 0) {
        let elm = this.availableDatesForFullRun.find(e => this.dateFormatPipe.transform(e.Date, "yyyyMMdd") === this.dateFormatPipe.transform(d, "yyyyMMdd"));
        if (elm)
          return false;
        else
          return true;
      }
      else if (!isNullOrUndefined(this.allZonesAvailableDaysOfWeek)) {
        return !this.allZonesAvailableDaysOfWeek.includes(d.getDay().toString());
      }
      else
        return false;
    };

    if (!isNullOrUndefined(this.selectedPubDates) && this.selectedPubDates.length > 0) {
      let tmpSelectedDates: Date[] = [];
      for (let tmpdt of this.selectedPubDates) {
        tmpSelectedDates.push(new Date(tmpdt));
      }

      this.selectedPubDates.forEach(dt => {

        if ((isNullOrUndefined(this.availableDatesForFullRun) || this.availableDatesForFullRun.length == 0) && !isNullOrUndefined(this.allZonesAvailableDaysOfWeek) && this.allZonesAvailableDaysOfWeek.length > 0) {
          if (!this.allZonesAvailableDaysOfWeek.includes(dt.getDay().toString())) {
            let index = tmpSelectedDates.map(Number).indexOf(+dt);
            if (index > -1)
              tmpSelectedDates.splice(index, 1);
          }
        }
      });
      this.selectedPubDates = tmpSelectedDates;
    }
    this.generateDeadLineMessage();
    this.updateCurrentOrderItem();
    if (!_.isEqual(this.oldOrderItem, this.currentOrderItem)) {
      this.notifyRunDatesChange();
    }

  }

  populateDFPDates() {
    let pubDates;

    let firstAvailableRunDate = new Date(new Date().setDate(now.getDate() + 2));
    let lastDt = new Date().setFullYear(now.getFullYear() + 1);
    let lastAvailableDate = new Date(lastDt);

    this.maxDate = {
      year: lastAvailableDate.getFullYear(),
      month: lastAvailableDate.getMonth() + 1,
      day: lastAvailableDate.getDate()
    };

    this.minDate = {
      year: firstAvailableRunDate.getFullYear(),
      month: firstAvailableRunDate.getMonth() + 1,
      day: firstAvailableRunDate.getDate()
    };

    this.navigation = "arrows";
    this.impressionNums = 0;
    if (this.currentOrderItem.NumDays && this.currentOrderItem.NumDays > 0) {
      this.impressionNums = this.currentOrderItem.NumDays;
      let sdt;
      if (this.currentOrderItem.StartDate) {
        if (new Date(this.currentOrderItem.StartDate) >= now)
          sdt = new Date(this.currentOrderItem.StartDate)
        else
          sdt = now;

        let date = {
          year: sdt.getFullYear(),
          month: sdt.getMonth() + 1,
          day: sdt.getDate()
        };
        this.calculateImpressionNums(date);
      }
    }
    this.selectedPubDates = this.orderbypipe.transform(this.selectedPubDates);
    if (!isNullOrUndefined(this.currentOrderItem.RunDates) && (this.currentOrderItem.RunDates.length != this.currentOrderItem.NumDays)) {
      this.updateCurrentOrderItem();
      this.notifyRunDatesChange();
    }

  }


  updateCurrentOrderItem() {

    this.currentOrderItem.RunDates = this.selectedPubDates;

    if (!isNullOrUndefined(this.selectedPubDates) && this.selectedPubDates.length > 0) {
      let stdat, enddt;
      stdat = new Date(
        Math.min.apply(
          null,
          this.selectedPubDates.map(function (e) {
            return new Date(e);
          })
        )
      );
      enddt = new Date(
        Math.max.apply(
          null,
          this.selectedPubDates.map(function (e) {
            return new Date(e);
          })
        )
      );
      this.currentOrderItem.StartDate = new Date(
        Math.min.apply(
          null,
          this.selectedPubDates.map(function (e) {
            return new Date(e);
          })
        )
      );
      this.currentOrderItem.EndDate = new Date(
        Math.max.apply(
          null,
          this.selectedPubDates.map(function (e) {
            return new Date(e);
          })
        )
      );
      this.currentOrderItem.RunDateString = this.dateFormatPipe.transform(stdat, "EEEE, M/d/yyyy") + " - " + this.dateFormatPipe.transform(enddt, "EEEE, M/d/yyyy");
    }
    else {
      this.currentOrderItem.StartDate = null;
      this.currentOrderItem.EndDate = null;
      this.currentOrderItem.RunDateString = null;
    }
    if (this.currentOrderItem.IsDfpOrderItem) {
      this.currentOrderItem.NumDays = !isNullOrUndefined(this.selectedPubDates) ? this.selectedPubDates.length : 0;

    }    
    this.currentOrderItem.Zones = [];
    this.currentOrderItem.ZoneIds.forEach(z => {
      if(this.availableDates.ZoneFullRun.Id == z){
        this.currentOrderItem.Zones.push(this.availableDates.ZoneFullRun);
      }
      else{
        this.currentOrderItem.Zones.push(this.availableDates.AvailableZones.find(a => a.Id == z));
      }
    })
  }

  notifyRunDatesChange() {
    setTimeout(() => {
      this.passEvent.emit({ fromChild: "Schedule", grandChild: "rundates", selectedPubDates: this.selectedPubDates, availableDates: this.availableDates, selectedZones: this.selectedZones, currentOrderItem: this.currentOrderItem });
    }, 1000);
    // this.passEvent.emit({ fromChild: "Schedule", grandChild: "rundates", selectedPubDates: this.selectedPubDates, availableDates: this.availableDates, selectedZones: this.selectedZones, currentOrderItem: this.currentOrderItem });
  }

  getWeeklyDays(date)
  {
    let selectedDate = new Date(date.year, date.month - 1, date.day);
    this.selectedPubDates=[];
    this.selectedPubDates.push(new Date(selectedDate));
    for (let i = 0; i < this.currentOrderItem.NumOfInsertions -1; i++) {
      let adddt = selectedDate.setDate(selectedDate.getDate() + 7);
        this.selectedPubDates.push(new Date(adddt));
    }
  }

  ngOnChanges() {

    this.oldOrderItem = Object.assign({}, this.currentOrderItem);

    if (!isNullOrUndefined(this.availableDates)) {

      this.selectedPubDates = [];
      this.startDate = undefined;
      this.endDate = undefined;
      this.impressionNums = this.currentOrderItem.NumDays ? this.currentOrderItem.NumDays : 0;
      this.currentPageloadTime = new Date(this.availableDates.PageLoadTime).getTime();
      if (this.currentOrderItem.IsDfpOrderItem)
        this.populateDFPDates();
      else
        this.populateRunDates();
    }
  }


  getVolumeDiscounts() {
    if (this.volumeDiscounts && this.volumeDiscounts.length > 0) {
      this.discountApplied = <IVolumeDiscount>{};
      let grp = this.volumeDiscounts.reduce((previous, current) => {
        if (!previous[current['DiscountPercent']]) {

          previous[current['DiscountPercent']] = [current];
        } else {
          previous[current['DiscountPercent']].push(current);
        }

        return previous;
      }, {});

      this.groupedVD = Object.keys(grp).map(key => ({ key, items: grp[key] }));
      if (this.volumeDiscounts.length > 0 && this.selectedPubDates && this.selectedPubDates.length > 0)
        this.calculateDiscountRange(this.minDate);
      this.discountApplied = this.volumeDiscounts.find(e => e.Id == this.volumeDiscountID);

    }
    else {
      this.fromDate = null;
      this.toDate = null;
    }
  }

  markDisabled = (date: NgbDateStruct) => {
    const d = new Date(date.year, date.month - 1, date.day);
    if (this.availableDatesForFullRun && this.availableDatesForFullRun.length > 0) {
      let elm = this.availableDatesForFullRun.find(e => this.dateFormatPipe.transform(e.Date, "yyyyMMdd") === this.dateFormatPipe.transform(d, "yyyyMMdd"));
      if (elm)
        return false;
      //true;
      else
        return true;
      //false;
    }
    else if (!isNullOrUndefined(this.allZonesAvailableDaysOfWeek)) {
      return !this.allZonesAvailableDaysOfWeek.includes(d.getDay().toString());
    }
    else
      return false;
  };

  calculateImpressionNums(date) {
    this.selectedPubDates = [];
    let selectedDate = new Date(date.year, date.month - 1, date.day);
    if (before(date, this.minDate)) {
      selectedDate = new Date(this.minDate.year, this.minDate.month - 1, this.minDate.day);
    }
    if (this.impressionNums > 0) {
      this.selectedPubDates.push(new Date(selectedDate));
      this.startDate = new Date(selectedDate);
      this.currentOrderItem.EndDate = this.startDate;
      for (var i = 1; i < this.impressionNums; i++) {
        let adddt;
        if(!isNullOrUndefined(this.order.IsScheduleRunDatesWeekly) && this.order.IsScheduleRunDatesWeekly)
        {
          
          adddt = selectedDate.setDate(selectedDate.getDate() + 7);
        }
        else {
          adddt = selectedDate.setDate(selectedDate.getDate() + 1);
        }
        
        this.selectedPubDates.push(new Date(adddt));
        if (i == this.impressionNums - 1) {
          this.endDate = new Date(adddt);
          this.currentOrderItem.EndDate = this.endDate;
        }

      }

    }
  }

  calculateDiscountRange(date) {
    let fdt, tdt;
    if (this.selectedPubDates.length > 0) {
      fdt = new Date(
        Math.min.apply(
          null,
          this.selectedPubDates.map(function (e) {
            return new Date(e);
          })
        )
      );
      this.fromDate = {
        year: fdt.getFullYear(),
        month: fdt.getMonth() + 1,
        day: fdt.getDate()
      };
    }
    else
      this.fromDate = date;

    tdt = new Date(
      this.fromDate.year,
      this.fromDate.month - 1,
      this.fromDate.day
    );
    tdt.setDate(tdt.getDate() + this.volumeDiscounts[0].RangeDays - 1);
    this.toDate = {
      year: tdt.getFullYear(),
      month: tdt.getMonth() + 1,
      day: tdt.getDate()
    };
  }

  setDfpFromAndTodates(date) {
    if (!this.selectedPubDates)
      this.selectedPubDates = [];
    let fdt, tdt;
    if (this.selectedPubDates.length > 0) {
      fdt = new Date(
        Math.min.apply(
          null,
          this.selectedPubDates.map(function (e) {
            return new Date(e);
          })
        )
      );
      this.fromDate = {
        year: fdt.getFullYear(),
        month: fdt.getMonth() + 1,
        day: fdt.getDate()
      };
    }
    else {
      this.fromDate = date;
      this.toDate = date;
    }
    if (before(this.fromDate, date)) {
      this.toDate = date;
    }
    else {
      this.toDate = this.fromDate;
      this.fromDate = date;
    }

    this.selectDFPDateRange();
  }

  selectDFPDateRange() {

    if (!equals(this.fromDate, this.toDate) || this.selectedPubDates.length == 0) {

      this.selectedPubDates = [];
      let selectedDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      let lstDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      this.selectedPubDates.push(new Date(selectedDate));
      this.startDate = new Date(selectedDate);
      this.endDate = new Date(selectedDate);
      let adddt = selectedDate.setDate(selectedDate.getDate() + 1);
      while (new Date(adddt) <= lstDate) {
        this.selectedPubDates.push(new Date(adddt));
        this.endDate = new Date(adddt);
        adddt = selectedDate.setDate(selectedDate.getDate() + 1);
      }

    }
    this.currentOrderItem.NumDays = this.selectedPubDates.length;

  }

  onDateSelection(date) {
    if (this.currentOrderItem.IsDfpOrderItem) {
      this.setDfpFromAndTodates(date);
    }
    else {
      if (this.impressionNums > 0) {
        this.calculateImpressionNums(date);

      }
      else {
        let index: number = -1;
        let selectedDate = new Date(date.year, date.month - 1, date.day);
        if(!isNullOrUndefined(this.order.IsScheduleRunDatesWeekly) && this.order.IsScheduleRunDatesWeekly)
        {
          this.getWeeklyDays(date);
        }
        else {
        if (!this.selectedPubDates)
          this.selectedPubDates = [];
        index = this.selectedPubDates.map(Number).indexOf(+selectedDate);
        if (index > -1)
          this.selectedPubDates.splice(index, 1);
        else
          this.selectedPubDates.push(selectedDate);
        }
        if (this.volumeDiscounts && this.volumeDiscounts.length > 0)
          this.calculateDiscountRange(date);
      }
    }
    this.selectedPubDates = this.orderbypipe.transform(this.selectedPubDates);
    this.generateDeadLineMessage();
    this.updateCurrentOrderItem();
    this.notifyRunDatesChange();
  }
 

  isSelected(date: NgbDateStruct) {
    let selectedDate = new Date(date.year, date.month - 1, date.day);
    if (this.selectedPubDates) {
      let index = this.selectedPubDates.map(Number).indexOf(+selectedDate);
      if (index > -1) return true;
    }
    return false;
  }

  isPubDateSelected() {
    if (this.selectedPubDates) return this.selectedPubDates.length;
    return false;
  }

  clearAllSelectedDates() {
    this.selectedPubDates = [];
    this.startDate = undefined;
    this.endDate = undefined;
    this.currentOrderItem.RunDates = this.selectedPubDates;
    this.currentOrderItem.StartDate = null;
    this.currentOrderItem.EndDate = null;
    this.currentOrderItem.RunDateString = null;
    this.notifyRunDatesChange();
    // this.passEvent.emit({ fromChild: "Schedule", grandChild: "rundates", selectedPubDates: this.selectedPubDates, availableDates: this.availableDates, selectedZones: this.selectedZones, currentOrderItem: this.currentOrderItem });
  }

  removeDate(date) {
    this.onDateSelection({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
  }

  isDiscounted = date =>
    (after(date, this.fromDate) && before(date, this.toDate)) ||
    equals(date, this.toDate);

  isToday = date =>
    equals(date, this.currentDate);

  onNotify($event: any) {

    if ($event.fromChild == "impressions") {
      this.impressionNums = $event.impression.NumDays;
      this.currentOrderItem.ImpressionsName = $event.impression.Name;
      this.currentOrderItem.NumDays = this.impressionNums;
      this.currentOrderItem.NumImpressions = $event.impression.NumImpressions;
      this.populateRunDates();
    }

    if ($event.fromChild == "geoTargets" || $event.fromChild == "reach") {      
      this.availableDates = $event.availableDates;
      this.selectedZones = $event.selectedZones;
     
      this.selectedZonesCsv = $event.selectedZones.join(',');
      if (this.currentOrderItem.NumTargetOptions > 0)
        this.currentOrderItem.TargetIds = this.selectedZones;
      else
        this.currentOrderItem.ZoneIds = this.selectedZones;
      this.populateRunDates();
    }

    if ($event.fromChild == "dfpTargetting") {
      if ($event.locationList.length > 0)
        this.currentOrderItem.DfpGeoTargetting = $event.locationList.join(",");
      else
        this.currentOrderItem.DfpGeoTargetting = '';
    }

    if ($event.fromChild == "dfpInventory") {
      this.currentOrderItem.NumImpressions = $event.currentOrderItem.NumImpressions;
    }

    if ($event.fromChild == "adSize") {
      if($event.operationToPerform && $event.operationToPerform == 'startOver')
      {      
          this.passEvent.emit({ fromChild: "adSize", action: 'startOver', currentOrderItem: this.currentOrderItem, selectedTile: $event.selectedTile, skipPriceCalulcation: true });
      }
      else
      {
        this.currentOrderItem.AdSize = $event.selectedTile.AdSize;
        this.currentOrderItem.AdSizeId = $event.selectedTile.AdSize.Id;
        setTimeout(() => {
          this.passEvent.emit({ fromChild: "adSize", grandChild: $event.fromChild, currentOrderItem: this.currentOrderItem, skipPriceCalulcation: true })
        },1000);
      }   
    }
    else
      this.passEvent.emit({ fromChild: "Schedule", grandChild: $event.fromChild, selectedPubDates: this.selectedPubDates, availableDates: this.availableDates, selectedZones: this.selectedZones, currentOrderItem: this.currentOrderItem });
  }

  generateDeadLineMessage() {
    this.deadlineMessages = [];
    if (this.selectedPubDates && this.selectedPubDates.length > 0 && this.availableDates.AvailableDatesForFullRun) {
      for (let pubdt of this.selectedPubDates) {
        let elm = this.availableDates.AvailableDatesForFullRun.find(el =>
          new Date(el.Date).toDateString() == pubdt.toDateString());
        if (elm) {
          let minutedTillDeadline = Math.floor((new Date(elm.Deadline).getTime() / 1000) / 60) - Math.floor((this.currentPageloadTime / 1000) / 60);
          if (minutedTillDeadline <= this.minutesBeforeDeadline) {
            let deadLineMessage = <IDeadlineMessage>{};
            deadLineMessage.deadlineDate = new Date(elm.Deadline);
            deadLineMessage.dispPubDate = pubdt;

            if (minutedTillDeadline <= 0) {
              deadLineMessage.isError = true;
            }
            else {
              deadLineMessage.isWarning = true;
            }
            this.deadlineMessages.push(deadLineMessage);
            if (this.currentOrderItem.TypeId == this.orderItemTypes['OnlineDisplayOrderItem'])
              break;
          }
        }
      }
    }
  }
}

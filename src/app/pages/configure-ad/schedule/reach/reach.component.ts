import { Component, Input, Output, EventEmitter, Inject } from "@angular/core";
import { BaseClass } from "../../../../shared/base.class";
//import { forEach } from "@angular/router/src/utils/collection";
import { ConfigureAdService } from "../../configure-ad.service";
import { IAvailableDates, IZoneMap } from '../../../../models/availabledates.model';
import { IZone, IOrderItem } from "../../../../models/order-item.model";
import { DOCUMENT } from '@angular/common';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "reach",
  templateUrl: "./reach.component.html",
  styleUrls: ["./reach.component.scss"]
})
export class ReachComponent extends BaseClass {
  @Input() availableDates: IAvailableDates;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  isAllAvailableZonesChecked: boolean = false;
  selectedZones: any[] = [];
  isTouchDevice: boolean = false;

  constructor(@Inject(DOCUMENT) private document: any,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);    
    if("ontouchstart" in document.documentElement)
    {
      this.isTouchDevice = true;
    }
  }

  validationInit() {  
    this.selectedZones = this.currentOrderItem.ZoneIds;
  }

  fullRunZoneSelected($event) {
    this.updateFullRunCheck($event);
    if ($event.checked) {
      this.selectedZones = [];
      this.selectedZones.push(this.availableDates.ZoneFullRun.Id);
      this.availableDates.AvailableZones.forEach(zone => {
        this.selectedZones.push(zone.Id);
      });
      this.updateAllAvailablesZones($event, $event.checked);
    }
    else {
      this.selectedZones = [];
      this.updateAllAvailablesZones($event, true);
    }   
    this.passEvent.emit({ fromChild:"reach" ,availableDates: this.availableDates, selectedZones: this.selectedZones });
  }

  updateAllAvailablesZones($event, isShowMap) {
    this.availableDates.AvailableZones.forEach(zone => {
      zone.isChecked = $event.checked;
    });

    this.availableDates.AvailableZoneMaps.forEach(map => {
      if (map.ZoneId != this.availableDates.ZoneFullRun.Id)
        map.isSelected = !isShowMap;
    });

  }

  updateFullRunCheck($event) {
    this.availableDates.ZoneFullRun.isChecked = $event.checked;
    this.availableDates.AvailableZoneMaps.find(map => map.ZoneId == this.availableDates.ZoneFullRun.Id).isSelected = $event.checked;
  }

  zoneSelected(currentZone, $event) {
    currentZone.isChecked = $event.checked;
    this.availableDates.AvailableZoneMaps.find(map => map.ZoneId == currentZone.Id).isSelected = $event.checked;
    if ($event.checked) {
      this.selectedZones.push(currentZone.Id);
      if (this.selectedZones.length == this.availableDates.AvailableZones.length) {
        this.selectedZones.push(this.availableDates.ZoneFullRun.Id);
        this.fullRunZoneSelected($event);
      }

    }
    else {
      this.selectedZones.splice(this.selectedZones.indexOf(currentZone.Id), 1);
      if (this.selectedZones.indexOf(this.availableDates.ZoneFullRun.Id) > -1) {
        this.selectedZones.splice(this.selectedZones.indexOf(this.availableDates.ZoneFullRun.Id), 1);
        this.updateFullRunCheck($event);
        this.availableDates.AvailableZoneMaps.forEach(map => {
          if (this.selectedZones.indexOf(map.ZoneId) > -1) {
            map.isSelected = true;
          }
        });
      }

    }

    this.passEvent.emit({ fromChild:"reach" ,availableDates: this.availableDates, selectedZones: this.selectedZones });

  }

  mouseEvent(currentZoneId, $event) {
   
    if(!this.isTouchDevice)
    {
      if (this.selectedZones.indexOf(currentZoneId) === -1) {
        if ($event.type == "mouseenter")
        this.availableDates.AvailableZoneMaps.find(map => map.ZoneId == currentZoneId).isSelected = true;
        else if ($event.type == "mouseleave")
        this.availableDates.AvailableZoneMaps.find(map => map.ZoneId == currentZoneId).isSelected = false;
      }
    }
    
  }
}
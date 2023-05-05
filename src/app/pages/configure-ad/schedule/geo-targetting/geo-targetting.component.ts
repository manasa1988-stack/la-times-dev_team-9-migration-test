import { Component, Input, Output, EventEmitter} from "@angular/core";
import { BaseClass } from "../../../../shared/base.class";
//import { forEach } from "@angular/router/src/utils/collection";
import { IAvailableDates, IZoneMap } from '../../../../models/availabledates.model';
import { IGeoTarget, IOrderItem } from "../../../../models/order-item.model";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: "geo-targetting",
  templateUrl: "./geo-targetting.component.html",
  styleUrls: ["./geo-targetting.component.scss"]
})
export class GeoTargettingComponent extends BaseClass {
  @Input() availableDates: IAvailableDates;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  isAllAvailableZonesChecked: boolean = false;

  selectedZones: any[] = [];

  constructor( _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.selectedZones = this.currentOrderItem.TargetIds;    
  }

  targetSelected(currentTarget, $event) {
    currentTarget.isChecked = $event.checked;
   this.currentOrderItem.Targets = [];
    this.availableDates.AvailableZoneMaps.find(map => map.ZoneId == currentTarget.Id).isSelected = $event.checked;
      if ($event.checked) {
        this.selectedZones.push(currentTarget.Id);       
      }
      else {
        let index = this.selectedZones.indexOf(currentTarget.Id);
        if(index > -1)
        this.selectedZones.splice(index, 1);
      }       
      this.currentOrderItem.TargetIds = this.selectedZones;
      this.selectedZones.forEach(z => {
        this.currentOrderItem.Targets.push(this.availableDates.OnlineDisplayTarget.find(t => t.Id == z));
      });       
      
      this.passEvent.emit({ fromChild: "geoTargets", availableDates: this.availableDates, selectedZones: this.selectedZones, currentOrderItem: this.currentOrderItem });
  }

  mouseEvent(currentTargetId, $event) {
     if (this.selectedZones.indexOf(currentTargetId) === -1) {
      if($event.type == "mouseenter")
      this.availableDates.AvailableZoneMaps.find(map => map.ZoneId == currentTargetId).isSelected = true;
      else if($event.type == "mouseleave")
      this.availableDates.AvailableZoneMaps.find(map => map.ZoneId == currentTargetId).isSelected = false;
     }
  }
}
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseClass } from '../../../../shared/base.class';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ConfigureAdService } from '../../configure-ad.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DraftOrdersService } from '../../../draft-orders/draft-orders.service';
import { isNullOrUndefined } from 'util';
import { ITargetData, IConfigureDFPData, IDFPLocation } from '../../../../models/dfp-data.model';
import { IOrder, IOrderItem } from '../../../../models/order-item.model';
import { DiscardModalService } from '../../../../shared/discard-modal.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'targeting',
  templateUrl: './targeting.component.html',
  styleUrls: ['./targeting.component.css']
})
export class TargetingComponent extends BaseClass {
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Input() configureDFPData: IConfigureDFPData;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();

  showData: boolean;
  selectedStates: IDFPLocation[] = [];
  displayCities: IDFPLocation[] = [];
  selectedState: IDFPLocation;
  targetList: { ID: number, Name: string, Type: string; ParentLocation: string }[] = [];
  //tList: ITargetData[];
  removable: boolean = true;
  locationList: number[] = [];
  states: IDFPLocation[];
  cities: IDFPLocation[];
  currentOrderItemId: number;
  adssId: number;


  constructor(private formBuilder: FormBuilder,
    private configureAdService: ConfigureAdService,
    private draftOrderService: DraftOrdersService,
    private route: Router,
    private currentRoute: ActivatedRoute,
    private discardModalService: DiscardModalService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.showData = true;
  }

  ngOnChanges() {
    this.getTargettingData();
    this.showData = true;
  }

  validationInit() {
    //this.getTargettingData();
  }

  getTargettingData() {
    this.targetList = [];
    this.locationList = [];
    this.states = this.configureDFPData.DFPStates;
    this.selectedStates = this.states;
    if (this.currentOrderItem.DFPLocations.length > 0) 
    {
      this.currentOrderItem.DFPLocations.map(item => {
        return {
          ID: item.LocationId,
          Name: item.Name,
          Type: item.TargetType,
          ParentLocation: !isNullOrUndefined(this.states.find(s => s.ID == item.ParentLocationId)) ? this.states.find(s => s.ID == item.ParentLocationId).Name : null
        }
      }).forEach(item => {
        this.targetList.push(item);
        this.locationList.push(item.ID);
      });

      this.targetList.forEach(target => {
        let value = this.states.find(state => state.ID == target.ID)
        if (!isNullOrUndefined(value))
          value.IsIncluded = true;
      })

    }

  }

  addTargetItem(state) {
    let city = this.targetList.find(target => target.ParentLocation == state.Name);
    if (!isNullOrUndefined(city)) {
      this.removeCitiesData(state);
    }
    else
    {
      this.states.find(data => data.ID == state.ID).IsIncluded = true;
      this.targetList.push({ ID: state.ID, Name: state.Name, Type: state.Type, ParentLocation: null });
      this.locationList.push(state.ID);
      this.passEvent.emit({ fromChild: "dfpTargetting", locationList: this.locationList });
    }
    
    
  }

  removeItem(targetItem) {
    if (targetItem.Type == 'State' && !isNullOrUndefined(this.states)) {
      this.states.find(data => data.ID == targetItem.ID).IsIncluded = false;

    } else if (targetItem.Type == 'City' && !isNullOrUndefined(this.cities)) {
      this.cities.find(data => data.ID == targetItem.ID).IsIncluded = false;
    }
    this.targetList = this.targetList.filter(target => target.ID != targetItem.ID);

    let index = this.locationList.indexOf(targetItem.ID);
    if (index > -1)
      this.locationList.splice(index, 1);

    this.passEvent.emit({ fromChild: "dfpTargetting", locationList: this.locationList });

  }

  removeCitiesData(state) {
    let body = "This will remove all selected City targets for " + state.Name;
    let header = "Confirmation";
    let confirmPopup = this.discardModalService.deleteOrCancel(body, header);
    confirmPopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.locationList = [];
        this.states.find(data => data.ID == state.ID).IsIncluded = true;
        this.targetList.push({ ID: state.ID, Name: state.Name, Type: state.Type, ParentLocation: null });
        this.targetList = this.targetList.filter(target => target.ParentLocation != state.Name);
        this.targetList.forEach(target => {
          this.locationList.push(target.ID);
        });      
        this.passEvent.emit({ fromChild: "dfpTargetting", locationList: this.locationList });   
      }
    });
  }

  addCityItem(city) {
    this.cities.find(data => data.ID == city.ID).IsIncluded = true;
    this.targetList.push({ ID: city.ID, Name: city.Name, Type: city.Type, ParentLocation: city.ParentLocation });
    this.locationList.push(city.ID);
    // if (this.locationList == '')
    //   this.locationList += city.ID;
    // else
    //   this.locationList += "," + city.ID;

    this.passEvent.emit({ fromChild: "dfpTargetting", locationList: this.locationList });
  }

  processResponse(state) {
    this.cities.forEach(e => e.ParentLocation = state.Name);
  }

  showCity(state) {
    this.selectedState = state;
    this.configureAdService.getDfpCities(state.ID).subscribe(data => {
      if (data.IsSuccess && !isNullOrUndefined(data.Result)) {
        this.cities = data.Result.Locations;
        this.processResponse(state);
        this.targetList.forEach(target => {
          let value = this.cities.find(city => city.ID == target.ID)
          if (!isNullOrUndefined(value))
            value.IsIncluded = true;
        })
      }
      this.displayCities = this.cities;
    })
    this.showData = false;
  }

  showState() {
    this.showData = true;
  }


  searchState(event): void {
    let stateSearch = event.target.value;
    this.selectedStates = this.states.filter(data => data.Name.toLowerCase().indexOf(stateSearch.toLowerCase()) > -1);
  }

  searchCity(event): void {
    let citySearch = event.target.value;
    this.displayCities = this.cities.filter(data => data.Name.toLowerCase().indexOf(citySearch.toLowerCase()) > -1);
  }


}




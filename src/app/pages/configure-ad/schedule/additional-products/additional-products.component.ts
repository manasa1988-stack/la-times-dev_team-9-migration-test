import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BaseClass } from '../../../../shared/base.class';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ConfigureAdService } from '../../configure-ad.service';
import { IOptOutReason, IOrder, IOrderItem, IPackageProduct } from '../../../../models/order-item.model';
import { DiscardModalService } from '../../../../shared/discard-modal.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { IOptOutSubscription } from '../../../../models/optoutsubscription.model';

@Component({
  selector: 'additional-products',
  templateUrl: './additional-products.component.html',
  styleUrls: ['./additional-products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalProductsComponent extends BaseClass {
  @Input() order: IOrder;
  @Input() currentOrderItem: IOrderItem;
  @Output() passEvent: EventEmitter<any> = new EventEmitter<any>();
  hasSubscriptionProducts : boolean;
  hasAdditionalProducts: boolean;
  showOptOutReasonList :boolean;
  optOutReasonRequired:boolean;
  selectedOptOutReasonId: number;
  OtherOptOutReason:string;
  OptOutReason:string;
  objOptOutSubscription :any;
  optOutReasonList : IOptOutReason[];

  constructor(private route: Router,
    private currentRoute: ActivatedRoute,
    private discardModalService: DiscardModalService,
    private configureAdService: ConfigureAdService,
     _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  ngOnChanges() {
    if(this.order.IsSubscriptionOpted)
    {
      this.order.RemovableLines = this.order.RemovableLines.filter(x => !x.Section.IsSubscriptionSection); 
    } 
 
  }

 

  onReasonSelectingOption(event)
  {
  
    this.preparedatatoPassevent();
    
  }

  notify()
  {
    
    this.preparedatatoPassevent();

  }

  preparedatatoPassevent()
  {
    
    this.OptOutReason ='';
    if(this.selectedOptOutReasonId && this.selectedOptOutReasonId >0 && this.optOutReasonList.length >0)
    {      
      this.OptOutReason=this.optOutReasonList.find(x=>x.Id == this.selectedOptOutReasonId).Name;
     
    }
    this.passEvent.emit({ fromChild: "additionalProducts", selectedOptOutReasonId: this.selectedOptOutReasonId, optOutReasonRequired: this.optOutReasonRequired, OptOutReason: this.OptOutReason, OtherOptOutReason: this.OtherOptOutReason });
  }
    
  checkBoxOptClicked(value, additionalProduct) {
    if(value) {
      this.addNewItem(additionalProduct);
    }
    else {
      this.removeProduct(additionalProduct);
    }

  }

  subscriptionRadioSelected(event,additionalProduct)
  {
   
    if(event.value && event.value > 0)
    {
      var removesubscriptionFromDB = this.order.RemovableLines.filter(x => x.Section.IsSubscriptionSection && x.SectionId != event.value); 
      if(removesubscriptionFromDB && removesubscriptionFromDB.length >0 )
      {
        removesubscriptionFromDB.forEach(line => {
          this.removeProduct(line);
        });
      }
      this.addNewItem(additionalProduct);
      
    }
    else 
    {
      var removesubscriptionFromDB = this.order.RemovableLines.filter(x => x.Section.IsSubscriptionSection); 
      if(removesubscriptionFromDB && removesubscriptionFromDB.length >0 )
      {
        removesubscriptionFromDB.forEach(line => {
          this.removeProduct(line);   
        });
        
      }
      
    }
    this.doAsyncTask();
  }

  checkAdditionalProductStatus(sectionId) {
    var orderItem = this.order.OrderItems.find(o =>  o.SectionId == sectionId);
    if(orderItem !== undefined) {
      return true;
    }
    return false;
  }

  checkAdditionalProductStatusNoSubscription()
  {
    var orderItem =this.order.OrderItems.filter(x => x.Section.IsSubscriptionSection);
   
    if(orderItem && orderItem.length > 0) {
      this.showOptOutReasonList=false;
            return false;
    }
    this.showOptOutReasonList =true;
    
    return true;
  }

  removeProduct(currentOrderItem) {
      this.removeOrderItemData(currentOrderItem);
  }

  addNewItem(currentProduct) {
    this.configureAdService.createNewAdditionalOrderItem(this.order.AdSSId, currentProduct.SectionId, currentProduct.ProductTypeId).subscribe(data => {
      if (data.IsSuccess) {
        if(currentProduct.Section.IsSubscriptionSection == false)
          this.passEvent.emit({ fromChild: "updateSection" });
      }
    },
      (error) => {        
      });
  }

   doAsyncTask() {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.passEvent.emit({ fromChild: "updateSection" });
        console.log("Async Work Complete");
        
      }, 3000);
    });
    return promise;
  }


  validationInit() {
    if(this.order && this.order.RemovableLines && this.order.RemovableLines.length > 0)
    {     
      this.optOutReasonRequired = this.order.IsOptOutReasonRequired;
      this.optOutReasonList = this.order.OptOutReasonList;
    if( this.order.RemovableLines.filter(x => x.Section.IsSubscriptionSection).length > 0)
     {
      this.hasSubscriptionProducts = true;
     }

     if( this.order.RemovableLines.filter(x => !x.Section.IsSubscriptionSection).length > 0)
     {
      this.hasAdditionalProducts = true;
     }
     this.configureAdService.getSubOptOutFromCache(this.order.AdSSId).subscribe((data:any) => {
      if(data.Result)
      {
        this.objOptOutSubscription = data.Result;
        if(this.objOptOutSubscription)
        {
          this.selectedOptOutReasonId = Number(this.objOptOutSubscription.optOutReasonID);
         // this.OptOutReason = this.objOptOutSubscription.optOutReasonID >0 ? this.objOptOutSubscription.optOutReason:'';
          this.OtherOptOutReason = this.objOptOutSubscription.optOutReasonID <= 0 ?this.objOptOutSubscription.optOutReason:'';
          this.preparedatatoPassevent();
        }
      }
      else
      {
        this.preparedatatoPassevent();
      }
     
      
    });
     

    }
    
  }

  removeOrderItemData(currentOrderItem) {
    var orderItem = this.order.OrderItems.find(o =>  o.SectionId == currentOrderItem.SectionId);
    if(orderItem !== undefined) {
    this.configureAdService.deleteAdditionalOrderItem(orderItem.Id).subscribe((data:any) => {
      if (data.IsSuccess) { 
        if(currentOrderItem.Section.IsSubscriptionSection == false)
          this.passEvent.emit({ fromChild: "updateSection" });
      }
    },
      (error) => { 
      });
    }
  }
}

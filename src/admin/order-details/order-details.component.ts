import { Component, OnInit } from '@angular/core';
import { AdminBaseClass } from "../shared/admin-base.class";
import { FormControl, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderDetailsService } from './order-details.service';
import { AdminService } from '../admin.service';
import { IOrder, IAdSize, IOrderItem } from '../../app/models/order-item.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent extends AdminBaseClass {
    order: IOrder = <IOrder>{};
    isDataReady: boolean = true;
    displayError: boolean = false;
    orderDetailsForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private orderDetailsService: OrderDetailsService, _configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
        this.orderDetailsFormBuilder();
    }

    orderDetailsFormBuilder() {
        this.orderDetailsForm = this.formBuilder.group({
            'orderId': [''],
            'isAdit': [false]
        })
    }

    getOrderSummary() {
        let orderId = this.orderDetailsForm.controls['orderId'].value;

        if (orderId) {
            let system = this.orderDetailsForm.value.isAdit ? "adit" : "adss";
            this.isDataReady = false;
            this.orderDetailsService.getOrderDetails(system, orderId).subscribe(data => {
                if (data.IsSuccess) {
                    this.order = data.Result;
                    this.isDataReady = true;
                    this.displayError = false;
                }
                else {
                    this.isDataReady = true;
                    this.displayError = true;
                }
            }, (err) => {
                this.order = null;
                this.isDataReady = true;
                this.displayError = true;
            });
        }
    }

    reload($event) {
        if ($event.reload) {
            location.reload();
        }            
    }
}

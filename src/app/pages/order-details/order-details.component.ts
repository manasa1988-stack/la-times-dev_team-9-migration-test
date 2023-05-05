import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SpinnerService } from '../../shared/spinner.service';
import { StorageService } from '../../shared/storage.service';
import { IMarketSettings } from '../../models/market-settings.model';
import { IOrderItem, IAdMaterial, IOrder } from "../../models/order-item.model";
import { OrderHistoryService } from '../order-history/order-history.service';
import { DraftOrdersService } from '../draft-orders/draft-orders.service';
import { ProductSummaryService } from '../product-summary/product-summary.service';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit {
    orderId: number;
    adssId: number;
    isOrderLoaded: boolean = false;
    order: IOrder = null;
    isAdItInReadOnlyMode: boolean = false;
    marketSettings: IMarketSettings = null;
    errorMessage: string;

    upsellProcessed: any[] = [];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private draftOrdersService: DraftOrdersService,
        private orderHistoryService: OrderHistoryService,
        private storageService: StorageService,
        private productSummaryService: ProductSummaryService) {
        (<any>window)._trackEvent('Dashboard Edit Order', 'Edit Order Click', 'Edit Order', 'Edit Order');
        (<any>window)._trackPage('ADSS - Order Details', this.route.snapshot.url);
    }

    ngOnInit() {

        this.route.params.subscribe((params: Params) => {
            this.orderId = params['orderId'] ? params['orderId'] : null;
            this.adssId = params['adssId'] ? params['adssId'] : null;
        });

        this.getOrderDetails();

        this.marketSettings = <IMarketSettings>this.storageService.getHOST();
    }

    getOrderDetails() {
        if (this.orderId && this.orderId > 0) {
            this.orderHistoryService.getOrderSummary(this.orderId)
                .subscribe(data => {
                    this.order = data;
                    this.upsellProcessed = this.productSummaryService.processUpsellIfPresent(this.order);
                    this.isOrderLoaded = true;
                },
                    (error) => {
                        this.isOrderLoaded = true;
                    });
        }
        else if (this.adssId && this.adssId > 0) {
            this.getDraftDetails();
        }
        else {
            this.isOrderLoaded = true;
            this.order = null;
        }
    }

    getDraftDetails() {
        this.draftOrdersService.getDraftSummary(this.adssId)
            .subscribe(data => {
                this.order = data;
                this.upsellProcessed = this.productSummaryService.processUpsellIfPresent(this.order);
                if (this.order.AditId > 0) {
                    this.router.navigateByUrl('/orders/' + this.order.AditId);
                    this.isOrderLoaded = false;
                }
                else if (!this.order.IsQueued) {
                    this.order = null;
                    this.errorMessage = "This order is not queued";
                    throw Error(this.errorMessage);
                }

                this.isOrderLoaded = true;
            },
                (error) => {
                    this.router.navigateByUrl('/orders/' + this.adssId);
                    this.isOrderLoaded = true;
                });
    }

    reload($event) {
        if ($event.reloadCancelled)
            this.getOrderDetails();
    }
}

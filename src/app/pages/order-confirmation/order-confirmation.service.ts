import { BaseService } from "../../shared/base.service";
import { IOrder } from "../../models/order-item.model";
import { Injectable } from "@angular/core";

@Injectable()
export class ConfirmationService extends BaseService {

    confirmedOrder: IOrder;

    setConfirmedOrder(order: IOrder) {
        this.confirmedOrder = order;
    }

    getConfirmedOrder(): IOrder {
        return this.confirmedOrder;
    }
}
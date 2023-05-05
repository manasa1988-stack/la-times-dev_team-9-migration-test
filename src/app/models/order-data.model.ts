import { IOrderListItem } from "./order.model";

export interface IOrderListData {
    Results: IOrderListItem[];
    PageSize: number;
    PageNumber: number;
    Total: number;
    NumberOfPages: number;
    any:any;
}
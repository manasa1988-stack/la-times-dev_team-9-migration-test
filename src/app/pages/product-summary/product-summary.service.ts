import { BaseService } from "../../shared/base.service";
import { isNullOrUndefined } from "util";
import { getUpsellImageListArray } from "../../shared/common.functions";
import { Injectable } from "@angular/core";

@Injectable()
export class ProductSummaryService extends BaseService {

    private upsellProcessed: any[] = [];

    processUpsellIfPresent(order) {

        let attribute;

        order.OrderItems.forEach(item => {

            if (item.UpsellAttributes.length > 0) {

                this.upsellProcessed[item.Id] = {};

                item.UpsellAttributes.forEach(upsellAttribute => {

                    attribute = order.AttributeValues[upsellAttribute.Name];

                    if (upsellAttribute.IsImageListType && !isNullOrUndefined(attribute.Value)) {
                        this.upsellProcessed[item.Id][upsellAttribute.Name] = getUpsellImageListArray(attribute, upsellAttribute.MaxLength);
                    }
                });
            }
        });

        return this.upsellProcessed;

    }
}
export interface IDiscountedOrder { 
    FinalPrice: number;
    IsFullDiscountCoupon: boolean;
    DiscountedPrice: number;
    OriginalPrice: number;
    HasContract: boolean;
}
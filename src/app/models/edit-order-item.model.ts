export interface IEditOrderItem {
    OrderId: number;
    OrderItemId: number;
    AdSizeId: number;
    AdTemplateCode: string;
    IsColor: boolean;
    RedirectPage: string;
    PositionHeaderId?: number;
    ClassCodeValue: string;
    PubDatesCsv: string;
    ZoneIdsCsv: string;
    StartDate: string;
    NumImpressions: number;
    NumDays: number;
    ClickThroughUrl: string;
    IsOnlineProductStartDateModifiedByUser: boolean;
    SubsectionId: number;
    DfpGeoTargetting: string;
    DfpCampaignName: string;
    DfpContactNo: string;
    DfpEmail: string;
    AvailableUnits: number;
    DFPCostModel: string;
    DFPProductId: number;
    DFPProductName: string;
    IsValidate: boolean;
}
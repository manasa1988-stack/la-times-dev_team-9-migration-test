export interface ICreateOrderRequest{
    ProductId: number;
    SectionId: number;
    AdSizeId: number;
    AdTemplateCode: string;
    PositionId: number;
    ZoneIds: string;
    TargetTypeId: number;
    ClassCodeGroupId: number;
    Package: string;
    UsePrimaryDates: boolean
  }

  
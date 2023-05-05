export interface ISetting {
    Description: string;
    Key: string;
    UpdateDate: string;
    Value: string;
    Type ?: string;    
    ShowError?:boolean;
    UpdatedJustNow ?: boolean;
    OldValue?: string;
    NoChangesDetected?: boolean;
}

export interface ITheme {
    Id: number;
    MarketName: string;
    BUCode: string;
    CommunityCode: string;
    ThemeUrl: string;
    HostName: string;
    IsSecuredTheme: boolean;
    IsLegacyTheme: boolean;
    UsageAnalyticsCode: string;
}

export interface IQueueOrder {
    OrderId: number;
    Description: string;
    SerializedRequest: string;
    RunCount: number;
    LastRun: string;
    ProcessedDate: string;
    CreateDate: string;
    BookingDeadline: string;
    BookingDeadlineTimeZone: string;
    IsProcessing: boolean;
    isSelected?: boolean;
    convertedBookingDeadline? : string;
}

export interface IOrderQueueList {
    Results: IQueueOrder[];
    PageSize: number;
    PageNumber: number;
    Total: number;
    NumberOfPages: number;
    IsAdItInReadOnlyMode: boolean;
    any:any
}

export interface IRegressionLink {
    BusinessUnitName: string;
    ProductGroupName: string;
    PortalProductGroupLink: IPortalProductGroupLink;
}

export interface IPortalProductGroupLink {
    Id: string;
    IsRegression: boolean;
    SectionName: string;
    PositionName: string;
    Description: string;
    QueryString: string;
    SubCategoryID: number;
    SubCategoryDescription: string;
}

export interface ICache {
    Key: string;
    Server : string[];
    any:any;
}

export interface IOrderTemplate {
    DataFieldId: number;
    IsDefaultImage : boolean;
    Name: string;
    Value: string;
}
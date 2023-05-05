export interface ISetting {
    Description: string;
    Key: string;
    UpdateDate: string;
    Value: string;
    // Type: string;
    // isEditing: boolean
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
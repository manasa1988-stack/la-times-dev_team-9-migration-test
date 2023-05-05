import { IAddress } from "./address.modal";
import { ICreditCard } from "./credit-card.model";

export interface IId {
    Id: number
}

export interface INameId {
    Id: number;
    Name: string
}

export interface IValDesc {
    Value: string;
    Description: string
}

export interface IDayOfWeek {
    AvailableDay: number;
    DeadlineMinutes: number;
    DeadlineHours: number;
}

export interface IZone {
    Id: number;
    Name: string;
    AdItName: string;
    Description: string;
    IsFullRun: boolean;
    DaysOfWeekAvailable: IDayOfWeek[];
    DeadlineExceptionDates: any[];
    isChecked?: boolean;
}


export interface IGeoTarget {
    Id: number;
    Name: string;
    PriceModifier: number;
    isChecked?: boolean;
}


export interface IBusinessUnit {
    Id: number;
    OpenOfficeDocumentExtension: string;
    Name: string;
    UrlHost: string;
    Domain: string;
    CyberSourceMerchantId: string;
    CyberSourceTransactionKey: string;
    EmailBccAddress: string;
    BookingDeadlineOffsetExtension: number;
    PrivacyPolicyUrl: string;
    TermsOfServiceUrl: string;
    TermsAndConditionsUrl: string;
    LegalName: string;
    SiteName: string;
    DepartmentName: string;
    EmailReplyAddress: string;
    CustomerSupportEmail: string;
    HoursOfOperation: string;
    SsorHostName: string;
    SsorSignonServer: string;
    SsorMarketName: string;
    SsorProductCode: string;
    SsorBrandingSiteName: string;
    MarketName: string;
    SalespersonLastName: string;
    SalespersonCode: string;
    EmployeeId: string;
    EmplID: string;
    OmnitureSiteName: string;
    GoogleAnalyticsAccountName: string;
    Code: string;
    ParentCode: string;
    CommunityCode: string;
    HostName: string;
    TimeZone: string;
    Phone: string
}

export interface IField {
    ID: number;
    Class: string;
    InDesignTagName: string;
    NumOfColumn: string;
    Name: string;
    Description: string;
    Value: string;
    ValidationTypeName: string;
    IsRequired: boolean;
    NotForMaterial: boolean;
    Regex: string;
    ElementType: string;
    IsImage: boolean;
    Options: any[];
    Fields?: IField[];
    Grp?: string;
    IsHtmlEditorRequired: boolean;
    MetaDataOnly: boolean;
    SampleText: string;
}

export interface IFieldGroup {
    Name: string;
    Fields: IField[];
}

export interface ITransformField {
    Prefix: string;
    Suffix: string;
    StartIndex: number;
    Length: number;
    InDesignTagName: string
}

export interface IInDesignTagName {
    InDesignTagName: string;
}

export interface IAutoResizeField {
    AffectedFields: IInDesignTagName[];
    InDesignTagName: string;
}

export interface ICustomizedTextStyling {
    InDesignTagName: string;
    RegexPattern: string;
    CharStyleName: string;
    TargetFrames: IInDesignTagName[]
}

export interface IRule {
    TransformFields: ITransformField[];
    AutoResizeFields: IAutoResizeField[];
    AutoHorizontalScaleFields: IInDesignTagName[];
    CustomizedTextStylings: ICustomizedTextStyling[];
    OutputTags: IInDesignTagName;
}

export interface IAdTemplate {
    Code: string;
    Name: string;
    IsActive: boolean;
    PositionId: number;
    CustomerNumber: string;
    TemplateType: number;
    ChargeTypes: INameId[];
    Version: number;
    MinLines: number;
    MaxLines: number;
    HeightOffset: number;
    IsAgencyOnly: boolean;
    SharedDataFieldGroup: IFieldGroup;
    DataFieldGroups: IFieldGroup[];
    Rules: IRule;
    DisplayOrder: number;
    HasFieldAllowStyling: boolean;
    showLines: boolean;
    WidthInInches: number;
    WidthInColumns: number;
    HeightInInches: number;
    WidthInPixels: number;
    HeightInPixels: number;
    HeightInPixelsOriginal: number;
    any:any;
}

export interface IAdSize {
    Id: number;
    Name: string;
    DfpAdSizeName: string;
    IsDfpAdSize: boolean;
    AdItName: string;
    AdTypeId: number;
    AdTypeName: string;
    WidthUnitOfMeasureID: number;
    IsActive: boolean;
    IsVendorOnly: boolean;
    SquareInches: number;
    AdTemplates: IAdTemplate[];
    DisplayName: string;
    DisplayOrder: number;
    IsForSelfService: boolean;
    WidthInInches: number;
    WidthInColumns: number;
    HeightInInches: number;
    WidthInPixels: number;
    HeightInPixels: number;
    HeightInPixelsOriginal: number;
}

export interface IOption {
    Value: string;
    IsCropped: boolean;
    Id: number;
    Attributes: [
        {}
    ]
    HasChildAttributes?: boolean;
}

export interface IAttribute {
    Options: IOption[];
    Sorted: boolean;
    Id: number;
    Name: string;
    DisplayName: string;
    Type: INameId;
    Description: string;
    HeaderName: string;
    DisplayOrder: number;
    IsOnlineClassifiedAttribute: boolean;
    IsForVerification: boolean;
    IsForMaterial: boolean;
    IsRequired: boolean;
    MinValue: string;
    MaxValue: string;
    MinLength: number;
    SortDescending: boolean;
    DefaultValue: string;
    MaxLength: number;
    IsExternal: boolean;
    ChargeTypeId: number;
    ImageHeight: number;
    ImageWidth: number;
    SubGroup: string;
    IsImageListType: boolean;
    IsBooleanType: boolean;
}

export interface IClassCodeGroup {
    Id: number;
    ClassCodes: IValDesc[];
    OrderAttributes: IAttribute[];
    AttributeDisplayGroups: IAttributeDisplayGroup[];
    ClassCodeHeaderName: string;
}

export interface IPosition {
    Id: number;
    Name: string;
    ColorType: {};
    AdTypeId: number;
    IsDesignAdOnly: boolean;
    IsColorOnly: boolean;
    IsBWOnly: boolean;
    IsDealsOnTap: boolean;
    IsLATCNObit: boolean;
    DaysOfWeekAvailable: number[];
    Headers: INameId[];
    HasHeaders: boolean;
    HasAdSizes: boolean;
    AdSizes: IAdSize[];
    PubDates: Date[];
    HasPubDates: boolean;
    ClassCodeGroup: IClassCodeGroup;
}

export interface IOnlineImpressionOption {
    SectionId: number;
    Id: number;
    TargetType: string;
    IsVendor: boolean;
    NumDays: number;
    NumImpressions: number;
    Text: string;
    Name: string
}

export interface IOnlineDisplayTarget {
    Id: number;
    Name: string;
    PriceModifier: number
}

export interface ISubsection {
    Id: number;
    Name: string;
    DfpSubsectionName: string;
    Active: boolean;
    Online: boolean;
    SectionID: number;
    SelfServiceName: string;
    SubSectionDescription: string
}

export interface ISection {
    Id: number;
    Name: string;
    ColorType: {};
    AdItName: string;
    Description: string;
    Fonts: string[];
    Product: IProductItem;
    BasePrice: number;
    GutterWidth: number;
    ColumnWidth: number;
    LinesPerInch: number;
    DfpSectionName: string;
    InventoryBufferPercentage: number;
    IsDfpSection: boolean;
    Positions: IPosition[];
    Zones: INameId[];
    OnlineImpressionOptions: IOnlineImpressionOption[];
    OnlineDisplayTargets: IOnlineDisplayTarget[];
    HasTargets: boolean;
    HasFonts: boolean;
    FullRunZone: INameId;
    Subsections: ISubsection[];
    AdSizes: IAdSize[];
    AvailableDates: Date[];
    ClassCodeGroup: IClassCodeGroup;
    IsDesignAdOnly: boolean;
    IsAdMaterialRequired: boolean;
    IsBWOnly: boolean;
    IsColorOnly: boolean;
    IsPrintObit: boolean;
    IsOnlineObit: boolean;
    IsOnlinePrint: boolean;
    OnlineDuration: number;
    UsePrintStartDate: boolean;
    HideZoneMapIfOneZone: boolean;
    IsSubscriptionSection: boolean;
}

export interface IProductItem {
    Id: number;
    Name: string;
    AdItName: string;
    Description: string;
    Type: INameId;
    BusinessUnit: IBusinessUnit;
    DaysOfWeekAvailable: number[];
    Sections: ISection[];
    MerlinOneName: string;
    UseWebID: boolean;
    IsPrintClassifieds: boolean
}

export interface IPackageProduct {
    PackageId: number;
    IsPrimary: boolean;
    UsePrimaryDates: boolean;
    BusinessUnitId: number;
    ProductId: number;
    SectionId: number;
    Section: ISection;
    PositionId: number;
    Position: IPosition;
    NumOfInsertions: number;
    ProductTypeId: number;
    AdTypeId: number;
    ClassCodeGroupId: number;
    HasLinkedTemplate: boolean;
    IsAdditionalForADSS: boolean;
    IsByDefaultOptIn: boolean;
    AdditionalProductInfo: string;
    ClassCodeGroup: IClassCodeGroup;
    LinkedTemplates: {}
}

export interface IOptOutReason
{
    Id:number;
    Name:string;
}
export interface IPackage {
    Code: string;
    PackageId: number;
    MaximumNumOfRunDates: number;
    SubcategoryId: number;
    SubCategoryDescription: string;
    Name: string;
    Description: string;
    IsLegal: boolean;
    Products: IPackageProduct[];
    UseWebId: boolean;
    LinkedTemplates: {};
    HasPrimaryProduct: boolean;
    PrimaryProduct: IPackageProduct;
    NonePrimaryProducts: IPackageProduct[];
}

export interface ICharge {
    TypeId: number;
    Value: number;
    TypeName: string;
    IsCommissionable: boolean;
    ValueBeforeDiscount?: number
}

export interface IPrice {
    NetPrice: number;
    BasePriceUnit: number;
    CalculateAsCPI: boolean;
    Charges: ICharge[];
    RoundToDollar: boolean
}

export interface IPricingDetail {
    Date: Date;
    ProgramId: number;
    CouponCode: string;
    BasePrice: IPrice;
    CouponPrice: IPrice;
    Prices: IPrice[];
    VolumeDiscountId: number;
}

export interface INewPricingDetail {
    Date: Date;
    ProgramId: number;
    CouponCode: string;
    Price: number;
    PriceBeforeDiscount: number;
    Charges: ICharge[];
    VolumeDiscountId: number;
}

export interface IOrderItemPriceDetail {
    TotalAmount: number;
    TotalAmountBeforeDiscount: number;
    ErrorMessage: string;
    OrderLinePriceDetails: INewPricingDetail[];
}

export interface IAdTemplateDataValue {
    DataFieldId: number;
    IsDefaultImage: boolean;
    Value: string;
    Name: string
}

export interface IFile {
    NumBytes: number;
    Name: string;
    Extension: string;
}

export interface IAdMaterial {
    Id: number;
    ExternalId: number;
    SystemName: string;
    SystemKey: number;
    SectionId: number;
    PositionId: number;
    Height: number;
    AdTemplate: IAdTemplate;
    AdTemplateCode: string;
    UploadedFile: IFile;
    AdTemplateDataValues: IAdTemplateDataValue[];
    CreateDate: Date;
    UpdateDate: Date;
    SubmitDate: Date;
    IsCroppingRequired: boolean;
    OrderId: number;
    OrderItemId: number;
    DayOfWeek: any;
    PublishedAdMaterial: IPublishedAdMaterial[];
    IsEdited: boolean;
    PubDatesCsv: string;
    HeightInPixels: number;
    AdMaterialUrl: string;
    PreviewFullUrl: string;
    RunDates: string[];
    RunDateString: string,
    NumImpressions: number[];
    ImpressionsName: string
}

export interface IPublishedAdMaterial {
    Id: number;
    AdMaterialId: number;
    OrderId: number;
    OrderItemId: number;
    SystemKey: number;
    SystemName: string;
    PubDate: Date;
    CreateDate: Date;
}

export interface ILocation {
    Active: boolean;
    Name: string;
    LocationId: number;
    ParentLocationId: number;
    CanonicalName: string;
    CountryCode: string;
    TargetType: string;
}

export interface IVolumeDiscount {
    Id: number;
    TargetDays: number;
    RangeDays: number;
    DiscountPercent: number;
    Description: string;
    IsApplied?: boolean;
    any:any
}

export interface IOrderItem {
    Id: number;
    Rules: INameId[];
    TypeId: number;
    IsKilledOrRejected: boolean;
    HasLinkedTemplate: boolean;
    IsAdMaterialRequired: boolean;
    Description: string;
    TypeDescription: string;
    Section: ISection;
    Subsection: ISubsection;
    SectionId: number;
    SubsectionId: number;
    DfpGeoTargetting: string;
    IsDfpOrderItem: boolean;
    DfpGeoTargettingStates: string;
    DFPLocations: ILocation[];
    DfpGeoTargettingCities: string;
    ProgramId: number;
    ClassCodeGroup: IClassCodeGroup;
    ClassCodeGroupId: number;
    ClassCodeValue: string;
    ContractId: number;
    SectionAndPositionName: string;
    AdSize: IAdSize;
    AdSizeId: number;
    IsOnlineProductStartDateModifiedByUser: boolean;
    AdMaterial: IAdMaterial[];
    AllSubmittedAdMaterial: IAdMaterial[];
    UnSubmittedAdMaterial: IAdMaterial[];
    LastSubmittedAdMaterial: IAdMaterial[];
    AllToBePublishedAdMaterial: IAdMaterial[];
    FirstOfOriginallySubmittedAdMaterial: IAdMaterial;
    FirstOfCurrentAdMaterial: IAdMaterial;
    FirstOfSubmittedPublishedAdMaterial: IAdMaterial;
    FirstOfLastSubmittedAdMaterial: IAdMaterial;
    FirstOfUnsubmittedAdMaterial: IAdMaterial;
    PublishedAdMaterial: IAdMaterial[];
    IsSingleAdMaterial: boolean;
    HasAdMaterial: boolean;
    IsDesignAdOnly: boolean;
    IsDailyAds: boolean;
    IsObit: boolean;
    IsEditableMidRun: boolean;
    Price: number;
    PriceBeforeDiscount: number;
    VolumeDiscounts: IVolumeDiscount[];
    UpsellAttributes: IAttribute[];
    PriceDetails: IPricingDetail[];
    NewPricingDetails: INewPricingDetail[];
    OrderItemPriceDetail: IOrderItemPriceDetail;
    CreateDate: Date;
    UpdateDate: Date;
    IsOrderItemComplete: boolean;
    IsColor: boolean;
    ClassCodes: IValDesc[];
    Quantity: number;
    HasUploadedAd: boolean;
    HasDesignedAd: boolean;
    HasAdMaterialDefined: boolean;
    FirstRunDate: IRunDate;
    LastRunDate: IRunDate;
    NumberOfLinesOfCurrentAdMaterial: number;
    PositionId: number;
    Position: IPosition;
    PositionHeaderId: number;
    Order: {
    };
    OrderRuleProductId: number;
    HasTemplateChanged: boolean;
    DatesLabel: string;
    RunDates: Date[];
    RunDateString: string;
    NumImpressions: number;
    ImpressionsName: string;
    AdMaterialUrl: string;
    previewFullUrl: string;
    isShowAdmaterialPreview: boolean;
    PubDates: any[];
    Zones: IZone[];
    ZoneIds: number[];
    UsePrimaryDate: boolean;
    NumDays: number;
    HasTargets: boolean;
    TargetIds: number[];
    Targets: IGeoTarget[];
    TargetTypeId: number;
    TargetType: any;
    IsHidePriceOrderRule: boolean;
    IsOrderItemConfigurable: boolean;
    IsHideZoneSection: boolean;
    NumTargetOptions: number;
    StartDate: Date;
    DFPCostModel: string;
    AvailableUnits: number;
    showLines?: boolean;
    ClickThroughUrl: string;
    IsValidClickThroughUrl: boolean;
    EndDate: Date;
    LstLegalDocs: ILegalDoc[];
    NumOfInsertions: number;
    isLayoutCompleted?: boolean;
    isOtherInfoCompleted?: boolean;
    isScheduleCompleted?: boolean;
    IsProjectNameVisible: boolean;
    inCompleteTabNames?: string;
    wibbitzDraftId?: string;
    IsWibbitzProduct?: boolean;
    WibbitzVideoFileShareLink?: string | null;
    VideoDraftId?: string | null;
    VideoProductId?: number | null;
    VideoBU?: string | null;
    VideoJson?: string | null;
    WibbitzVideoLink?: string | null;
    YoutubeLink?: string | null;
    WibbitzErrorMessage?: string | null;
    IsYoutubePublic?: boolean;
    IsVideoProcessingFailed: boolean;
    IsVisibleOnGallery: boolean;
}

export interface ILegalDoc {
    DocumentId: number;
    OrderId: number;
    OrderItemId: number;
    DocumentName: string;
    DocumentPath: string;
    IsActive: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    ModifiedBy: string;
    ModifiedDate: Date;
}

export interface IRunDate {
    BookingDay: any;
    ZoneDeadlineDate: Date;
    Date: Date;
    Deadline: Date;
}

export interface IBusinessType {
    CategoryId: number;
    CategoryCode: string;
    SubCategoryId: number;
    SubCategoryCode: string;
    SubCategoryName: string;
    IsActive: boolean;
}

export interface IUser {
    _commissionPercent: number;
    SsorId: string;
    AdItCustomerNumber: string;
    AdItCustomerId: number;
    CustomerTypeId: number;
    FirstName: string;
    LastName: string;
    Username: string;
    Name?: string;
    SsorEmail: string;
    AditEmail: string;
    BusinessName: string;
    BusinessType: IBusinessType;
    AccountType: INameId;
    Address: IAddress;
    Phone: {
        Number: string
    };
    CreditCards: ICreditCard[];
    IsIsoAuthentication: boolean;
    CreateDate: Date;
    UpdateDate: Date;
    TermsAccepted: Date;
    CreatedBy: number;
    UpdatedBy: number;
    CustomerType: string;
    CreditStatus: string;
    RiskCode: string;
    IsLocAllowed: boolean;
    MarketingOptOut: boolean;
    IsAdmin: boolean;
    IsVendor: boolean;
    IsSelfServiceCommissionable: boolean
}

export interface IAttributeDisplayGroup {
    DisplayName: string;
    Name: string;
    Attributes: IAttribute[];
    Description: string;
}

export interface IProduct {
    Id: number;
    SectionId: number;
    PositionId: number;
}

export interface IRulesGroup {
    Id: number;
    Products: IProduct[];
    Rules: IId[];
    OrderRuleProductKeys: string[];
}

export interface IOrder {
    Id: number;
    AditId: number;
    AdSSId: number;
    SubmitDate: Date;
    Product: IProductItem;
    IsProductConfigured: boolean;
    IsProcessedInAdit: boolean;
    IsExpiredInAdit: boolean;
    IsRecurringInAdit: boolean;
    OrderNotes: string;
    UpdatedDiscountedAmount: number;
    Description: string;
    PackageCode: string;
    Package: IPackage;
    DFPProposalNumber: string;
    DFPProposalName: string;
    IsPackageOrder: boolean;
    IsPackageOrderWithDisplay: boolean;
    PrimaryOrderItem: IOrderItem;
    Status: INameId;
    IsModifiedBeyondSupport: boolean;
    IsRenewable: boolean;
    HasInactiveEntities: boolean;
    OrderItems: IOrderItem[];
    FirstNonOnlineClassifiedOrderItem: IOrderItem;
    User: IUser;
    UserId: string;
    UserSessionId: string;
    IsDraft: boolean;
    IsQueued: boolean;
    IsSuccessfullySubmitted: boolean;
    IsPackageOrderWithAptsDotCom: boolean;
    PriceRecalculationOnMaterialChanged: boolean;
    Price: number;
    PriceBeforeDiscount: number;
    OldPrice: number;
    BUCode: string;
    CouponCode: string;
    ApprovedPOPPath: string;
    CreateDate: Date;
    UpdateDate: Date;
    IsVendor: boolean;
    UseWebId: boolean;
    WebId: string;
    IsMultiProductOrder: boolean;
    DFPCurrentWebsite: string;
    DFPNotificationEmails: string;
    IsCreatedInAdSS: boolean;
    IsSubmitting: boolean;
    IsPrintProof: boolean;
    IsPaidByLoc: boolean;
    PrintOrFirstOrderItem: IOrderItem;
    AttributeDisplayGroups: IAttributeDisplayGroup[];
    AttributeValues: {};
    HasAttributes: boolean;
    IsObitOrder: boolean;
    HasNonConfigurableItems: boolean;
    DfpCampaignName: string;
    RulesGroup: IRulesGroup;
    ServiceType: string;
    HasMultipleConfigurableItems: boolean;
    FirstRunDate: Date;
    IsAdItInReadOnlyMode: boolean;
    LastUpdated?: Date;
    isOtherInfoVisible?: boolean;
    ShowCustomerProof: boolean;
    AllowOrderRenewal: boolean;
    AllowOrderCancellation: boolean;
    IsDocumentUpload: boolean;
    IsDocumentUploadRequired: boolean;
    IsVideoEditDeadLinePassed?: boolean;
    IsScheduleRunDatesWeekly?:boolean;
    UploadDocumentHeading: string;
    UpgradeListingHeading: string;
    HighlightAdHeading: string;
    HasRemovableLine: boolean;
    HasSubscriptionLine: boolean;
    IsSubscriptionOpted: boolean;
    RemovableLines: IPackageProduct[];
    IsOptOutReasonRequired:boolean;
    OptOutReasonList:IOptOutReason[];
    any:any;
}

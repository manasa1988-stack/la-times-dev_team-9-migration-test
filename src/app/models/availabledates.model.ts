import { IZone, IGeoTarget } from "./order-item.model";

export interface IDeadlineMessage{
    deadlineDate: Date;
    dispPubDate: Date;
    isError: boolean;
    isWarning: boolean;
}

export interface IAvailableDayOfWeek{
    key: number;
    value: number[];
}

export interface IZoneMap{
    ZoneId: number;
    ZoneOverlayUrl: string;
    isSelected?: boolean;
}


export interface IAvailableDates {
    AvailableDatesForFullRun: any[];
    FirstAvailableDate: Date;
    LastAvailableDate: Date;
    ZoneAvailableDaysOfWeek: number[];
    AllZonesAvailableDaysOfWeek: IAvailableDayOfWeek;
    AvailableZones: IZone[];
    PubDatesCsv: string;
    DisplayTimeZone: string;
    PageLoadTime: Date;
    IsOnlineDisplayProduct: boolean;
    IsHideZoneSection: boolean;
    NumTargetOptions:number;
    GeoMapImageUrl: string;
    ZoneMapLargeImageUrl: string;
    ZoneMapImageUrl: string;
    OnlineDisplayTarget: IGeoTarget[];
    ZoneFullRun: IZone;
    AvailableZoneMaps: IZoneMap[];
    IsDefaultLayout: boolean;
    any:any;
}

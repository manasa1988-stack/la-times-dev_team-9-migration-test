import { IOrderItem, ISubsection } from "./order-item.model";

export interface IConfigureDFPData {
    SectionName: string;
    SectionID: number;
    DFPStates: IDFPLocation[];
    AdssSections: IAdssSection[];
    Subsections: ISubsection[];
    CurrentDFPLocations: string;
    DfpOrderItems: IOrderItem[];
}

export interface IAdssSection {
    ID: number;
    Name: string;
    DFPSectionName: string;
    AdSizeID: number;
}

export interface IInventoryData
{
    NumImpressions: number,
    DFPCostModel: string,
    AvailableUnits: number, 
    Price: string,
    DFPMsg: string
}

export interface IDFPLocation{
    ID: number;
    Name: string;
    Type: string;
    IsIncluded: boolean;
    ParentLocation?: string;
}

export interface ITargetData
{
    tid:number,
    titem:string,
    type:string
}

export interface IAddress{
    Address1: string;
    Address2: string;
    City: string;
    State: string;
    Zip: number;
}

export interface IGooglePlaceSearchResponse {
    description: string;
    place_id: string;
    any:any;
}

export interface IGooglePlaceDetailResponse {
    StreetNumber: string;
    StreetName: string;
    City: string;
    State: string;
    PostalCode: number;
    StateTerritory: string;
    any:any;
}
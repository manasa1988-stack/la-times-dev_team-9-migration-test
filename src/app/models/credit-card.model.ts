import { IAddress } from './address.modal';

export interface ICreditCard{
    Id: number;
    FirstName: string;
    LastName: string;
    Address: IAddress; 
    Number: string;
    SecurityCode:string
    ExpirationMonth: string;
    ExpirationYear : string;
    IsPrimary: boolean;
    Type: number;
    TypeName: string;
  }
export interface IIdTypeName {
    ID: number;
    Name: string;
    Type: string;
    IsIncluded: boolean;
    IsChecked?: boolean; 
    any:any;
}

export interface IIdStyleName {
    Id: number;
    StyleName: string;
    IsActive: boolean;
    IsChecked?: boolean;
    any:any
}

export interface IBUStyleMap {
    EditorStyleId: number;
    PackagesIDS: string;
}
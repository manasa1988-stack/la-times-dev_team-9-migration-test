export interface ServerResponse {
    IsSuccess: boolean;
    ValidationMessage: any[];
    ErrorMessage:  any[];
    WarningMessage:  any[];
    Result?: any;
    ResponseMessage?: any;
  }
  
  
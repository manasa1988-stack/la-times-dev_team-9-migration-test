export const months = [
  { "monthNumber": 1, "monthName": "January" },
  { "monthNumber": 2, "monthName": "February" },
  { "monthNumber": 3, "monthName": "March" },
  { "monthNumber": 4, "monthName": "April" },
  { "monthNumber": 5, "monthName": "May" },
  { "monthNumber": 6, "monthName": "June" },
  { "monthNumber": 7, "monthName": "July" },
  { "monthNumber": 8, "monthName": "August" },
  { "monthNumber": 9, "monthName": "September" },
  { "monthNumber": 10, "monthName": "October" },
  { "monthNumber": 11, "monthName": "November" },
  { "monthNumber": 12, "monthName": "December" }
];

export const filterByDate = [
  { value: 0, keyword: 'LAST SAVED' },
  { value: 1, keyword: 'RUN DATE' }
];

export const MaximumPhotosAllowed = 25;
export const MaximumFileSizeAllowed = 10485760; // equal to 10MB.

export const orderStatus = [
  { key: 0, value: 'All' },
  { key: 4, value: 'Error' },
  { key: 6, value: 'Processing' },
  { key: 7, value: 'Expired' },
  { key: 3, value: 'Cancelled' },
  { key: 2, value: 'Running' },
  { key: 5, value: 'Rejected' }
];

export enum OrderStatuses {
  Draft = 1,
  Submitted = 2,
  Cancelled = 3,
  Error = 4,
  Rejected = 5,
  Queued = 6,
  Expired = 7
}

export enum FieldType {
  'Number' = 1,
  'Text' = 2,
  'TextArea' = 3,
  'Image' = 4,
  'Select' = 5,
  'Date' = 6,
  'Email' = 7,
  'Checkbox' = 8,
  'ImageList' = 9,
  'ChildAttribute'= 10,
  'TermsUrl' = 11,
  'TermsAndCondition' = 12
}

export enum cardType {
  'Visa' = 1,
  'Master card' = 2,
  'American express' = 3,
  'Discover' = 4
}

export enum OrderItemType {
  'PrintDisplayOrderItem' = 1,
  'OnlineDisplayOrderItem' = 3,
  'PrintClassifiedsOrderItem' = 4,
  'AlternativeId' = 7,
  'AlternativePrintId' = 11,
  'OnlineClassifiedsOrderItem' = 1000,
  'OnlinePrintOrderItem' = 1001,
}

export enum DesignAdFieldType {
  'TextDataField' = 'TextDataField',
  'Emblem' = 'Emblem',
  'SingleLineDataField' = 'SingleLineDataField',
  'MultiLineDataField' = 'MultiLineDataField',
  'CustomImage' = 'CustomImage',
  'TagLine' = 'TagLine',
  'DropDownList' = 'DropDownList',
  'WebId' = 'WebId',
  'NumberField' = 'NumberField',
  'DateField' = 'DateField',
  'TimeField' = 'TimeField',
  'UrlField' = 'UrlField',
  'PhoneField' = 'PhoneField',
  'EmailField' = 'EmailField',
  'CheckBoxField' = 'CheckBoxField',
  'TableField' = 'TableField',
  'HiddenField' = 'HiddenField',
  'TemplateSection' = 'TemplateSection'
}

export const orderQueueTimeZones = [
  { key: "PDT", value: 'Pacific Standard Time', offset: -8 },
  { key: "CDT", value: 'Central Standard Time', offset: -6 },
  { key: "EDT", value: 'Eastern Standard Time', offset: -5 }
];

export const FIRST_NAME_MAX_LENGTH = 30;
export const LAST_NAME_MAX_LENGTH = 40;
export const USERNAME_MIN_LENGTH = 6;
export const USERNAME_MAX_LENGTH = 40;
export const PHONE_NUMBER_MAX_LENGTH = 10;
export const CITY_MAX_LENGTH = 40;
export const EDIT_ACCOUNT_ADDRESS1_MAX_LENGTH = 40;
export const CARD_ADDRESS1_MAX_LENGTH = 200;
export const ZIP_CODE_MAX_LENGTH = 5;
export const CARD_CODE_MAX_LENGTH = 4;
export const CARD_NUMBER_MAX_LENGTH = 25;

//Design Ad Validation Length : Start
export const TITLE_MAX_LENGTH = 10;
export const ADTEXT_MAX_LENGTH = 80;
export const BODYCOPY_MAX_LENGTH = 80;
export const BODYCOPY_2_MAX_LENGTH = 80;
export const COMPANYNAME_MAX_LENGTH = 30;
export const ADDRESS_MAX_LENGTH = 80;
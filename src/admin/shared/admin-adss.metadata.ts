
export const orderStatus = [
  { key: 0, value: 'All' },
  { key: 4, value: 'Error' },
  { key: 6, value: 'Processing' },
  { key: 7, value: 'Expired' },
  { key: 3, value: 'Cancelled' },
  { key: 2, value: 'Running' }
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
  'ChildAttribute'= 10
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

export const orderQueueTimeZones = [
  { key: "PDT", value: 'Pacific Standard Time', offset: -8 },
  { key: "CDT", value: 'Central Standard Time', offset: -6 },
  { key: "EDT", value: 'Eastern Standard Time', offset: -5 }
];

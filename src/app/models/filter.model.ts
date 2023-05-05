export interface IFilter {
  pageSize: number;
  pageNumber: number;
  dateFilter: number;
  from: string;
  to: string;
  status?: string;
  orderId?: string;
}

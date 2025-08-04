export type IFilterType =
  | "weekly"
  | "daily"
  | "monthly"
  | "yearly"
  | "all"
  | "custom";

export interface IGraphData {
  label: string;
  value: number;
}

export interface IRevenueGraph {
  daily: IGraphData[];
  monthly: IGraphData[];
  yearly: IGraphData[];
}

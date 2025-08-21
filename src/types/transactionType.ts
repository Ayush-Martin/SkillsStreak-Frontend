export type ITransactionStatus =
  | "pending"
  | "completed"
  | "canceled"
  | "failed"
  | "on_process";

export type ITransactionType =
  | "course_purchase"
  | "commission"
  | "subscription"
  | "wallet_redeem";

export interface ITransaction {
  _id: string;
  payer?: {
    _id: string;
    email: string;
    role: string;
  };
  receiver?: {
    _id: string;
    email: string;
    role: string;
  };
  course?: {
    _id: string;
    title: string;
    thumbnail: string;
  };
  subscription?: {
    _id: string;
    title: string;
  };
  amount: number;
  method: "stripe" | "wallet";
  type: ITransactionType;
  status: ITransactionStatus;
  adminCommission?: number;
  createdAt: string;
}

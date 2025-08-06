export interface ISubscriptionPlans {
  _id: string;
  title: string;
  description?: string;
  price: number;
  duration: number;
}

export interface ISubscriptionPlanTitles {
  _id: string;
  title: string;
}

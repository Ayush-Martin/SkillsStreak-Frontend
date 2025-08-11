export interface ISubscriptionPlans {
  _id: string;
  title: string;
  description?: string;
  price: number;
  duration: number;
  features: ISubscriptionFeature[];
}

export interface ISubscriptionPlanTitles {
  _id: string;
  title: string;
}

export interface ISubscriptionFeature {
  _id: string;
  id: string;
  title: string;
}

export type ISubscriptionFeatureId = "trainer_chat" | "live_session";

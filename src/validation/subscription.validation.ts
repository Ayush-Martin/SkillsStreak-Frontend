import { z } from "zod";

export const SubscriptionPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  duration: z.number().min(1),
});

export type ISubscriptionPlanSchema = z.infer<typeof SubscriptionPlanSchema>;

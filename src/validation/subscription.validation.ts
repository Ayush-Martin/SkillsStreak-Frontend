import { SubscriptionPlanValidationRule } from "@/utils/validationRule";
import { z } from "zod";

export const SubscriptionPlanSchema = z.object({
  title: SubscriptionPlanValidationRule.title,
  description: SubscriptionPlanValidationRule.description,
  price: SubscriptionPlanValidationRule.price,
  duration: SubscriptionPlanValidationRule.duration,
  features: SubscriptionPlanValidationRule.features,
});

export type SubscriptionPlanSchemaType = z.infer<typeof SubscriptionPlanSchema>;

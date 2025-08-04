import { CategoryNameValidationRule } from "@/utils/validationRules";
import { z } from "zod";

export const AdminCategorySchema = z.object({
  categoryName: CategoryNameValidationRule,
});

export type IAdminCategorySchema = z.infer<typeof AdminCategorySchema>;

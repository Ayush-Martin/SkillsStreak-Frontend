import { PasswordValidationRule } from "@/utils/validationRules";
import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: PasswordValidationRule,
    newPassword: PasswordValidationRule,
    confirmNewPassword: z.string(),
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword == confirmNewPassword,
    {
      message: "Password does not match",
      path: ["confirmNewPassword"],
    }
  );

export type IChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;

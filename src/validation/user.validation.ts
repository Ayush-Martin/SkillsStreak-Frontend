import { UserValidationRule } from "@/utils/validationRule";
import { z } from "zod";

export const LoginSchema = z.object({
  email: UserValidationRule.Email,
  password: UserValidationRule.Password,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: UserValidationRule.Email,
  password: UserValidationRule.Password,
  username: UserValidationRule.Username,
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const ForgetPasswordSchema = z.object({
  email: UserValidationRule.Email,
});

export type ForgetPasswordSchemaType = z.infer<typeof ForgetPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    password: UserValidationRule.Password,
    confirmPassword: UserValidationRule.Password,
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: UserValidationRule.Password,
    newPassword: UserValidationRule.Password,
    confirmNewPassword: UserValidationRule.Password,
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword == confirmNewPassword,
    {
      message: "Password does not match",
      path: ["confirmNewPassword"],
    }
  );

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;

export const UserProfileSchema = z.object({
  username: UserValidationRule.Username,
  bio: UserValidationRule.Bio,
  location: UserValidationRule.Location,
  company: UserValidationRule.Company,
  position: UserValidationRule.Position,
  education: UserValidationRule.Education,
  socialLinks: UserValidationRule.SocialLinks,
  experiences: UserValidationRule.Experiences,
  skills: UserValidationRule.Skills,
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;

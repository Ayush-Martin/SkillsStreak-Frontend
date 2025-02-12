import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "password i s required"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

import { Input } from "@/components/ui/input";
import AuthLayout from "@/layouts/AuthLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ErrorText } from "@/components";
import { Button } from "@/components/ui/button";
import { ForgetPasswordApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { EmailValidationRule } from "@/utils/validationRules";

const ForgetPasswordSchema = z.object({
  email: EmailValidationRule,
});

type ForgetPasswordSchemaType = z.infer<typeof ForgetPasswordSchema>;

const ForgetPassword = () => {
  const {
    register,
    formState: { isSubmitting, errors, isValid },
    trigger,
    handleSubmit,
  } = useForm<ForgetPasswordSchemaType>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ForgetPasswordSchema),
  });

  const navigate = useNavigate();

  const submit = async (data: ForgetPasswordSchemaType) => {
    const res = await ForgetPasswordApi(data);
    if (!res) return;
    navigate("/auth/verifyOTP", {
      state: {
        forAction: "resetPassword",
        email: data.email,
      },
    });
  };

  return (
    <AuthLayout>
      <div className=" w-[300px] py-5  text-center flex flex-col gap-5">
        <h1 className="text-3xl text-app-neutral">Forget Password</h1>
        <p className=" text-app-neutral">Enter your email to send OTP</p>

        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(submit)}
        >
          <div>
            <Input
              placeholder="Email"
              className="bg-app-highlight"
              {...register("email")}
              onBlur={() => trigger("email")}
            />

            {errors.email && <ErrorText error={errors.email.message!} />}
          </div>

          <Button variant={"v1"} disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Sending OTP ..." : "Send OTP"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;

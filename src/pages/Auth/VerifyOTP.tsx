import AuthLayout from "@/layouts/AuthLayout";
import { useLocation, useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CompleteRegisterApi, VerifyOTPApi } from "@/api/authApi";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const { forAction, email }: { forAction: string; email: string } =
    location.state || {};

  useEffect(() => {
    if (!forAction || !email) {
      navigate("/");
    }
  }, [email, forAction, navigate]);

  const submit = async () => {
    if (forAction == "register") {
      const success = await CompleteRegisterApi({ email, OTP: value });
      if (!success) return;
      navigate("/loginRegister");
    }
    else if (forAction == "resetPassword") {
      const success = await VerifyOTPApi({ email, OTP: value });
      if (!success) return;
      navigate("/resetPassword", {
        state: {
          email,
        },
      });
    }
  };

  return (
    <AuthLayout>
      <div className=" w-[570px] py-5  text-center flex flex-col gap-10">
        <h1 className="text-3xl text-app-neutral">Enter the OTP</h1>
        <p className="text-sm text-app-neutral">
          We've sent a 6-digit verification code to your email. Please enter the
          code below to continue.
        </p>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            onChange={(val) => setValue(val)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="" />
              <InputOTPSeparator />
              <InputOTPSlot index={1} />
              <InputOTPSeparator />
              <InputOTPSlot index={2} />
              <InputOTPSeparator />
              <InputOTPSlot index={3} />
              <InputOTPSeparator />
              <InputOTPSlot index={4} />
              <InputOTPSeparator />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="px-28">
          <Button
            variant={"v1"}
            size={"full"}
            onClick={submit}
            disabled={value.length < 6}
          >
            Verify OTP
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;

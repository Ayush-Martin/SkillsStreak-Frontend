import { useLocation, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useEffect, FC } from "react";

import AuthLayout from "@/layouts/AuthLayout";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Button,
} from "@/components/ui";
import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { REGISTER_API, VERIFY_OTP_API } from "@/constants/API";
import { successPopup } from "@/utils/popup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { logout } from "@/features/Auth/slice/userSlice";

const VerifyOTP: FC = () => {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(20);

  const { forAction, email }: { forAction: string; email: string } =
    location.state || {};

  useEffect(() => {
    dispatch(logout());
  }, []);

  useEffect(() => {
    if (!forAction || !email) {
      navigate("/");
    }
  }, [email, forAction, navigate]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup on re-run
  }, [timer]);

  const submit = async () => {
    const res = await axiosPostRequest(VERIFY_OTP_API, {
      email,
      OTP: value,
    });

    if (!res) return;

    if (forAction == "register") {
      const res = await axiosGetRequest(`${REGISTER_API}?email=${email}`);
      if (!res) return;
      successPopup(res.message || "user registered");
      navigate("/auth");
    } else {
      navigate("/auth/resetPassword", {
        state: {
          email,
        },
      });
    }
  };

  const resendOTP = async () => {
    const res = await axiosGetRequest(`${"/auth/resendOTP"}/${email}`);
    if (!res) return;
    successPopup(res.message || "OTP sent to your email");
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
        <div className="flex flex-col items-center gap-2 px-28">
          <Button
            variant={"v1"}
            size={"full"}
            onClick={submit}
            disabled={value.length < 6}
          >
            Verify OTP
          </Button>
          {timer ? (
            <p className="text-white">Resend OTP in {timer} seconds</p>
          ) : (
            <button onClick={resendOTP} className="underline text-app-neutral">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;

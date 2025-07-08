import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LoginImage } from "@/assets/images";
import { Login, Register } from "@/components";
import AuthLayout from "@/layouts/AuthLayout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { login } from "@/features/Auth/slice/userSlice";
import { axiosPostRequest } from "@/config/axios";
import { LOGIN_API, LOGIN_WITH_GOOGLE_API, REGISTER_API } from "@/constants";
import { successPopup } from "@/utils/popup";
import { LoginRegisterContext } from "@/context";

const LoginRegisterPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (email: string, password: string) => {
    const res = await axiosPostRequest(LOGIN_API, { email, password });
    if (!res) return;
    successPopup(res.message);
    dispatch(login(res.data));
    navigate(from, { replace: true });
    dispatch(login({ email, password }));
  };

  const handleGoogleLogin = async (token: string) => {
    const res = await axiosPostRequest(LOGIN_WITH_GOOGLE_API, { token });
    if (!res) return;
    dispatch(login(res.data));
    navigate(from, { replace: true });
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    const res = await axiosPostRequest(REGISTER_API, {
      username,
      email,
      password,
    });
    if (!res) return;
    successPopup(res.data || "OTP sent");
    navigate("/auth/verifyOTP", {
      state: {
        email,
        forAction: "register",
      },
    });
  };

  return (
    <AuthLayout>
      <div className="sm:bg-app-border w-full sm:w-[500px] lg:w-[1100px] h-[600px] flex ">
        <div className="hidden w-1/2 h-full lg:block">
          <img src={LoginImage} alt="" className="object-cover h-full" />
        </div>
        <div className="flex items-center justify-center w-full h-full lg:w-1/2">
          <div className="bg-app-primary w-[380px] py-2">
            <h1 className="py-4 text-3xl text-center text-app-secondary">
              {isLoginPage ? "Login" : "Register"}
            </h1>
            <div className="flex flex-col gap-4 px-10 py-4">
              <LoginRegisterContext.Provider
                value={{ handleLogin, handleGoogleLogin, handleRegister }}
              >
                {isLoginPage ? <Login /> : <Register />}
              </LoginRegisterContext.Provider>
              <div>
                <button
                  className="underline text-app-neutral text-start"
                  onClick={() => setIsLoginPage((p) => !p)}
                >
                  {isLoginPage
                    ? "Don’t have an account register"
                    : "Already have account login"}
                </button>
                <button
                  className="underline text-app-neutral text-start"
                  onClick={() => navigate("/auth/forgetPassword")}
                >
                  ForgetPassword
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginRegisterPage;

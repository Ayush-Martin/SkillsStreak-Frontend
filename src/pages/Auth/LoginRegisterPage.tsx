import { FC, useState } from "react";
import loginImage from "../../assets/images/login.jpg";
import { Login, Register } from "../../components";
import AuthLayout from "@/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";

const LoginRegisterPage: FC = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <div className="sm:bg-app-border w-full sm:w-[500px] lg:w-[1100px] h-[600px] flex ">
        <div className="hidden w-1/2 h-full lg:block">
          <img src={loginImage} alt="" className="object-cover h-full" />
        </div>
        <div className="flex items-center justify-center w-full h-full lg:w-1/2">
          <div className="bg-app-primary w-[380px] py-2">
            <h1 className="py-4 text-3xl text-center text-app-secondary">
              {isLoginPage ? "Login" : "Register"}
            </h1>
            <div className="flex flex-col gap-4 px-10 py-4">
              {isLoginPage ? <Login /> : <Register />}
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

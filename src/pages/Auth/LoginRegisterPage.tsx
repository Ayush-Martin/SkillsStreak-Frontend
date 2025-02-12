import { useState } from "react";
import loginImage from "../../assets/images/login.jpg";
import { Login, Register } from "../../components";

const LoginRegisterPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  return (
    <div className="bg-app-primary h-screen flex justify-center items-center rounded-sm">
      <div className="sm:bg-app-border w-full sm:w-[500px] lg:w-[1100px] h-[600px] flex ">
        <div className="w-1/2 h-full hidden lg:block">
          <img src={loginImage} alt="" className="object-cover h-full" />
        </div>
        <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
          <div className="bg-app-primary w-[380px] py-2">
            <h1 className="text-app-secondary text-center text-3xl py-4">
              {isLoginPage ? "Login" : "Register"}
            </h1>
            <div className="px-10 py-4 flex flex-col gap-4">
              {isLoginPage ? <Login /> : <Register />}
              <div>
                <button
                  className="text-app-neutral text-start underline"
                  onClick={() => setIsLoginPage((p) => !p)}
                >
                  {isLoginPage
                    ? "Don’t have an account register"
                    : "Already have account login"}
                </button>
                <button className="text-app-neutral text-start underline">
                  ForgetPassword
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;

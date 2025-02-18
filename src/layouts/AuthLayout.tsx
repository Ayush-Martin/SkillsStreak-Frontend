import { ReactNode } from "react";
import logo from "../assets/svg/logo.svg";

interface AuthLayout {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayout) => {
  return (
    <div className="relative flex items-center justify-center h-screen bg-app-primary">
      <div className="absolute top-0 flex justify-center w-full h-16 py-3 text-white ">
        <img src={logo} alt="" className="object-contain" />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;

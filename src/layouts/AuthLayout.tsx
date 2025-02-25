import { FC, ReactNode } from "react";
import logo from "../assets/images/logo.png";

interface IAuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<IAuthLayoutProps> = ({ children }) => {
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

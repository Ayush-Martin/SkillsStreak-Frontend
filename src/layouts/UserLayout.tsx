import { ReactNode } from "react";
import logo from "../assets/svg/logo.svg";

interface UserLayout {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayout) => {
  return (
    <div className="relative flex items-center justify-center rounded-sm min:h-screen bg-app-primary">
      <div className="absolute top-0 flex justify-center w-full h-16 py-3 text-white ">
        <img src={logo} alt="" className="object-contain" />
      </div>
      {children}
    </div>
  );
};

export default UserLayout;

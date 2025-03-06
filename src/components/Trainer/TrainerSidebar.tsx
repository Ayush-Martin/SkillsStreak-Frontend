import { NavLink } from "react-router-dom";
import SideBar from "../SideBar";
import {
  MdDashboard,
  MdHome,
  MdVideoLibrary,
} from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { FC } from "react";

const TrainerSidebar: FC = () => {
  return (
    <SideBar>
      <NavLink
        to={"/trainer"}
        end
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <MdDashboard />
        Dashboard
      </NavLink>
      <NavLink
        to={"/trainer/courses"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <MdVideoLibrary />
        My Courses
      </NavLink>
      <NavLink
        to={"/trainer/wallet"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <FaWallet />
        Wallet
      </NavLink>
      <NavLink to={"/"} className={"w-full  px-2 py-2 flex items-center gap-2"}>
        <MdHome />
        Home
      </NavLink>
    </SideBar>
  );
};

export default TrainerSidebar;

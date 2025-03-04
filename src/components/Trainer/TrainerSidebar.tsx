import { NavLink } from "react-router-dom";
import SideBar from "../SideBar";
import {
  MdDashboard,
  MdHome,
  MdPayments,
  MdVideoLibrary,
} from "react-icons/md";
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
        to={"/trainer/payments"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <MdPayments />
        Payments
      </NavLink>
      <NavLink to={"/"} className={"w-full  px-2 py-2 flex items-center gap-2"}>
        <MdHome />
        Home
      </NavLink>
    </SideBar>
  );
};

export default TrainerSidebar;

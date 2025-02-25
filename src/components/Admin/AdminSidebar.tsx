import SideBar from "../SideBar";
import { NavLink } from "react-router-dom";
import { MdPayments } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import { TbCategoryFilled } from "react-icons/tb";
import { IoChatbox } from "react-icons/io5";
import { FC } from "react";

const AdminSidebar: FC = () => {
  return (
    <SideBar>
      <NavLink
        to={"/admin"}
        end
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <MdDashboard />
        Dashboard
      </NavLink>
      <NavLink
        to={"/admin/users"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <FaUsers />
        Users
      </NavLink>
      <NavLink
        to={"/admin/trainers"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <FaChalkboardTeacher />
        Trainers
      </NavLink>
      <NavLink
        to={"/admin/trainerRequests"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <FaChalkboardTeacher />
        Trainer Requests
      </NavLink>
      <NavLink
        to={"/admin/courses"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <MdVideoLibrary />
        Courses
      </NavLink>
      <NavLink
        to={"/admin/bundles"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <FaBoxesStacked />
        Bundles
      </NavLink>
      <NavLink
        to={"/admin/categories"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <TbCategoryFilled />
        Categories
      </NavLink>
      <NavLink
        to={"/admin/payments"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <MdPayments />
        Payments
      </NavLink>
      <NavLink
        to={"/admin/doubts"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <IoChatbox />
        Doubts
      </NavLink>
    </SideBar>
  );
};

export default AdminSidebar;

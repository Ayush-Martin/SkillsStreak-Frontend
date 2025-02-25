import { NavLink } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { RiGraduationCapFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import SideBar from "../SideBar";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { FC } from "react";

const UserSidebar: FC = () => {
  const { role } = useSelector((state: RootReducer) => state.user);
  return (
    <SideBar>
      <NavLink
        to={"/user"}
        end
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <ImProfile />
        Profile
      </NavLink>
      <NavLink
        to={"/user/enrolledCourses"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <RiGraduationCapFill />
        Enrolled Courses
      </NavLink>
      <NavLink
        to={"/user/payments"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <MdPayments />
        Payments
      </NavLink>
      <NavLink
        to={role == "trainer" ? "/trainer" : "/user/trainerRequest"}
        className={"w-full  px-2 py-2 flex items-center gap-2"}
      >
        <FaChalkboardTeacher />
        Trainer Dashboard
      </NavLink>
    </SideBar>
  );
};

export default UserSidebar;

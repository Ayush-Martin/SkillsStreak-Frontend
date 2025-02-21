import { NavLink } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { RiGraduationCapFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import SideBar from "../SideBar";

const UserSidebar = () => {
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
    </SideBar>
  );
};

export default UserSidebar;

import { Link, NavLink } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { RiGraduationCapFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import { useState } from "react";
import { CgMenuGridO } from "react-icons/cg";

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className={`absolute top-0 left-0 md:hidden text-4xl rounded-md  text-black bg-opacity-30 bg-app-neutral backdrop-blur-sm ${
          isOpen && "hidden"
        }`}
        onClick={() => setIsOpen((p) => !p)}
      >
        <CgMenuGridO />
      </button>
      <div
        className={`absolute  z-10 flex-col w-64 h-full md:h-auto gap-4 px-6 py-4 text-lg text-white md:fixed bg-opacity-30 bg-app-primary backdrop-blur-sm md:block ${
          !isOpen && "hidden"
        }`}
      >
        <button
          className={` md:hidden  text-4xl text-white ${!isOpen && "hidden"}`}
          onClick={() => setIsOpen((p) => !p)}
        >
          <CgMenuGridO />
        </button>

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
      </div>
    </>
  );
};

export default UserSidebar;

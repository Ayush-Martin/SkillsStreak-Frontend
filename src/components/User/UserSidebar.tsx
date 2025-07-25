import { useSelector } from "react-redux";
import { FC } from "react";
import { NavLink } from "react-router-dom";

import {
  MdPayments,
  RiGraduationCapFill,
  FaChalkboardTeacher,
  MdDashboard,
  IoChatbox,
  FaUserTie,
} from "@/assets/icons";
import { SideBar } from "@/components";
import { RootReducer } from "@/store";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImVideoCamera } from "react-icons/im";

const UserSidebar: FC = () => {
  const { role } = useSelector((state: RootReducer) => state.user);

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard />,
      link: "/user",
      end: true,
    },
    {
      name: "Profile",
      icon: <FaUserTie />,
      link: "/user/profile",
      end: true,
    },
    {
      name: "Enrolled Courses",
      icon: <RiGraduationCapFill />,
      link: "/user/enrolledCourses",
    },
    {
      name: "Chats",
      icon: <IoChatbox />,
      link: "/user/chats",
    },
    {
      name: "Transactions",
      icon: <MdPayments />,
      link: "/user/transactions",
    },
    {
      name: "Change Password",
      icon: <RiLockPasswordFill />,
      link: "/user/changePassword",
    },
    {
      name: role == "trainer" ? "Trainer Dashboard" : "Become Trainer",
      icon: <FaChalkboardTeacher />,
      link: role == "trainer" ? "/trainer" : "/user/trainerRequest",
    },
  ];

  return (
    <SideBar>
      {sidebarItems.map((item) => (
        <NavLink
          to={item.link}
          key={item.name}
          end={item.end}
          className={
            "w-full  px-2 py-2 flex items-center gap-2 border rounded-lg border-app-border"
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </SideBar>
  );
};

export default UserSidebar;

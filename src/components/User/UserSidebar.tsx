import { useSelector } from "react-redux";
import { FC } from "react";
import { NavLink } from "react-router-dom";

import {
  MdPayments,
  RiGraduationCapFill,
  FaChalkboardTeacher,
  MdDashboard,
  ImProfile,
  IoChatbox,
} from "@/assets/icons";
import { SideBar } from "@/components";
import { RootReducer } from "@/store";

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
      icon: <ImProfile />,
      link: "/user/profile",
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
      name: "Trainer Dashboard",
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

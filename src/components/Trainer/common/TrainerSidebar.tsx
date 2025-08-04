import { FC } from "react";
import { NavLink } from "react-router-dom";

import { SideBar } from "@/components";
import {
  MdDashboard,
  MdHome,
  MdVideoLibrary,
  FaWallet,
  PiStudentBold,
} from "@/assets/icons";
import { IoDocumentText } from "react-icons/io5";

const sidebarItems = [
  { name: "Dashboard", icon: <MdDashboard />, link: "/trainer", end: true },
  { name: "My Courses", icon: <MdVideoLibrary />, link: "/trainer/courses" },
  {
    name: "Assignments",
    icon: <IoDocumentText />,
    link: "/trainer/assignments",
  },
  { name: "Students", icon: <PiStudentBold />, link: "/trainer/students" },
  { name: "Revenue", icon: <FaWallet />, link: "/trainer/revenue" },
  { name: "Home", icon: <MdHome />, link: "/" },
];

const TrainerSidebar: FC = () => {
  return (
    <SideBar>
      {sidebarItems.map((item) => (
        <NavLink
          to={item.link}
          key={item.name}
          end={item.end || false}
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

export default TrainerSidebar;

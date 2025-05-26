import { FC } from "react";
import { NavLink } from "react-router-dom";

import { SideBar } from "@/components";
import {
  MdDashboard,
  MdHome,
  MdVideoLibrary,
  FaWallet,
  IoChatbox,
  PiStudentBold,
} from "@/assets/icons";

const sidebarItems = [
  { name: "Dashboard", icon: <MdDashboard />, link: "/trainer", end: true },
  { name: "My Courses", icon: <MdVideoLibrary />, link: "/trainer/courses" },
  { name: "Students", icon: <PiStudentBold />, link: "/trainer/students" },
  { name: "Wallet", icon: <FaWallet />, link: "/trainer/wallet" },
  { name: "Chat", icon: <IoChatbox />, link: "/trainer/chat" },
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
          className={"w-full  px-2 py-2 flex items-center gap-2"}
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </SideBar>
  );
};

export default TrainerSidebar;

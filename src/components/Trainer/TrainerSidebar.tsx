import { FC } from "react";

import { SideBar } from "@/components";
import { MdDashboard, MdHome, MdVideoLibrary, FaWallet } from "@/assets/icons";

const sidebarItems = [
  { name: "Dashboard", icon: <MdDashboard />, link: "/trainer" },
  { name: "My Courses", icon: <MdVideoLibrary />, link: "/trainer/courses" },
  { name: "Wallet", icon: <FaWallet />, link: "/trainer/wallet" },
  { name: "Home", icon: <MdHome />, link: "/" },
];

const TrainerSidebar: FC = () => {
  return <SideBar sidebarItems={sidebarItems} />;
};

export default TrainerSidebar;

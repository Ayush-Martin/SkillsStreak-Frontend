import { FC } from "react";

import { SideBar } from "@/components";
import {
  MdDashboard,
  FaUsers,
  FaChalkboardTeacher,
  MdVideoLibrary,
  FaBoxesStacked,
  TbCategoryFilled,
  IoChatbox,
  MdPayments,
} from "@/assets/icons";

const sidebarItems = [
  { name: "Dashboard", icon: <MdDashboard />, link: "/admin", end: true },
  { name: "Users", icon: <FaUsers />, link: "/admin/users" },
  {
    name: "Trainer Requests",
    icon: <FaChalkboardTeacher />,
    link: "/admin/trainerRequests",
  },
  { name: "Courses", icon: <MdVideoLibrary />, link: "/admin/courses" },
  { name: "Bundles", icon: <FaBoxesStacked />, link: "/admin/bundles" },
  { name: "Categories", icon: <TbCategoryFilled />, link: "/admin/categories" },
  { name: "Messages", icon: <IoChatbox />, link: "/admin/messages" },
  { name: "Transactions", icon: <MdPayments />, link: "/admin/transactions" },
];

const AdminSidebar: FC = () => {
  return <SideBar sidebarItems={sidebarItems} />;
};

export default AdminSidebar;

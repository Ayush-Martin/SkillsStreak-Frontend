import { FC } from "react";
import { NavLink } from "react-router-dom";

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
  { name: "Dashboard", icon: <MdDashboard />, link: "/admin" },
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
  return (
    <SideBar>
      {sidebarItems.map((item) => (
        <NavLink
          to={item.link}
          key={item.name}
          className={"w-full  px-2 py-2 flex items-center gap-2"}
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </SideBar>
  );
};

export default AdminSidebar;

import { FC } from "react";
import { NavLink } from "react-router-dom";

import { SideBar } from "@/components";
import {
  MdDashboard,
  FaUsers,
  FaChalkboardTeacher,
  MdVideoLibrary,
  TbCategoryFilled,
  MdPayments,
  FaWallet,
} from "@/assets/icons";
import { TbReportMoney } from "react-icons/tb";

import { HiMiniTag } from "react-icons/hi2";
import { MdQuiz } from "react-icons/md";

const sidebarItems = [
  { name: "Dashboard", icon: <MdDashboard />, link: "/admin", end: true },
  { name: "Users", icon: <FaUsers />, link: "/admin/users" },
  {
    name: "Trainer Requests",
    icon: <FaChalkboardTeacher />,
    link: "/admin/trainerRequests",
  },
  { name: "Courses", icon: <MdVideoLibrary />, link: "/admin/courses" },
  { name: "Quizzes", icon: <MdQuiz />, link: "/admin/quizzes" },
  {
    name: "Quiz Submissions",
    icon: <MdQuiz />,
    link: "/admin/quizSubmissions",
  },
  { name: "Categories", icon: <TbCategoryFilled />, link: "/admin/categories" },
  { name: "Topics", icon: <HiMiniTag />, link: "/admin/topics" },
  {
    name: "Subscription Plans",
    icon: <TbReportMoney />,
    link: "/admin/subscriptionPlans",
  },
  {
    name: "Subscribed Users",
    icon: <TbReportMoney />,
    link: "/admin/subscribedUsers",
  },
  { name: "Revenue", icon: <FaWallet />, link: "/admin/revenue" },
  { name: "Transactions", icon: <MdPayments />, link: "/admin/transactions" },
];

const AdminSidebar: FC = () => {
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

export default AdminSidebar;

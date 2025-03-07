import { useSelector } from "react-redux";
import { FC } from "react";

import {
  ImProfile,
  MdPayments,
  RiGraduationCapFill,
  FaChalkboardTeacher,
} from "@/assets/icons";
import { SideBar } from "@/components";
import { RootReducer } from "@/store";

const UserSidebar: FC = () => {
  const { role } = useSelector((state: RootReducer) => state.user);

  const sidebarItems = [
    {
      name: "Profile",
      icon: <ImProfile />,
      link: "/user",
    },
    {
      name: "Enrolled Courses",
      icon: <RiGraduationCapFill />,
      link: "/user/enrolledCourses",
    },
    {
      name: "Transactions",
      icon: <MdPayments />,
      link: "/user/transactions",
    },
    {
      name: "Trainer Dashboard",
      icon: <FaChalkboardTeacher />,
      link: role == "trainer" ? "/trainer" : "/user/trainerRequests",
    },
  ];

  return <SideBar sidebarItems={sidebarItems} />;
};

export default UserSidebar;

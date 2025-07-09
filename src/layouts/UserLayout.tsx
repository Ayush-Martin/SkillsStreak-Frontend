import { FC, ReactNode, useEffect } from "react";
import { UserHeader } from "@/components";

interface IUserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<IUserLayoutProps> = ({ children }) => {
  useEffect(() => {
    import("@/pages/User/NewUserChatPage");
    import("@/pages/User/UserEnrolledCoursePage");
    import("@/pages/User/UserTransactionsPage");
  }, []);
  return (
    <main className="relative bg-app-primary">
      <UserHeader />

      <section className="min-h-screen pt-16">{children}</section>
    </main>
  );
};

export default UserLayout;

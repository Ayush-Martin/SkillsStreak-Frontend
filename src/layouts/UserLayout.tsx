import { FC, ReactNode } from "react";
import { UserHeader } from "@/components";

interface IUserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<IUserLayoutProps> = ({ children }) => {
  return (
    <main className="relative bg-app-primary">
      <UserHeader />

      <section className="min-h-screen pt-16">{children}</section>
    </main>
  );
};

export default UserLayout;

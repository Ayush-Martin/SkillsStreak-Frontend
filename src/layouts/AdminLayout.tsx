import { FC, ReactNode } from "react";
import { AdminHeader, AdminSidebar } from "@/components";

interface IAdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<IAdminLayoutProps> = ({ children }) => {
  return (
    <main className="bg-app-primary ">
      <AdminHeader />

      <section className="min-h-screen pt-16">
        <div className="relative flex">
          <AdminSidebar />
          <div className="w-full pt-12 ml-0 text-sm text-white px-7 lg:px-14 md:mt-0 md:ml-64 md:text-base">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;

import { ReactNode } from "react";
import logo from "../assets/images/logo.png";
import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";
import { AdminSidebar } from "@/components";

interface IAdminLayout {
  children: ReactNode;
}

const AdminLayout = ({ children }: IAdminLayout) => {
  const { logoutHandler } = useLogout();
  return (
    <main className="bg-app-primary ">
      <header className="fixed top-0 left-0 z-20 flex items-center justify-between w-full h-16 px-6 py-4 text-white bg-opacity-30 bg-app-primary backdrop-blur-sm">
        <div className="hidden w-24 sm:block"></div>
        <img src={logo} alt="" className="object-contain" width={"130px"} />

        <Button variant={"v2"} className="" onClick={logoutHandler}>
          Logout
        </Button>
      </header>

      <section className="min-h-[1000px] pt-20">
        <div className="relative flex">
          <AdminSidebar />
          <div className="w-full px-0 mt-10 ml-0 text-sm text-white md:px-20 md:mt-0 md:ml-64 md:text-base">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;

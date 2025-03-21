import { FC, ReactNode } from "react";

import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui";
import useLogout from "@/hooks/useLogout";
import { Notification, TrainerSidebar } from "@/components";

interface ITrainerLayoutProps {
  children: ReactNode;
}

const TrainerLayout: FC<ITrainerLayoutProps> = ({ children }) => {
  const { logoutHandler } = useLogout();
  return (
    <main className="bg-app-primary ">
      <header className="fixed top-0 left-0 z-20 flex items-center justify-between w-full h-16 px-6 py-4 text-white bg-opacity-30 bg-app-primary backdrop-blur-sm">
        <div className="hidden w-24 sm:block"></div>
        <img src={logo} alt="" className="object-contain" width={"130px"} />

        <div className="flex items-center gap-4">
          <Notification />
          <Button variant={"v2"} className="" onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      </header>

      <section className="min-h-screen pt-20">
        <div className="relative flex">
          <TrainerSidebar />
          <div className="w-full pt-12 ml-0 text-sm text-white px-7 lg:px-14 md:mt-0 md:ml-64 md:text-base">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrainerLayout;

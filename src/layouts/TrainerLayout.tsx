import { FC, ReactNode } from "react";

import { TrainerHeader, TrainerSidebar } from "@/components";

interface ITrainerLayoutProps {
  children: ReactNode;
}

const TrainerLayout: FC<ITrainerLayoutProps> = ({ children }) => {
  return (
    <main className="bg-app-primary ">
      <TrainerHeader />
      <section className="min-h-screen pt-16">
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

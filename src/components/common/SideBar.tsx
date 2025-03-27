import { FC, ReactNode, useState } from "react";

import { CgMenuGridO } from "@/assets/icons";

interface ISideBarProps {
  children: ReactNode;
}

const SideBar: FC<ISideBarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className={`absolute top-0 left-0 lg:hidden text-4xl rounded-md  text-black bg-opacity-30 bg-app-neutral backdrop-blur-sm ${
          isOpen && "hidden"
        }`}
        onClick={() => setIsOpen((p) => !p)}
      >
        <CgMenuGridO />
      </button>
      <div
        className={`absolute  z-20 flex-col w-64 h-full lg:h-auto gap-4  py-20 text-lg text-white md:fixed bg-opacity-30 bg-app-primary backdrop-blur-sm md:block ${
          !isOpen && "hidden border border-app-border min-h-screen border-t-0"
        }`}
      >
        <button
          className={` md:hidden  text-4xl text-white ${!isOpen && "hidden"}`}
          onClick={() => setIsOpen((p) => !p)}
        >
          <CgMenuGridO />
        </button>
        <div className="flex flex-col gap-3 px-4">{children}</div>
      </div>
    </>
  );
};

export default SideBar;

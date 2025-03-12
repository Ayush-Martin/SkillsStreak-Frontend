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
        className={`absolute top-0 left-0 md:hidden text-4xl rounded-md  text-black bg-opacity-30 bg-app-neutral backdrop-blur-sm ${
          isOpen && "hidden"
        }`}
        onClick={() => setIsOpen((p) => !p)}
      >
        <CgMenuGridO />
      </button>
      <div
        className={`absolute  z-10 flex-col w-64 h-full md:h-auto gap-4 px-6 py-4 text-lg text-white md:fixed bg-opacity-30 bg-app-primary backdrop-blur-sm md:block ${
          !isOpen && "hidden"
        }`}
      >
        <button
          className={` md:hidden  text-4xl text-white ${!isOpen && "hidden"}`}
          onClick={() => setIsOpen((p) => !p)}
        >
          <CgMenuGridO />
        </button>

        {children}
      </div>
    </>
  );
};

export default SideBar;

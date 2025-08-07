import { FC, ReactNode, useState } from "react";
import { CgMenuGridO } from "@/assets/icons";

interface ISideBarProps {
  children: ReactNode;
}

// adjust based on your actual header height

const SideBar: FC<ISideBarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button for mobile */}
      {!isOpen && (
        <button
          className={`
    fixed top-[4.5rem] left-4 z-30 
    lg:hidden 
    text-white text-2xl p-2 rounded-md 
    bg-app-neutral bg-opacity-30 backdrop-blur-sm 
    shadow-md hover:bg-opacity-50 transition
  `}
          onClick={() => setIsOpen(true)}
        >
          <CgMenuGridO />
        </button>
      )}

      {/* Sidebar container */}
      <div
        className={`
          fixed left-0 top-16 
          w-64 h-[calc(100vh-5rem)] 
          z-20 
          bg-app-primary bg-opacity-30 backdrop-blur-md 
          border-r border-app-border text-white 
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        {/* Close button (mobile only) */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            className="text-2xl text-white"
            onClick={() => setIsOpen(false)}
          >
            <CgMenuGridO />
          </button>
        </div>

        {/* Scrollable content inside fixed sidebar */}
        <div className="flex flex-col gap-3 px-4 py-4 overflow-y-auto h-full pr-2">
          {children}
        </div>
      </div>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;

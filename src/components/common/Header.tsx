import { FC, ReactNode } from "react";

interface IHeaderProps {
  children: ReactNode;
}

const Header: FC<IHeaderProps> = ({ children }) => {
  return (
    <header className="fixed top-0 left-0 z-20 w-full h-16 px-10 text-white border bg-app-primary bg-opacity-30 border-app-border backdrop-blur-sm">
      <div className="flex items-center justify-between w-full h-full px-4 py-4 border border-t-0 border-b-0 border-app-border">
        {children}
      </div>
    </header>
  );
};

export default Header;

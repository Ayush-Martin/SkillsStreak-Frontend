import { FC, ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui";
import Hamburger from "hamburger-react";
import useLogout from "@/hooks/useLogout";
import { RootReducer } from "@/store";
import { Chat } from "@/components";

interface IUserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<IUserLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const { logoutHandler } = useLogout();
  const { accessToken } = useSelector((state: RootReducer) => state.user);

  return (
    <main className="relative bg-app-primary">
      <Chat />
      <header className="fixed top-0 left-0 z-20 flex items-center justify-between w-full h-16 px-6 py-4 text-white bg-opacity-30 bg-app-primary backdrop-blur-sm">
        <img src={logo} alt="" className="object-contain" width={"130px"} />
        <ul className="hidden gap-4 text-lg text-white sm:flex">
          <li className="hover:text-app-accent">
            <NavLink
              to={"/"}
              className={({ isActive }) => (isActive ? "text-app-accent" : "")}
            >
              Home
            </NavLink>
          </li>
          <li className="hover:text-app-accent">
            <NavLink
              to={"/courses"}
              className={({ isActive }) => (isActive ? "text-app-accent" : "")}
            >
              Courses
            </NavLink>
          </li>
          <li className="hover:text-app-accent">
            <NavLink
              to={"/user/profile"}
              className={({ isActive }) => (isActive ? "text-app-accent" : "")}
            >
              Dashboard
            </NavLink>
          </li>
        </ul>

        <Button
          variant={"v2"}
          className="hidden sm:block"
          onClick={accessToken ? logoutHandler : () => navigate("/auth")}
        >
          {accessToken ? "Logout" : "Login"}
        </Button>

        <div className=" sm:hidden">
          <Hamburger
            toggled={hamburgerOpen}
            toggle={setHamburgerOpen}
            size={25}
          />
          <ul
            className={`fixed right-0 left-0 flex flex-col gap-4 text-sm text-white px-1 py-2 text-center rounded-sm  bg-opacity-90 bg-app-border mx-auto w-60 ${
              !hamburgerOpen && "hidden"
            }`}
          >
            <li className="hover:text-app-accent active:text-app-accent">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="hover:text-app-accent">
              <Link to={"/courses"}>Courses</Link>
            </li>
            <li className="hover:text-app-accent">
              <Link to={"/user"}>Dashboard</Link>
            </li>
            <li>
              <Button
                variant={"v1"}
                size={"full"}
                onClick={accessToken ? logoutHandler : () => navigate("/auth")}
              >
                {accessToken ? "Logout" : "Login"}
              </Button>
            </li>
          </ul>
        </div>
      </header>

      <section className="min-h-[700px] pt-20">{children}</section>

      <footer className="flex flex-col items-center justify-between h-[200px] w-full  py-10 mt-2 text-white bg-app-border px-8 sm:px-28  lg:px-56 z-20">
        <ul className="grid justify-center w-full grid-cols-2 my-4 text-center md:grid-cols-6">
          <li>Home</li>
          <li>Dashboard</li>
          <li>Dashboard</li>
          <li>Dashboard</li>
          <li>Dashboard</li>
          <li>Dashboard</li>
        </ul>
        <div>h1</div>
      </footer>
    </main>
  );
};

export default UserLayout;

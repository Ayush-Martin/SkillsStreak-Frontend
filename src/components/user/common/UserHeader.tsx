import { FC, useState } from "react";
import Hamburger from "hamburger-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Header,
  Logo,
  Notification,
  ProfileImage,
  Wishlist,
  Button,
} from "@/components";
import { CgLogIn } from "@/assets/icons";
import { RootReducer } from "@/store";
import { useClickOutside, useLogout } from "@/hooks";
import useWishlist from "@/hooks/useWishlist";
import useEnrollCourse from "@/hooks/useEnrollCourse";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/user/quizzes", label: "Quizzes" },
];

const DROPDOWN_LINKS = [
  { to: "/user", label: "My Dashboard" },
  { to: "/trainer", label: "Trainer Dashboard" },
];

const UserHeader: FC = () => {
  const navigate = useNavigate();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleEnroll } = useEnrollCourse();
  const { logoutHandler } = useLogout();
  const { fetchWishlist, removeWishlist, wishlist } = useWishlist();
  const { accessToken, profileImage } = useSelector(
    (state: RootReducer) => state.user
  );
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setDropdownOpen(false)
  );

  return (
    <Header>
      <Link to={"/"}>
        <Logo />
      </Link>
      <ul className="hidden gap-4 text-lg text-white sm:flex">
        {LINKS.map(({ to, label }) => (
          <li
            className="hover:text-app-accent hover:scale-110 hover:animate-accordion-up"
            key={label}
          >
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive ? "text-app-accent border-b-2 border-current pb-1" : ""
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="items-center hidden gap-4 sm:flex">
        <Wishlist
          fetchWishlist={fetchWishlist}
          removeWishlist={removeWishlist}
          wishlist={wishlist}
          handleEnroll={handleEnroll}
        />
        <Notification />

        {accessToken ? (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <ProfileImage
                profileImage={profileImage}
                size={9}
                textSize="2xl"
              />
            </button>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-14 w-[220px] flex flex-col gap-2 px-5 py-4 bg-gradient-to-b from-[#0a0d17]/90 to-[#0a0d17]/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 text-white text-sm text-center z-50"
              >
                {DROPDOWN_LINKS.map(({ to, label }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center justify-center gap-2 py-2 px-2 rounded-md transition-all duration-200 hover:text-app-accent hover:bg-white/10"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {label}
                  </Link>
                ))}

                <Button
                  variant="v2"
                  onClick={logoutHandler}
                  className="mt-3 w-full py-2 text-sm font-medium rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-red-600"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant={"v2"}
            size={"lg"}
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2"
          >
            <p>Login</p>
            <CgLogIn className="mt-1" />
          </Button>
        )}
      </div>

      <div className=" sm:hidden">
        <div className="flex items-center gap-1">
          <Wishlist
            handleEnroll={handleEnroll}
            fetchWishlist={fetchWishlist}
            removeWishlist={removeWishlist}
            wishlist={wishlist}
          />
          <Notification />
          <Hamburger
            toggled={hamburgerOpen}
            toggle={setHamburgerOpen}
            size={18}
          />
        </div>
        {hamburgerOpen && (
          <div className="fixed left-0 right-0 w-[300px] mx-auto mt-2 bg-black border shadow-lg border-app-border bg-opacity-90 rounded-xl">
            <ul className="flex flex-col gap-3 py-4 text-center text-white">
              {[...LINKS, ...DROPDOWN_LINKS].map(({ to, label }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      isActive
                        ? "text-app-accent border-b-2 border-current pb-1"
                        : "hover:text-app-accent"
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Button
                  variant={"v2"}
                  onClick={
                    accessToken ? logoutHandler : () => navigate("/auth")
                  }
                  className="hover:scale-105 w-[200px]"
                >
                  {accessToken ? "Logout" : "Login"}
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </Header>
  );
};

export default UserHeader;

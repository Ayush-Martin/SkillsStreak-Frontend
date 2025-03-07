import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { RootReducer } from "../store";
import { errorPopup } from "@/utils/popup";
interface IRoutesHandlerProps {
  requiredRole: "admin" | "user" | "premium" | "public" | "trainer" | "auth";
}

const RoutesHandler: FC<IRoutesHandlerProps> = ({ requiredRole }) => {
  const { accessToken, role, isBlocked } = useSelector(
    (state: RootReducer) => state.user
  );
  const location = useLocation();

  if (requiredRole == "auth") {
    if (accessToken && !isBlocked) {
      return <Navigate to={"/"} replace />;
    }
    return <Outlet />;
  }

  if (requiredRole == "public") {
    if (role == "admin") {
      return <Navigate to={"/admin"} state={{ from: location }} replace />;
    }
    return <Outlet />;
  }

  if (!accessToken) {
    errorPopup("You must login");
    return <Navigate to={"/auth"} state={{ from: location }} replace />;
  }

  if (requiredRole == "user") {
    if (role == "trainer" || role == "premium") return <Outlet />;
    else if (role == "admin")
      return <Navigate to={"/admin"} state={{ from: location }} replace />;
  }

  if (requiredRole && requiredRole !== role) {
    errorPopup("You don't have access");
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoutesHandler;

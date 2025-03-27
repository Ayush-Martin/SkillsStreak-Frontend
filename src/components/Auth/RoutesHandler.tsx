import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { RootReducer } from "@/store";
import { errorPopup } from "@/utils/popup";

interface IRoutesHandlerProps {
  requiredRole: "admin" | "user" | "public" | "trainer" | "auth";
}

const RoutesHandler: FC<IRoutesHandlerProps> = ({ requiredRole }) => {
  const { accessToken, role, isBlocked } = useSelector(
    (state: RootReducer) => state.user
  );
  const location = useLocation();

  if (isBlocked) {
    errorPopup("Your account is blocked.");
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole === "auth") {
    if (accessToken) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  if (requiredRole === "public") {
    if (role === "admin") {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
    return <Outlet />;
  }

  if (!accessToken) {
    errorPopup("You must login.");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const roleRedirectMap = {
    admin: "/",
    trainer: "/",
    user: "/auth",
  };

  if (requiredRole !== role) {
    errorPopup("You don't have access.");
    const redirectTo =
      roleRedirectMap[role as keyof typeof roleRedirectMap] || "/";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoutesHandler;

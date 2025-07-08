import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AppDispatch, RootReducer } from "@/store";
import { errorPopup } from "@/utils/popup";
import { useDispatch } from "react-redux";
import { logout } from "@/features/Auth/slice/userSlice";

interface IRoutesHandlerProps {
  requiredRole: "admin" | "user" | "public" | "trainer" | "auth";
}

const RoutesHandler: FC<IRoutesHandlerProps> = ({ requiredRole }) => {
  const { accessToken, role, isBlocked } = useSelector(
    (state: RootReducer) => state.user
  );
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  // Check if user is blocked
  if (isBlocked) {
    dispatch(logout());
    return <Navigate to="/auth" replace />;
  }

  // If logged in and trying to access /auth, redirect to home
  if (accessToken && location.pathname === "/auth") {
    return <Navigate to="/" replace />;
  }

  // Handle "auth" routes (login/register pages)
  if (requiredRole === "auth") {
    if (accessToken) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  // Handle "public" routes (accessible to all, but redirect admin to /admin)
  if (requiredRole === "public") {
    if (role === "admin") {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
    return <Outlet />;
  }

  // If not logged in, redirect to /auth
  if (!accessToken) {
    errorPopup("You must login.");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Handle role-specific access
  if (requiredRole === "admin" && role !== "admin") {
    errorPopup("You don't have access.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If admin tries to access non-admin pages, redirect to /admin
  if (role === "admin" && requiredRole !== "admin") {
    errorPopup("Redirecting to admin dashboard.");
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Allow trainer to access user pages
  if (requiredRole === "user" && role === "trainer") {
    return <Outlet />;
  }

  // Handle other role mismatches
  if (requiredRole !== role) {
    errorPopup("You don't have access.");
    const roleRedirectMap = {
      admin: "/admin",
      trainer: "/",
      user: "/",
    };
    const redirectTo =
      roleRedirectMap[role as keyof typeof roleRedirectMap] || "/";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoutesHandler;

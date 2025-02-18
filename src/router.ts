import { lazy } from "react";

//public Routes
const Home = lazy(() => import("./pages/User/Home"));
const Courses = lazy(() => import("./pages/User/Courses"));

//Auth Routes
const LoginRegisterPage = lazy(() => import("./pages/Auth/LoginRegisterPage"));
const VerifyOTP = lazy(() => import("./pages/Auth/VerifyOTP"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));

//User Routes
const Profile = lazy(() => import("./pages/User/Profile"));
const EnrolledCourses = lazy(() => import("./pages/User/EnrolledCourse"));
const Payments = lazy(() => import("./pages/User/Payments"));

//Premium User Routes
//Todo

//Trainer Routes
const TrainerDashboard = lazy(() => import("./pages/Trainer/Dashboard"));

//Admin Routes
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));

type Route = {
  path: string;
  Component: React.ComponentType;
};

type Routes = Route[];

export const PublicRoutes: Routes = [
  {
    path: "",
    Component: Home,
  },
  {
    path: "courses",
    Component: Courses,
  },
];

export const AuthRoutes: Routes = [
  {
    path: "",
    Component: LoginRegisterPage,
  },
  {
    path: "verifyOTP",
    Component: VerifyOTP,
  },
  {
    path: "forgetPassword",
    Component: ForgetPassword,
  },
  {
    path: "resetPassword",
    Component: ResetPassword,
  },
];

export const UserRoutes: Routes = [
  {
    path: "",
    Component: Profile,
  },
  {
    path: "enrolledCourses",
    Component: EnrolledCourses,
  },
  {
    path: "payments",
    Component: Payments,
  },
];

export const PremiumUserRoutes: Routes = [];

export const TrainerRoutes: Routes = [
  {
    path: "",
    Component: TrainerDashboard,
  },
];

export const AdminRoutes: Routes = [
  {
    path: "",
    Component: AdminDashboard,
  },
];

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
const AdminUsers = lazy(() => import("./pages/Admin/Users"));
const AdminTrainers = lazy(() => import("./pages/Admin/Trainers"));
const AdminCourses = lazy(() => import("./pages/Admin/Courses"));
const AdminBundles = lazy(() => import("./pages/Admin/Bundles"));
const AdminCategories = lazy(() => import("./pages/Admin/Categories"));
const AdminPayments = lazy(() => import("./pages/Admin/Payments"));
const AdminDoubts = lazy(() => import("./pages/Admin/Doubts"));

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
  {
    path: "users",
    Component: AdminUsers,
  },
  {
    path: "trainers",
    Component: AdminTrainers,
  },
  {
    path: "courses",
    Component: AdminCourses,
  },
  {
    path: "bundles",
    Component: AdminBundles,
  },
  {
    path: "categories",
    Component: AdminCategories,
  },
  {
    path: "payments",
    Component: AdminPayments,
  },
  {
    path: "doubts",
    Component: AdminDoubts,
  },
];

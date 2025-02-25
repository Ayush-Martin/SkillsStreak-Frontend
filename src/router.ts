import { lazy } from "react";

//public Routes
import Home from "./pages/User/Home";
const Courses = lazy(() => import("./pages/User/Courses"));

//Auth Routes
import LoginRegisterPage from "./pages/Auth/LoginRegisterPage";
const VerifyOTP = lazy(() => import("./pages/Auth/VerifyOTP"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));

//User Routes
const Profile = lazy(() => import("./pages/User/Profile"));
const EnrolledCourses = lazy(() => import("./pages/User/EnrolledCourse"));
const Payments = lazy(() => import("./pages/User/Payments"));
const SendTrainerRequest = lazy(() => import("./pages/User/TrainerRequest"));

//Premium User Routes
//Todo

//Trainer Routes
const TrainerDashboard = lazy(() => import("./pages/Trainer/Dashboard"));
const TrainerCourses = lazy(() => import("./pages/Trainer/MyCourses"));
const TrainerPayments = lazy(() => import("./pages/Trainer/Payments"));

//Admin Routes
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));
const AdminTrainers = lazy(() => import("./pages/Admin/Trainers"));
const AdminTrainerRequests = lazy(
  () => import("./pages/Admin/TrainerRequests")
);
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
  {
    path: "trainerRequest",
    Component: SendTrainerRequest,
  },
];

export const PremiumUserRoutes: Routes = [];

export const TrainerRoutes: Routes = [
  {
    path: "",
    Component: TrainerDashboard,
  },
  {
    path: "courses",
    Component: TrainerCourses,
  },
  {
    path: "payments",
    Component: TrainerPayments,
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
    path: "trainerRequests",
    Component: AdminTrainerRequests,
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

import { lazy } from "react";

//public Routes
import Home from "./pages/public/Home";
const Courses = lazy(() => import("./pages/public/Courses"));
const CourseDetail = lazy(() => import("./pages/public/CourseDetail"));

//Auth Routes
import LoginRegisterPage from "./pages/Auth/LoginRegisterPage";
const VerifyOTP = lazy(() => import("./pages/Auth/VerifyOTP"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));

//User Routes
const Profile = lazy(() => import("./pages/User/Profile"));
const EnrolledCourses = lazy(() => import("./pages/User/EnrolledCourse"));
const Transactions = lazy(() => import("./pages/User/Transactions"));
const SendTrainerRequest = lazy(() => import("./pages/User/TrainerRequest"));
const Course = lazy(() => import("./pages/User/Course"));

//Premium User Routes
//Todo

//Trainer Routes
const TrainerDashboard = lazy(() => import("./pages/Trainer/Dashboard"));
const TrainerCourses = lazy(() => import("./pages/Trainer/MyCourses"));
const TrainerAddCourse = lazy(() => import("./pages/Trainer/AddCourse"));
const TrainerEditCourse = lazy(() => import("./pages/Trainer/EditCourse"));
const TrainerEditModule = lazy(() => import("./pages/Trainer/EditModule"));
const TrainerWallet = lazy(() => import("./pages/Trainer/Wallet"));

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
const AdminTransactions = lazy(() => import("./pages/Admin/Transactions"));
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
  {
    path: "courses/:courseId",
    Component: CourseDetail,
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
    path: "transactions",
    Component: Transactions,
  },
  {
    path: "trainerRequest",
    Component: SendTrainerRequest,
  },
  {
    path: "enrolledCourses/:courseId/view",
    Component: Course,
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
    path: "courses/add",
    Component: TrainerAddCourse,
  },
  {
    path: "courses/:courseId",
    Component: TrainerEditCourse,
  },
  {
    path: "courses/:courseId/:moduleId",
    Component: TrainerEditModule,
  },
  {
    path: "wallet",
    Component: TrainerWallet,
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
    path: "transactions",
    Component: AdminTransactions,
  },
  {
    path: "doubts",
    Component: AdminDoubts,
  },
];

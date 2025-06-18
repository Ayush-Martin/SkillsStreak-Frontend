import { lazy } from "react";

//public Routes
import Home from "./pages/public/Home";
const Courses = lazy(() => import("./pages/public/Courses"));
const CourseDetail = lazy(() => import("./pages/public/CourseDetail"));
const Trainer = lazy(() => import("./pages/public/Trainer"));

//Auth Routes
import LoginRegisterPage from "./pages/Auth/LoginRegisterPage";
const VerifyOTP = lazy(() => import("./pages/Auth/VerifyOTP"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));

//User Routes
const Dashboard = lazy(() => import("./pages/User/DashBoard"));
const EnrolledCourses = lazy(() => import("./pages/User/EnrolledCourse"));
const Transactions = lazy(() => import("./pages/User/Transactions"));
const SendTrainerRequest = lazy(() => import("./pages/User/TrainerRequest"));
const Course = lazy(() => import("./pages/User/Course"));
const ChatNew = lazy(() => import("./pages/User/ChatNew"));
const LiveSession = lazy(() => import("./pages/User/LiveSession"));
const Profile = lazy(() => import("./pages/User/Profile"));

//Trainer Routes
const TrainerDashboard = lazy(() => import("./pages/Trainer/Dashboard"));
const TrainerCourses = lazy(() => import("./pages/Trainer/MyCourses"));
const TrainerAddCourse = lazy(() => import("./pages/Trainer/AddCourse"));
const TrainerEditCourse = lazy(() => import("./pages/Trainer/EditCourse"));
const TrainerEditModule = lazy(() => import("./pages/Trainer/EditModule"));
const TrainerWallet = lazy(() => import("./pages/Trainer/Wallet"));
const TrainerStudents = lazy(() => import("./pages/Trainer/Students"));
const TrainerLiveStream = lazy(() => import("./pages/Trainer/LiveStream"));

//Admin Routes
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));
const AdminTrainerRequests = lazy(
  () => import("./pages/Admin/TrainerRequests")
);
const AdminCourses = lazy(() => import("./pages/Admin/Courses"));
const AdminCategories = lazy(() => import("./pages/Admin/Categories"));
const AdminTransactions = lazy(() => import("./pages/Admin/Transactions"));

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
  {
    path: "auth/verifyOTP",
    Component: VerifyOTP,
  },
  {
    path: "trainer/:trainerId",
    Component: Trainer,
  },
];

export const AuthRoutes: Routes = [
  {
    path: "",
    Component: LoginRegisterPage,
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
    Component: Dashboard,
  },
  {
    path: "profile",
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
    path: "chats",
    Component: ChatNew,
  },
  {
    path: "enrolledCourses/:courseId/view",
    Component: Course,
  },
  {
    path: "courses/:courseId/live/:streamId",
    Component: LiveSession,
  },
];

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
    path: "students",
    Component: TrainerStudents,
  },
  {
    path: "wallet",
    Component: TrainerWallet,
  },
  {
    path: "courses/:courseId/live/new",
    Component: TrainerLiveStream,
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
    path: "trainerRequests",
    Component: AdminTrainerRequests,
  },
  {
    path: "courses",
    Component: AdminCourses,
  },
  {
    path: "categories",
    Component: AdminCategories,
  },
  {
    path: "transactions",
    Component: AdminTransactions,
  },
];

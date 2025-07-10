import { lazy } from "react";

//public Routes
import Home from "./pages/public/HomePage";
const Courses = lazy(() => import("./pages/public/CoursesPage"));
const CourseDetail = lazy(() => import("./pages/public/CourseDetailPage"));
const Trainer = lazy(() => import("./pages/public/TrainerPage"));
const PaymentSuccess = lazy(() => import("./pages/public/PaymentSuccessPage"));
const PaymentFailure = lazy(() => import("./pages/public/PaymentFailurePage"));

//Auth Routes
import LoginRegisterPage from "./pages/Auth/LoginRegisterPage";
const VerifyOTP = lazy(() => import("./pages/Auth/VerifyOTPPage"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPasswordPage"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPasswordPage"));

//User Routes
const ChangePassword = lazy(() => import("./pages/User/ChangePasswordPage"));
const Dashboard = lazy(() => import("./pages/User/UserDashBoardPage"));
const EnrolledCourses = lazy(
  () => import("./pages/User/UserEnrolledCoursePage")
);
const Transactions = lazy(() => import("./pages/User/UserTransactionsPage"));
const SendTrainerRequest = lazy(
  () => import("./pages/User/UserTrainerRequestPage")
);
const Course = lazy(() => import("./pages/User/UserCoursePage"));
const ChatNew = lazy(() => import("./pages/User/UserChatPage"));
const LiveSession = lazy(() => import("./pages/User/UserLiveSessionPage"));
const NewUserChat = lazy(() => import("./pages/User/NewUserChatPage"));

//Trainer Routes
const TrainerDashboard = lazy(
  () => import("./pages/Trainer/TrainerDashboardPage")
);
const TrainerCourses = lazy(() => import("./pages/Trainer/TrainerCoursesPage"));
const TrainerAddCourse = lazy(
  () => import("./pages/Trainer/TrainerAddCoursePage")
);
const TrainerEditCourse = lazy(
  () => import("./pages/Trainer/TrainerEditCoursePage")
);
const TrainerEditModule = lazy(
  () => import("./pages/Trainer/TrainerEditModulePage")
);
const TrainerRevenue = lazy(() => import("./pages/Trainer/TrainerRevenuePage"));
const TrainerStudents = lazy(
  () => import("./pages/Trainer/TrainerStudentsPage")
);
const TrainerLiveStream = lazy(
  () => import("./pages/Trainer/TrainerLiveStreamPage")
);

//Admin Routes
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboardPage"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminTrainerRequests = lazy(
  () => import("./pages/Admin/AdminTrainerRequestsPage")
);
const AdminCourses = lazy(() => import("./pages/Admin/AdminCoursesPage"));
const AdminCategories = lazy(() => import("./pages/Admin/AdminCategoriesPage"));
const AdminTransactions = lazy(() => import("./pages/Admin/AdminTransactions"));
const AdminRevenue = lazy(() => import("./pages/Admin/AdminRevenuePage"));

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
  {
    path: "payment/success",
    Component: PaymentSuccess,
  },
  {
    path: "payment/failure",
    Component: PaymentFailure,
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
    path: "chatsNew",
    Component: NewUserChat,
  },
  {
    path: "enrolledCourses/:courseId/view",
    Component: Course,
  },
  {
    path: "courses/:courseId/live/:streamId",
    Component: LiveSession,
  },
  {
    path: "changePassword",
    Component: ChangePassword,
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
    path: "revenue",
    Component: TrainerRevenue,
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
  {
    path: "revenue",
    Component: AdminRevenue,
  },
];

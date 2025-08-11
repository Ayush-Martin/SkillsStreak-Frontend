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
const ChangePassword = lazy(
  () => import("./pages/User/UserChangePasswordPage")
);
const Dashboard = lazy(() => import("./pages/User/UserDashBoardPage"));
const EnrolledCourses = lazy(
  () => import("./pages/User/UserEnrolledCoursesPage")
);
const Transactions = lazy(() => import("./pages/User/UserTransactionsPage"));
const SendTrainerRequest = lazy(
  () => import("./pages/User/UserTrainerRequestPage")
);
const NewUserChat = lazy(() => import("./pages/User/UserChatPage"));
const Profile = lazy(() => import("./pages/User/UserProfilePage"));
const EnrolledCourse = lazy(
  () => import("./pages/User/UserEnrolledCoursePage")
);
const CourseRecorded = lazy(
  () => import("./pages/User/UserEnrolledCourseRecordedPage")
);
const CourseLiveSession = lazy(
  () => import("./pages/User/UserEnrolledCourseLiveSessionPage")
);
const CourseAssignments = lazy(
  () => import("./pages/User/UserEnrolledCourseAssignmentsPage")
);
const Subscription = lazy(() => import("./pages/User/UserSubscriptionPage"));
const UserWallet = lazy(() => import("./pages/User/UserWalletPage"));
const UserQuizzes = lazy(() => import("./pages/User/UserQuizzesPage"));
const UserQuiz = lazy(() => import("./pages/User/UserQuizPage"));

//Trainer Routes
const TrainerDashboard = lazy(
  () => import("./pages/Trainer/TrainerDashboardPage")
);
const TrainerCourses = lazy(() => import("./pages/Trainer/TrainerCoursesPage"));
const TrainerEditModule = lazy(
  () => import("./pages/Trainer/TrainerEditModulePage")
);
const TrainerRevenue = lazy(() => import("./pages/Trainer/TrainerRevenuePage"));
const TrainerStudents = lazy(
  () => import("./pages/Trainer/TrainerStudentsPage")
);
const TrainerNewAddCourse = lazy(
  () => import("./pages/Trainer/TrainerAddCoursePage")
);
const TrainerNewEditCourse = lazy(
  () => import("./pages/Trainer/TrainerEditCoursePage")
);
const TrainerLiveSession = lazy(
  () => import("./pages/Trainer/TrainerLiveSessionPage")
);
const TrainerAssignmentSubmissions = lazy(
  () => import("./pages/Trainer/TrainerAssignmentSubmissionsPage")
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
const AdminUser = lazy(() => import("./pages/Admin/AdminUserPage"));
const AdminCourse = lazy(() => import("./pages/Admin/AdminCoursePage"));
const AdminSubscriptionPlans = lazy(
  () => import("./pages/Admin/AdminSubscriptionPlansPage")
);
const AdminSubscribedUsers = lazy(
  () => import("./pages/Admin/AdminSubscribedUsersPage")
);
const AdminAddQuiz = lazy(() => import("./pages/Admin/AdminAddQuizPage"));
const AdminTopics = lazy(() => import("./pages/Admin/AdminTopicsPage"));
const AdminQuizzes = lazy(() => import("./pages/Admin/AdminQuizzesPage"));
const AdminEditQuiz = lazy(() => import("./pages/Admin/AdminEditQuizPage"));

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
  {
    path: "subscriptions",
    Component: Subscription,
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
    Component: NewUserChat,
  },
  {
    path: "changePassword",
    Component: ChangePassword,
  },
  {
    path: "profile",
    Component: Profile,
  },
  {
    path: "enrolledCourses/:courseId",
    Component: EnrolledCourse,
  },
  {
    path: "enrolledCourses/:courseId/recorded",
    Component: CourseRecorded,
  },
  {
    path: "enrolledCourses/:courseId/live",
    Component: CourseLiveSession,
  },
  {
    path: "enrolledCourses/:courseId/assignments",
    Component: CourseAssignments,
  },
  {
    path: "wallet",
    Component: UserWallet,
  },
  {
    path: "quizzes",
    Component: UserQuizzes,
  },
  {
    path: "quizzes/:quizId",
    Component: UserQuiz,
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
    path: "courses/new",
    Component: TrainerNewAddCourse,
  },
  {
    path: "courses/:courseId",
    Component: TrainerNewEditCourse,
  },
  {
    path: "courses/:courseId/live/:liveSessionId",
    Component: TrainerLiveSession,
  },
  {
    path: "assignments",
    Component: TrainerAssignmentSubmissions,
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
    path: "courses/:courseId",
    Component: AdminCourse,
  },
  {
    path: "categories",
    Component: AdminCategories,
  },
  {
    path: "topics",
    Component: AdminTopics,
  },
  {
    path: "transactions",
    Component: AdminTransactions,
  },
  {
    path: "revenue",
    Component: AdminRevenue,
  },
  {
    path: "users/:userId",
    Component: AdminUser,
  },
  {
    path: "subscriptionPlans",
    Component: AdminSubscriptionPlans,
  },
  {
    path: "subscribedUsers",
    Component: AdminSubscribedUsers,
  },
  {
    path: "quizzes",
    Component: AdminQuizzes,
  },
  {
    path: "quizzes/new",
    Component: AdminAddQuiz,
  },
  {
    path: "quizzes/:quizId",
    Component: AdminEditQuiz,
  },
];

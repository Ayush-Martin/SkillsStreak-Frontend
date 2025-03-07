export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

//Auth
export const LOGIN_API = "/auth/login";
export const LOGOUT_API = "/auth/logout";
export const REGISTER_API = "/auth/register";
export const COMPLETE_REGISTER_API = "/auth/completeRegister";
export const LOGIN_WITH_GOOGLE_API = "/auth/google";
export const FORGET_PASSWORD_API = "/auth/forgetPassword";
export const RESET_PASSWORD_API = "/auth/resetPassword";
export const VERIFY_OTP_API = "/auth/verifyOTP";
export const REFRESH_TOKEN_API = "/auth/refresh";

//User
export const PROFILE_API = "/profile";
export const TRANSACTIONS_API = "/transactions";
export const ENROLLED_COURSES = "/enrolledCourses";
export const TRAINER_REQUEST_API = "/trainerRequest";

//Trainer
export const TRAINER_COURSES_API = "/trainer/courses";

//Admin
export const ADMIN_USERS_API = "/admin/users";
export const ADMIN_TRAINER_REQUEST_API = "/admin/trainerRequests";
export const ADMIN_CATEGORY_API = "/admin/categories";
export const ADMIN_TRANSITION_API = "/admin/transactions";
export const ADMIN_COURSES_API = "/admin/courses";

//Public
export const COURSES_API = "/courses";
export const CATEGORY_API = "/categories";

import { axiosGetRequest } from "@/config/axios";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { logout } from "@/features/Auth/userSlice";
import { successPopup } from "@/utils/popup";

const useLogout = () => {
  const dispatch: AppDispatch = useDispatch();

  const logoutHandler = async () => {
    const res = await axiosGetRequest("/auth/logout");
    if (!res) return;
    successPopup("you have logged out");
    dispatch(logout());
  };

  return { logoutHandler };
};

export default useLogout;

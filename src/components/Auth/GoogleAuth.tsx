import { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

import { axiosPostRequest } from "@/config/axios";
import { LOGIN_WITH_GOOGLE_API } from "@/constants/API";
import { login } from "@/features/Auth/slice/userSlice";
import { AppDispatch } from "@/store";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface IGoogleAuthProps {
  from?: string;
}

const GoogleAuth: FC<IGoogleAuthProps> = ({ from }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const googleSuccess = async (googleResponse: CredentialResponse) => {
    const token = googleResponse.credential;
    const res = await axiosPostRequest(LOGIN_WITH_GOOGLE_API, { token });
    if (!res) return;
    dispatch(login(res.data));
    navigate(from || "/", { replace: true });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={googleSuccess} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;

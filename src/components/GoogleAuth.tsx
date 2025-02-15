import { loginWithGoogle } from "@/api/authApi";
import { login } from "@/features/Auth/userSlice";
import { AppDispatch } from "@/store";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const GOOGLE_CLIENT_ID =
  "348313129052-ccnbpol84h4mtbefcid75rv0qacfbfh8.apps.googleusercontent.com";

const GoogleAuth = ({ from }: { from?: string }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const googleSuccess = async (googleResponse: CredentialResponse) => {
    const token = googleResponse.credential;

    const res = await loginWithGoogle(token!);
    if (!res) return;
    dispatch(login(res));
    navigate(from || "/", { replace: true });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={googleSuccess} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;

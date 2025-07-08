import { FC, useContext } from "react";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

import { LoginRegisterContext } from "@/context";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuth: FC = () => {
  const { handleGoogleLogin } = useContext(LoginRegisterContext)!;

  const googleSuccess = async (googleResponse: CredentialResponse) => {
    const token = googleResponse.credential;
    handleGoogleLogin(token || "");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={googleSuccess} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;

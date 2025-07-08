import { createContext } from "react";

interface ILoginRegisterContext {
  handleLogin: (username: string, password: string) => void;
  handleGoogleLogin: (token: string) => void;
  handleRegister: (username: string, email: string, password: string) => void;
}

const LoginRegisterContext = createContext<ILoginRegisterContext | undefined>(
  undefined
);

export default LoginRegisterContext;

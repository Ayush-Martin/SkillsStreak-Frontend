import { Route, Routes } from "react-router-dom";
import Home from "./pages/User/Home";
import LoginRegisterPage from "./pages/Auth/LoginRegisterPage";
import VerifyOTP from "./pages/Auth/VerifyOTP";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginRegister" element={<LoginRegisterPage />} />
        <Route path="/verifyOTP" element={<VerifyOTP />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;

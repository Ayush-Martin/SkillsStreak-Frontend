import { Route, Routes } from "react-router-dom";
import Home from "./pages/User/Home";
import LoginRegisterPage from "./pages/Auth/LoginRegisterPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginRegister" element={<LoginRegisterPage />} />
      </Routes>
    </>
  );
};

export default App;

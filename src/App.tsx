import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { RoutesHandler, Loading } from "@/components";
import {
  PublicRoutes,
  AuthRoutes,
  AdminRoutes,
  TrainerRoutes,
  UserRoutes,
} from "@/router";
import { AppDispatch, RootReducer } from "./store";
import { IResponse } from "@/types/responseType";
import { login } from "@/features/Auth/slice/userSlice";
import { BACKEND_BASE_URL, REFRESH_TOKEN_API } from "@/constants";
import { connectSocket, disconnectSocket } from "./config/socket";

const App = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { accessToken } = useSelector((state: RootReducer) => state.user);
  const [loading, setLoading] = useState(true);

  console.log("dfdf");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (accessToken) return;
        const res: IResponse = await axios.get(
          `${BACKEND_BASE_URL}/api${REFRESH_TOKEN_API}`,
          {
            withCredentials: true,
          }
        );
        dispatch(login(res.data.data));
      } catch (err) {
        console.warn(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    import("@/pages/public/CourseDetailPage");
    import("@/pages/public/CoursesPage");
    import("@/pages/public/TrainerPage");
    import("@/pages/public/PaymentSuccessPage");
    import("@/pages/public/PaymentFailurePage");
  }, []);

  useEffect(() => {
    console.log("before connecting socket");
    if (accessToken) {
      console.log("while connecting socket");
      connectSocket();
      return () => disconnectSocket();
    }
  }, [accessToken]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/*" element={<RoutesHandler requiredRole="public" />}>
            {PublicRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>

          <Route path="/auth/*" element={<RoutesHandler requiredRole="auth" />}>
            {AuthRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>

          <Route
            path="/admin/*"
            element={<RoutesHandler requiredRole="admin" />}
          >
            {AdminRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>

          <Route
            path="/trainer/*"
            element={<RoutesHandler requiredRole="trainer" />}
          >
            {TrainerRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>

          <Route path="/user/*" element={<RoutesHandler requiredRole="user" />}>
            {UserRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </main>
  );
};

export default App;

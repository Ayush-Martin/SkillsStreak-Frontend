import { Route, Routes, useNavigate } from "react-router-dom";
import { RoutesHandler } from "./components";
import {
  PublicRoutes,
  AuthRoutes,
  AdminRoutes,
  PremiumUserRoutes,
  TrainerRoutes,
  UserRoutes,
} from "./router";
import { Suspense, useEffect, useState } from "react";
import { AppDispatch, RootReducer } from "./store";
import { useDispatch } from "react-redux";
import { IResponse } from "./types/responseType";
import { login } from "./features/Auth/slice/userSlice";
import axios from "axios";
import { BACKEND_BASE_URL, REFRESH_TOKEN_API } from "./constants/API";
import Loading from "./pages/public/Loading";
import { useSelector } from "react-redux";

const App = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { accessToken } = useSelector((state: RootReducer) => state.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (accessToken) return;
        const res: IResponse = await axios.get(
          `${BACKEND_BASE_URL}${REFRESH_TOKEN_API}`,
          {
            withCredentials: true,
          }
        );
        dispatch(login(res.data.data));
      } catch (err) {
        console.log(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
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

          <Route
            path="/premium/*"
            element={<RoutesHandler requiredRole="premium" />}
          >
            {PremiumUserRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </main>
  );
};

export default App;

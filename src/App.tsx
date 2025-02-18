import { Route, Routes } from "react-router-dom";
import { RoutesHandler } from "./components";
import {
  PublicRoutes,
  AuthRoutes,
  AdminRoutes,
  PremiumUserRoutes,
  TrainerRoutes,
  UserRoutes,
} from "./router";
import { useEffect } from "react";
import { AppDispatch } from "./store";
import { useDispatch } from "react-redux";
import { IResponse } from "./types/responseType";
import { login } from "./features/Auth/userSlice";
import axios from "axios";
import { BACKEND_BASE_URL, REFRESH_TOKEN_API } from "./constants/API";

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res: IResponse = await axios.get(
          `${BACKEND_BASE_URL}${REFRESH_TOKEN_API}`,
          {
            withCredentials: true,
          }
        );
        dispatch(login(res.data.data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchApi();
  }, []);

  return (
    <main>
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

        <Route path="/admin/*" element={<RoutesHandler requiredRole="admin" />}>
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
    </main>
  );
};

export default App;

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

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/*" element={<RoutesHandler requiredRole="public" />}>
          {PublicRoutes.map(({ path, Component }) => (
            <Route path={path} element={<Component />} />
          ))}
        </Route>

        <Route path="/auth/*" element={<RoutesHandler requiredRole="auth" />}>
          {AuthRoutes.map(({ path, Component }) => (
            <Route path={path} element={<Component />} />
          ))}
        </Route>

        <Route path="/admin/*" element={<RoutesHandler requiredRole="admin" />}>
          {AdminRoutes.map(({ path, Component }) => (
            <Route path={path} element={<Component />} />
          ))}
        </Route>

        <Route
          path="/trainer/*"
          element={<RoutesHandler requiredRole="trainer" />}
        >
          {TrainerRoutes.map(({ path, Component }) => (
            <Route path={path} element={<Component />} />
          ))}
        </Route>

        <Route path="/user/*" element={<RoutesHandler requiredRole="user" />}>
          {UserRoutes.map(({ path, Component }) => (
            <Route path={path} element={<Component />} />
          ))}
        </Route>

        <Route
          path="/premium/*"
          element={<RoutesHandler requiredRole="premium" />}
        >
          {PremiumUserRoutes.map(({ path, Component }) => (
            <Route path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </main>
  );
};

export default App;

import { useStore } from "@/store/store";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePaths";

const AuthRoute = () => {
  const { accessToken, user } = useStore();

  if (!accessToken && !user) return <Outlet />;

  return <Navigate to={PROTECTED_ROUTES.EVENT_TYPES} replace />;
};

export default AuthRoute;

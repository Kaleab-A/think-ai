import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "@/store/store";

const ProtectedRoute = () => {
  const { accessToken } = useStore();

  if (accessToken) return <Outlet />;

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;

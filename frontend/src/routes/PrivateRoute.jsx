import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    // Optionally, return a loading spinner here
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

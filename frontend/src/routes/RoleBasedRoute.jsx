import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    return user && allowedRoles.includes(user.role) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
};

export default RoleBasedRoute;

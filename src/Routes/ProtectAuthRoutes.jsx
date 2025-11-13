import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";

const ProtectAuthRoutes = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to={location.state || "/dashboard"}></Navigate>;
  }

  return children;
};

export default ProtectAuthRoutes;
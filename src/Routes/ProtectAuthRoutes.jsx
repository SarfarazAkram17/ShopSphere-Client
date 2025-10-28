import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loader from "../Components/Loader/Loader";

const ProtectAuthRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader></Loader>;
  }

  if (user) {
    return <Navigate to={location.state || "/dashboard"}></Navigate>;
  }

  return children;
};

export default ProtectAuthRoutes;
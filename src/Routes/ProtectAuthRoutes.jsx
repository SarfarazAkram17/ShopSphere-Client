import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loader from "../Components/Loader/Loader";

const ProtectAuthRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader></Loader>;
  }

  if (user) {
    return <Navigate to="/dashboard"></Navigate>;
  }

  return children;
};

export default ProtectAuthRoutes;
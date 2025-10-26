import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";

const ProtectAuthRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return;
  }

  if (user) {
    return <Navigate to="/dashboard"></Navigate>;
  }

  return children;
};

export default ProtectAuthRoutes;
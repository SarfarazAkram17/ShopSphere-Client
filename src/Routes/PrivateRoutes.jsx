import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loader from "../Components/Loader/Loader";

const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader></Loader>;
  }

  if (!user) {
    return <Navigate state={location.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoutes;
import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loader from "../Components/Loader/Loader";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader></Loader>;
  }

  if (!user) {
    return <Navigate state="/dashboard" to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoutes;
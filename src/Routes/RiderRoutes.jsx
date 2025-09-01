import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import { Navigate } from "react-router";
import Loader from "../Components/Loader/Loader";

const RiderRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loader></Loader>;
  }

  if (!user || role !== "rider") {
    return <Navigate to="/forbidden"></Navigate>;
  }

  return children;
};

export default RiderRoutes;
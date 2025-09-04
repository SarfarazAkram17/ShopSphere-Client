import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Loader from "../Components/Loader/Loader";
import { Navigate } from "react-router";

const SellerRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loader></Loader>;
  }

  if (!user || role !== "seller") {
    return <Navigate to="/forbidden"></Navigate>;
  }

  return children;
};

export default SellerRoutes;
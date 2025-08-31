import Loader from "../../../Components/Loader/Loader";
import useUserRole from "../../../Hooks/useUserRole";
import Forbidden from "../../Forbidden/Forbidden";
import AdminDashboard from "./AdminDashboard";
import CustomerDashboard from "./CustomerDashboard";
import RiderDashboard from "./RiderDashboard";
import StoreOwnerDashboard from "./StoreOwnerDashboard";

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loader></Loader>;
  }

  if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else if (role === "customer") {
    return <CustomerDashboard></CustomerDashboard>;
  } else if (role === "store owner") {
    return <StoreOwnerDashboard></StoreOwnerDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default Dashboard;
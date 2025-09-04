import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import RootLayout from "../Layouts/RootLayout";
import Offers from "../Pages/Offers/Offers";
import AllProducts from "../Pages/AllProducts/AllProducts";
import Loader from "../Components/Loader/Loader";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import DashboardLayout from "../Layouts/DashboardLayout";
import ManageProfile from "../Pages/Dashboard/ManageProfile/ManageProfile";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";
import PrivateRoutes from "../Routes/PrivateRoutes";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import BecomeARider from "../Pages/Dashboard/BecomeARider/BecomeARider";
import BecomeASeller from "../Pages/Dashboard/BecomeASeller/BecomeASeller";
import MyOrders from "../Pages/Dashboard/MyOrders/MyOrders";
import ManageSellers from "../Pages/Dashboard/ManageSellers/ManageSellers";
import PendingSellers from "../Pages/Dashboard/PendingSellers/PendingSellers";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import CustomerRoutes from "../Routes/CustomerRoutes";
import AdminRoutes from "../Routes/AdminRoutes";
import ManageRiders from "../Pages/Dashboard/ManageRiders/ManageRiders";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";

const Home = lazy(() => import("../Pages/Home/Home/Home"));
const About = lazy(() => import("../Pages/About/About"));
const Login = lazy(() => import("../Pages/Login/Login"));
const Register = lazy(() => import("../Pages/Register/Register"));
const ErrorPage = lazy(() => import("../Pages/ErrorPage/ErrorPage"));
const Forbidden = lazy(() => import("../Pages/Forbidden/Forbidden"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <Home></Home>
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <Login></Login>
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <Register></Register>
          </Suspense>
        ),
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <About></About>
          </Suspense>
        ),
      },
      {
        path: "/allProducts",
        Component: AllProducts,
      },
      {
        path: "/offers",
        Component: Offers,
      },
      {
        path: "/products/:id",
        Component: ProductDetails,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      // all user routes
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "manageProfile",
        Component: ManageProfile,
      },

      // customer routes
      {
        path: "myOrders",
        element: (
          <CustomerRoutes>
            <MyOrders></MyOrders>
          </CustomerRoutes>
        ),
      },
      {
        path: "becomeARider",
        element: (
          <CustomerRoutes>
            <BecomeARider></BecomeARider>
          </CustomerRoutes>
        ),
      },
      {
        path: "becomeASeller",
        element: (
          <CustomerRoutes>
            <BecomeASeller></BecomeASeller>
          </CustomerRoutes>
        ),
      },

      // admin routes
      {
        path: "allUsers",
        element: (
          <AdminRoutes>
            <AllUsers></AllUsers>
          </AdminRoutes>
        ),
      },
      {
        path: "allProducts",
        element: (
          <AdminRoutes>
            <AllProducts></AllProducts>
          </AdminRoutes>
        ),
      },
      {
        path: "manageSellers",
        element: (
          <AdminRoutes>
            <ManageSellers></ManageSellers>
          </AdminRoutes>
        ),
      },
      {
        path: "manageRiders",
        element: (
          <AdminRoutes>
            <ManageRiders></ManageRiders>
          </AdminRoutes>
        ),
      },
      {
        path: "pendingSellers",
        element: (
          <AdminRoutes>
            <PendingSellers></PendingSellers>
          </AdminRoutes>
        ),
      },
      {
        path: "pendingRiders",
        element: (
          <AdminRoutes>
            <PendingRiders></PendingRiders>
          </AdminRoutes>
        ),
      },
      {
        path: "assignRider",
        element: (
          <AdminRoutes>
            <AssignRider></AssignRider>
          </AdminRoutes>
        ),
      },
    ],
  },
  {
    path: "/forbidden",
    element: (
      <Suspense fallback={<Loader></Loader>}>
        <Forbidden></Forbidden>
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader></Loader>}>
        <ErrorPage></ErrorPage>
      </Suspense>
    ),
  },
]);
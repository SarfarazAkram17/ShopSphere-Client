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
import ManageUsers from "../Pages/Dashboard/ManageUsers/ManageUsers";
import BecomeARider from "../Pages/Dashboard/BecomeARider/BecomeARider";
import BecomeASeller from "../Pages/Dashboard/BecomeASeller/BecomeASeller";

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
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "manageProfile",
        Component: ManageProfile,
      },
      {
        path: "manageUsers",
        Component: ManageUsers,
      },
      {
        path: "becomeARider",
        Component: BecomeARider,
      },
      {
        path: "becomeASeller",
        Component: BecomeASeller,
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

import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import RootLayout from "../Layouts/RootLayout";
import Offers from "../Pages/Offers/Offers";
import AllProducts from "../Pages/AllProducts/AllProducts";
import Loader from "../Components/Loader/Loader";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";

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
        path: '/products/:id',
        Component: ProductDetails
      }
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

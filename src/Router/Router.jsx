import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import RootLayout from "../Layouts/RootLayout";
import Offers from "../Pages/Offers/Offers";
import Loader from "../Components/Loader/Loader";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import DashboardLayout from "../Layouts/DashboardLayout";
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
import SellerRoutes from "../Routes/SellerRoutes";
import Orders from "../Pages/Dashboard/Orders/Orders";
import MyStore from "../Pages/Dashboard/MyStore/MyStore";
import ChatCustomer from "../Pages/Dashboard/ChatCustomer/ChatCustomer";
import Chat from "../Pages/Dashboard/Chat/Chat";
import LiveChat from "../Pages/Dashboard/LiveChat/LiveChat";
import RiderRoutes from "../Routes/RiderRoutes";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../Pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import UpdateOrderStatus from "../Pages/UpdateOrderStatus/UpdateOrderStatus";
import AddProduct from "../Pages/Dashboard/AddProduct/AddProduct";
import ManageProducts from "../Pages/Dashboard/ManageProducts/ManageProducts";
import EditProduct from "../Pages/Dashboard/EditProduct/EditProduct";
import AllOrders from "../Pages/Dashboard/AllOrders/AllOrders";
import Products from "../Pages/Products/Products";
import AllProducts from "../Pages/Dashboard/AllProducts/AllProducts";
import Profile from "../Pages/Dashboard/Profile/Profile";
import PayoutRequests from "../Pages/Dashboard/PayoutRequests/PayoutRequests";
import RiderRequestPayout from "../Pages/Dashboard/RiderRequestPayout/RiderRequestPayout";
import SellerRequestPayout from "../Pages/Dashboard/SellerRequestPayout/SellerRequestPayout";
import RiderChatSupport from "../Pages/Dashboard/RiderChatSupport/RiderChatSupport";
import SellerChatSupport from "../Pages/Dashboard/SellerChatSupport/SellerChatSupport";

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
        path: "/products",
        Component: Products,
      },
      {
        path: "/offers",
        Component: Offers,
      },
      {
        path: "/products/:productId",
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
        path: "profile",
        Component: Profile,
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
      {
        path: "chat",
        element: (
          <CustomerRoutes>
            <Chat></Chat>
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
        path: "payoutRequests",
        element: (
          <AdminRoutes>
            <PayoutRequests></PayoutRequests>
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
        path: "allOrders",
        element: (
          <AdminRoutes>
            <AllOrders></AllOrders>
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
      {
        path: "updateOrderStatus",
        element: (
          <AdminRoutes>
            <UpdateOrderStatus></UpdateOrderStatus>
          </AdminRoutes>
        ),
      },
      {
        path: "liveChat",
        element: (
          <AdminRoutes>
            <LiveChat></LiveChat>
          </AdminRoutes>
        ),
      },

      // seller routes
      {
        path: "addProduct",
        element: (
          <SellerRoutes>
            <AddProduct></AddProduct>
          </SellerRoutes>
        ),
      },
      {
        path: "manageProducts",
        element: (
          <SellerRoutes>
            <ManageProducts></ManageProducts>
          </SellerRoutes>
        ),
      },
      {
        path: "editProduct/:productId",
        element: (
          <SellerRoutes>
            <EditProduct></EditProduct>
          </SellerRoutes>
        ),
      },
      {
        path: "orders",
        element: (
          <SellerRoutes>
            <Orders></Orders>
          </SellerRoutes>
        ),
      },
      {
        path: "seller/requestPayout",
        element: (
          <SellerRoutes>
            <SellerRequestPayout></SellerRequestPayout>
          </SellerRoutes>
        ),
      },
      {
        path: "myStore",
        element: (
          <SellerRoutes>
            <MyStore></MyStore>
          </SellerRoutes>
        ),
      },
      {
        path: "chatCustomer",
        element: (
          <SellerRoutes>
            <ChatCustomer></ChatCustomer>
          </SellerRoutes>
        ),
      },
      {
        path: "seller/chatSupport",
        element: (
          <SellerRoutes>
            <SellerChatSupport></SellerChatSupport>
          </SellerRoutes>
        ),
      },

      // rider routes
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoutes>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoutes>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoutes>
            <CompletedDeliveries></CompletedDeliveries>
          </RiderRoutes>
        ),
      },
      {
        path: "rider/requestPayout",
        element: (
          <RiderRoutes>
            <RiderRequestPayout></RiderRequestPayout>
          </RiderRoutes>
        ),
      },
      {
        path: "rider/chatSupport",
        element: (
          <RiderRoutes>
            <RiderChatSupport></RiderChatSupport>
          </RiderRoutes>
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
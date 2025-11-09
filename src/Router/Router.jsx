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
import Cart from "../Pages/Cart/Cart";
import ChangePassword from "../Pages/Dashboard/ChangePassword/ChangePassword";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "../Pages/TermsConditions/TermsConditions";
import CookiePolicy from "../Pages/CookiePolicy/CookiePolicy";
import Support from "../Pages/Support/Support";
import AddressBook from "../Pages/Dashboard/AddressBook/AddressBook";
import ProtectAuthRoutes from "../Routes/ProtectAuthRoutes";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import Checkout from "../Pages/Checkout/Checkout";

const Home = lazy(() => import("../Pages/Home/Home/Home"));
const About = lazy(() => import("../Pages/About/About"));
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
          <ProtectAuthRoutes>
            <Login></Login>
          </ProtectAuthRoutes>
        ),
      },
      {
        path: "/register",
        element: (
          <ProtectAuthRoutes>
            <Register></Register>
          </ProtectAuthRoutes>
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
        path: "/privacy-policy",
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <PrivacyPolicy></PrivacyPolicy>
          </Suspense>
        ),
      },
      {
        path: "/terms-conditions",
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <TermsConditions></TermsConditions>
          </Suspense>
        ),
      },
      {
        path: "/cookie-policy",
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <CookiePolicy></CookiePolicy>
          </Suspense>
        ),
      },
      {
        path: "/support",
        element: (
          <Suspense fallback={<Loader></Loader>}>
            <Support></Support>
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
      {
        path: "/cart",
        element: (
          <PrivateRoutes>
            <CustomerRoutes>
              <Cart></Cart>
            </CustomerRoutes>
          </PrivateRoutes>
        ),
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoutes>
            <CustomerRoutes>
              <Checkout></Checkout>
            </CustomerRoutes>
          </PrivateRoutes>
        ),
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
      {
        path: "changePassword",
        Component: ChangePassword,
      },

      // customer routes
      {
        path: "addressBook",
        element: (
          <CustomerRoutes>
            <AddressBook></AddressBook>
          </CustomerRoutes>
        ),
      },
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
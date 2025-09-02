import Navbar from "../Components/Shared/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Shared/Footer";

const RootLayout = () => {
  return (
    <div>
      <div className="sticky z-50 top-0">
        <Navbar></Navbar>
      </div>
      <div className="my-8">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
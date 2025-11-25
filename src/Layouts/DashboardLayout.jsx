import { Outlet } from "react-router";
import DashboardSidebar from "../Components/Shared/Dashboard/DashboardSidebar";
import DashboardNavbar from "../Components/Shared/Dashboard/DashboardNavbar";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Run once on mount
    handleResize();

    // Listen for resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden max-w-[1700px] mx-auto">
      {/* Sidebar (fixed height) */}
      <DashboardSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area (scrollable) */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        <DashboardNavbar setIsOpen={setIsOpen} />
        <div className="px-5 pt-12 pb-16 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
import { Outlet } from "react-router";
import DashboardSidebar from "../Components/Shared/DashboardSidebar";
import DashboardNavbar from "../Components/Shared/DashboardNavbar";
import { useState } from "react";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (fixed height) */}
      <DashboardSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area (scrollable) */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <DashboardNavbar setIsOpen={setIsOpen} />
        <div className="pt-12 pb-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
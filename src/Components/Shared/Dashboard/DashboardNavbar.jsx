import { AiOutlineMenuUnfold } from "react-icons/ai";
import { Link } from "react-router";
import LazyImage from "../../LazyImage/LazyImage";

const DashboardNavbar = ({ setIsOpen }) => {
  return (
    <header className="lg:hidden max-lg:sticky top-0 backdrop-blur-2xl px-4 py-2 h-14 rounded-sm w-full shadow-md z-10">
      <section className="max-w-[1500px] w-full mx-auto flex justify-between items-center">
        {/* Mobile Hamburger */}
        <button
          className="btn rounded-sm flex items-center py-2 px-3 mr-3"
          onClick={() => setIsOpen(true)}
        >
          <AiOutlineMenuUnfold size={20} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 max-lg:flex-1">
          <LazyImage
            src="/logo.png"
            alt="ShopSphere Logo"
            className="h-10 lg:h-12 w-auto"
            priority={true}
          />
          <span className="text-[#392B12] font-bold text-lg">ShopSphere</span>
        </Link>
      </section>
    </header>
  );
};

export default DashboardNavbar;
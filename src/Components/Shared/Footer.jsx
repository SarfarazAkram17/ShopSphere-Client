import { Link, NavLink } from "react-router";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from "/logo.png";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  const normalClass =
    "px-3 py-0.5 block w-fit text-sm rounded-full font-bold hover:text-primary hover:bg-primary/10";

  const navLinks = (
    <>
      <NavLink to="/" className={`${normalClass}`}>
        Home
      </NavLink>
      <NavLink to="/about" className={`${normalClass}`}>
        About
      </NavLink>
      <NavLink to="/allProducts" className={`${normalClass}`}>
        All Products
      </NavLink>
      <NavLink to="/offers" className={`${normalClass}`}>
        Offers
      </NavLink>
    </>
  );
  return (
    <footer className="bg-base-200 text-base-content px-4 mt-10 border-t border-gray-200">
      <div className="max-w-[1500px] mx-auto py-10 grid md:grid-cols-3 gap-6">
        {/* Brand Section */}
        <div>
          <Link to="/" className="flex items-center gap-1">
            <img src={logo} alt="ShopSphere Logo" className="h-12 w-auto" />
            <span className="text-[#392B12] font-bold sm:text-xl">
              ShopSphere
            </span>
          </Link>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            ShopSphere is your trusted online marketplace, connecting customers
            with verified sellers and fast, reliable riders.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">{navLinks}</ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-bold mb-3">Get In Touch</h3>
          <p className="text-sm mb-2">📍 Dhaka, Bangladesh</p>
          <p className="text-sm mb-2">📧 support@shopsphere.com</p>
          <p className="text-sm mb-2">📞 +880 1234 567 890</p>

          {/* Social Icons */}
          <div className="flex space-x-3 mt-4">
            <a
              href="https://www.facebook.com/sarfarazakram17"
              target="_blank"
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/sarfarazakram17"
              target="_blank"
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/SarfarazAkram17"
              target="_blank"
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.github.com/SarfarazAkram17"
              target="_blank"
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/sarfarazakram"
              target="_blank"
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

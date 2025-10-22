import { Link, NavLink } from "react-router";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from "/logo.png";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";

const Footer = () => {
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/products", label: "Products", end: true },
    { to: "/offers", label: "Offers" },
  ];

  return (
    <footer className="bg-base-300">
      {/* Main Footer Content */}
      <div className="max-w-[1500px] px-4 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="ShopSphere Logo" className="h-12 w-auto" />
              <span className="text-[#392B12] font-bold text-2xl">
                ShopSphere
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
              Bangladesh's premier multi-vendor e-commerce platform connecting
              customers, sellers, and riders in one seamless ecosystem. Shop
              smart, sell better, deliver faster.
            </p>

            {/* Social Links */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">
                Follow Us
              </h4>
              <div className="flex space-x-3">
                <a
                  href="https://www.facebook.com/sarfarazakram17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={23} />
                </a>
                <a
                  href="https://www.instagram.com/sarfarazakram17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram size={23} />
                </a>
                <a
                  href="https://x.com/SarfarazAkram17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaXTwitter size={23} />
                </a>
                <a
                  href="https://www.github.com/SarfarazAkram17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <FaGithub size={23} />
                </a>
                <a
                  href="https://www.linkedin.com/in/sarfarazakram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn size={23} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-base">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className="px-3 py-0.5 text-xs lg:text-sm rounded-full font-bold hover:text-primary hover:bg-primary/10"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-base">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-600">
                <MdLocationOn className="text-xl mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-sm">
                  House #123, Road #456
                  <br />
                  Dhaka 1212, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                <MdEmail className="text-xl flex-shrink-0 text-primary" />
                <a href="mailto:support@shopsphere.com" className="text-sm">
                  support@shopsphere.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                <MdPhone className="text-xl flex-shrink-0 text-primary" />
                <a href="tel:+8801234567890" className="text-sm">
                  +880 1234 567 890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-base-300">
        <div className="max-w-[1500px] px-4 mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p className="flex items-center gap-1">
              © {new Date().getFullYear()} ShopSphere. All rights reserved. Made
              with <IoMdHeart className="text-error mx-1" /> in Bangladesh
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/privacy-policy"
                className="hover:text-primary transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-conditions"
                className="hover:text-primary transition-colors font-medium"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
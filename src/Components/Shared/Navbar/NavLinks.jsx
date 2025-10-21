import { NavLink } from "react-router";

const NavLinks = ({ onLinkClick }) => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/products", label: "Products", end: true },
    { to: "/offers", label: "Offers" },
  ];

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          onClick={onLinkClick}
          className="px-3 py-0.5 text-xs lg:text-sm rounded-full font-bold hover:text-primary hover:bg-primary/10"
          to={link.to}
          end={link.end}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;
import { Link } from "react-router";
import Lottie from "lottie-react";
import {
  FaHome,
  FaArrowLeft,
  FaShoppingCart,
  FaShoppingBag,
} from "react-icons/fa";
import errorAnimation from "../../assets/animations/error.json";
import { TbLayoutDashboard } from "react-icons/tb";

const ErrorPage = () => {
  const quickLinks = [
    { name: "Shop All Products", path: "/products", icon: FaShoppingBag },
    { name: "View Cart", path: "/cart", icon: FaShoppingCart },
    { name: "My Dashboard", path: "/dashboard", icon: TbLayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700"></div>
      <div className="absolute -bottom-8 left-1/2 w-36 h-36 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <div className="flex flex-col items-center text-center">
            {/* Lottie Animation */}
            <div className="w-full max-w-md mb-6">
              <Lottie
                animationData={errorAnimation}
                loop={true}
                className="w-full drop-shadow-lg"
              />
            </div>

            {/* Error Code Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
              <span className="animate-pulse">●</span>
              <span>ERROR 404</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Lost in ShopSphere?
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-3 leading-relaxed">
              Looks like this page went out of stock! But don't worry, we have
              plenty of other amazing things for you to discover.
            </p>

            <p className="text-gray-500 text-sm mb-8">
              The page you're looking for might have been moved, deleted, or
              never existed.
            </p>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              <Link
                to="/"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <FaHome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Back to Home
              </Link>

              <Link
                to={-1}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-purple-300 transform hover:scale-105 transition-all duration-300"
              >
                <FaArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Link>
            </div>

            {/* Quick Links Section */}
            <div className="w-full border-t border-gray-200 pt-8">
              <h2 className="text-gray-700 font-semibold mb-4 text-lg">
                Or explore these popular sections:
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={index}
                      to={link.path}
                      className="group flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md"
                    >
                      <Icon className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-700 group-hover:text-purple-700">
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Fun Message */}
            <div className="mt-8 text-sm text-gray-500 italic">
              "Even the best shoppers take a wrong turn sometimes!" 🛍️
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
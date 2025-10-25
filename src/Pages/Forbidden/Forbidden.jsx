import { Link } from "react-router";
import { MdBlock, MdLock, MdSecurity } from "react-icons/md";
import { FaHome, FaShieldAlt, FaUserShield } from "react-icons/fa";
import { BiShield } from "react-icons/bi";

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-700"></div>
      <div className="absolute -bottom-8 left-1/2 w-36 h-36 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000"></div>

      {/* Floating Shield Icons */}
      <div className="absolute top-32 right-1/4 opacity-10 animate-bounce">
        <FaShieldAlt size={60} className="text-red-500" />
      </div>
      <div className="absolute bottom-32 left-1/4 opacity-10 animate-bounce delay-500">
        <BiShield size={70} className="text-orange-500" />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          <div className="flex flex-col items-center text-center">
            {/* Animated Icon Container */}
            <div className="relative mb-6">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 w-40 h-40 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-full animate-spin opacity-20 blur-sm" style={{ animationDuration: '3s' }}></div>
              
              {/* Main icon background */}
              <div className="relative bg-gradient-to-br from-red-100 to-orange-100 p-8 rounded-full shadow-xl">
                <div className="relative">
                  <MdBlock className="text-red-600" size={85} />
                  {/* Small lock overlay */}
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <MdLock className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Code Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
              <MdSecurity className="animate-pulse" size={18} />
              <span>ERROR 403</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Access Denied
            </h1>

            {/* Subtitle */}
            <p className="text-gray-700 text-lg md:text-xl max-w-2xl mb-3 leading-relaxed font-medium">
              Oops! This isn't your data to view.
            </p>

            <p className="text-gray-600 text-base mb-2">
              You've attempted to access another user's private information. For security and privacy reasons, this action is not allowed.
            </p>

            <p className="text-gray-500 text-sm mb-8">
              If you believe this is an error, please contact support or check your account permissions.
            </p>

            {/* Security Info Box */}
            <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg mb-8">
              <div className="flex items-start gap-3">
                <FaUserShield className="text-red-600 mt-1 flex-shrink-0" size={24} />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-1">Privacy Protected</h3>
                  <p className="text-sm text-gray-600">
                    ShopSphere takes user privacy seriously. All personal data is protected and only accessible by the account owner.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                to="/" 
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <FaHome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Return to Home
              </Link>
              
              <Link 
                to="/dashboard"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-orange-300 transform hover:scale-105 transition-all duration-300"
              >
                <FaUserShield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                My Dashboard
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-sm text-gray-500">
              Need help? <Link to="/support" className="text-red-600 hover:text-orange-600 font-medium underline">Contact Support</Link>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
import {
  FaHeadset,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaDiscord,
  FaFacebook,
} from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { HiMail } from "react-icons/hi";
import { FaXTwitter } from "react-icons/fa6";

const Support = () => {
  const contactMethods = [
    {
      icon: FaEnvelope,
      title: "Email Support",
      info: "support@shopsphere.com",
      description: "Response within 24 hours",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaPhone,
      title: "Phone Support",
      info: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FaComments,
      title: "Live Chat",
      info: "Available Now",
      description: "Average wait: 2 minutes",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const supportHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
    { day: "Sunday", hours: "Closed" },
  ];

  const socialLinks = [
    { icon: FaXTwitter, name: "X", link: "@ShopSphere" },
    { icon: FaFacebook, name: "Facebook", link: "fb.com/shopsphere" },
    { icon: FaDiscord, name: "Discord", link: "discord.gg/shopsphere" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1500px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
            <FaHeadset size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Get instant support from our dedicated team. We're here to make your
            ShopSphere experience amazing!
          </p>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-16">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-10">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${method.color} rounded-xl mb-4 shadow-lg`}
                >
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {method.title}
                </h3>
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  {method.info}
                </p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Support Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <BiSupport className="text-purple-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-800">
                  Get In Touch
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our support team is available to assist you with any
                    questions or concerns. Choose your preferred contact method
                    above and we'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Before You Contact Us
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    Please check our FAQ section below - you might find the
                    answer to your question right away! For order-related
                    inquiries, have your order number ready.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>
                        Check your order status in your account dashboard
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Review our shipping and return policies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Browse our help center for detailed guides</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <HiMail className="text-purple-600" size={28} />
                    <h3 className="text-xl font-bold text-gray-800">
                      Email Us Directly
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Send us an email and we'll respond within 24 hours. For
                    urgent matters, please use live chat or phone support.
                  </p>
                  <a
                    href="mailto:support@shopsphere.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FaEnvelope size={18} />
                    support@shopsphere.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Connect With Us
              </h2>
              <p className="text-gray-600 mb-6">
                Follow us on social media for updates, promotions, and community
                support.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 cursor-pointer"
                    >
                      <Icon className="text-purple-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {social.name}
                        </p>
                        <p className="text-xs text-gray-600">{social.link}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaClock className="text-purple-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">
                  Support Hours
                </h3>
              </div>
              <div className="space-y-3">
                {supportHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0"
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      {schedule.day}
                    </span>
                    <span className="text-sm text-gray-600 text-right">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Our Commitment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Average Response</span>
                    <span className="text-sm font-bold">2 hours</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Resolution Rate</span>
                    <span className="text-sm font-bold">98%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-bold">4.9/5</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <FaShieldAlt className="text-green-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">
                  Secure Support
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                All communications are encrypted and your personal information
                is protected according to our privacy policy.
              </p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaMapMarkerAlt className="text-purple-600 mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Visit Our Office
          </h2>
          <p className="text-gray-600 text-lg mb-2">ShopSphere Headquarters</p>
          <p className="text-gray-600">
            123 E-Commerce Boulevard, Suite 500
            <br />
            San Francisco, CA 94105
            <br />
            United States
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;

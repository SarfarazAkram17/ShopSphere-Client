import { motion } from "framer-motion";
import {
  FaStore,
  FaShoppingCart,
  FaMotorcycle,
  FaUserShield,
  FaCheckCircle,
  FaUsers,
  FaHandshake,
  FaRocket,
} from "react-icons/fa";
import { MdSecurity, MdPayment, MdSupport } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { useNavigate } from "react-router";

const About = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <FaStore className="text-4xl text-primary" />,
      title: "Multi-Vendor Platform",
      description:
        "Empowering sellers to create their own stores and reach millions of customers nationwide.",
    },
    {
      icon: <FaShoppingCart className="text-4xl text-primary" />,
      title: "Seamless Shopping",
      description:
        "Discover thousands of products from verified sellers with easy checkout and secure payments.",
    },
    {
      icon: <FaMotorcycle className="text-4xl text-primary" />,
      title: "Fast Delivery",
      description:
        "Our dedicated rider network ensures your orders arrive quickly and safely at your doorstep.",
    },
    {
      icon: <FaUserShield className="text-4xl text-primary" />,
      title: "Admin Control",
      description:
        "Comprehensive management system ensuring quality, security, and smooth operations.",
    },
  ];

  const roles = [
    {
      icon: <FaShoppingCart className="text-5xl mb-4 text-orange-500" />,
      title: "Customers",
      description: "Browse, compare, and purchase from thousands of products",
      features: [
        "Easy ordering",
        "Secure payments",
        "Order tracking",
        "24/7 support",
      ],
    },
    {
      icon: <FaStore className="text-5xl mb-4 text-blue-500" />,
      title: "Sellers",
      description: "Build your online business and reach a wider audience",
      features: [
        "Create your store",
        "List products",
        "Manage orders",
        "Track earnings",
      ],
    },
    {
      icon: <FaMotorcycle className="text-5xl mb-4 text-green-500" />,
      title: "Riders",
      description: "Earn by delivering orders with flexible working hours",
      features: [
        "Flexible schedule",
        "Quick payouts",
        "GPS tracking",
        "Performance bonuses",
      ],
    },
    {
      icon: <FaUserShield className="text-5xl mb-4 text-purple-500" />,
      title: "Admins",
      description: "Oversee platform operations and ensure quality service",
      features: [
        "User management",
        "Order oversight",
        "Analytics",
        "Dispute resolution",
      ],
    },
  ];

  const values = [
    {
      icon: <MdSecurity />,
      title: "Security",
      description: "Your data and transactions are protected",
    },
    {
      icon: <FaCheckCircle />,
      title: "Quality",
      description: "Verified sellers and authentic products",
    },
    {
      icon: <MdPayment />,
      title: "Fair Pricing",
      description: "Competitive prices and transparent fees",
    },
    {
      icon: <MdSupport />,
      title: "Support",
      description: "24/7 customer assistance",
    },
    {
      icon: <FaHandshake />,
      title: "Trust",
      description: "Building lasting relationships",
    },
    {
      icon: <BiWorld />,
      title: "Accessibility",
      description: "Serving customers nationwide",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Sellers" },
    { number: "500K+", label: "Happy Customers" },
    { number: "1M+", label: "Products Listed" },
    { number: "2K+", label: "Delivery Riders" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1500px] px-4 mx-auto py-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to ShopSphere
            </h1>
            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Bangladesh's Premier Multi-Vendor E-Commerce Platform
            </p>
            <p className="text-base md:text-lg max-w-4xl mx-auto text-white/80">
              Connecting customers, sellers, riders, and admins in one seamless
              ecosystem. We're revolutionizing online shopping by creating
              opportunities for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-[1500px] px-4 mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-primary"
        >
          <div className="flex items-center justify-center mb-6">
            <FaRocket className="text-5xl text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            To create a thriving digital marketplace that empowers
            entrepreneurs, provides customers with endless choices, creates
            employment opportunities for riders, and maintains the highest
            standards of service through dedicated administration.
          </p>
        </motion.div>
      </section>

      {/* Core Features */}
      <section className="max-w-[1500px] px-4 mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Roles Section */}
      <section className="bg-white py-16">
        <div className="max-w-[1500px] px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
              Our Ecosystem
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              ShopSphere brings together four key roles working in harmony
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {roles.map((role, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
                >
                  <div className="flex justify-center">{role.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {role.description}
                  </p>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
        <div className="max-w-[1500px] px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Growing Together
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-[1500px] px-4 mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-start space-x-4 border border-gray-100"
              >
                <div className="text-3xl text-primary flex-shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-[1500px] px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
              How ShopSphere Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg text-center h-full">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Sellers List Products
                  </h3>
                  <p className="text-gray-600">
                    Vendors create stores and add their products with details
                    and pricing
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-lg text-center h-full">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Customers Order
                  </h3>
                  <p className="text-gray-600">
                    Browse products, add to cart, and place orders with secure
                    payment
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg text-center h-full">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Riders Deliver
                  </h3>
                  <p className="text-gray-600">
                    Assigned riders pick up and deliver orders to customers
                    safely
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg text-center h-full">
                  <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Admins Manage
                  </h3>
                  <p className="text-gray-600">
                    Platform oversight, quality control, and dispute resolution
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1500px] px-4 mx-auto py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl shadow-2xl p-12 text-center text-white"
        >
          <FaUsers className="text-6xl mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the ShopSphere Community
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            Whether you're looking to shop, sell, deliver, or manage - there's a
            place for you here
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/products")}
              className="btn bg-white text-primary hover:bg-gray-100 border-0 px-8"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate("/dashboard/becomeASeller")}
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8"
            >
              Become a Seller
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;

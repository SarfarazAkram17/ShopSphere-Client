import { FaHandshake } from "react-icons/fa";

export const PageHeader = () => (
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded-2xl mb-4 shadow-lg">
      <FaHandshake className="w-8 h-8 text-white" />
    </div>
    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
      Become a Seller
    </h1>
    <p className="text-gray-600 max-w-3xl mx-auto text-base leading-relaxed">
      Join ShopSphere as a seller and grow your business online! Fill out the
      application form with your personal and store details. Once approved,
      you'll gain access to the seller dashboard to manage products, track
      orders, and receive secure payouts.
    </p>
  </div>
);

export default PageHeader;
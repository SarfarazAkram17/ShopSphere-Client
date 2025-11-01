import { FaMotorcycle } from "react-icons/fa";

export const PageHeader = () => (
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded-2xl mb-4 shadow-lg">
      <FaMotorcycle className="w-8 h-8 text-white" />
    </div>
    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
      Become a Rider
    </h1>
    <p className="text-gray-600 max-w-3xl mx-auto text-base leading-relaxed">
      Join our delivery team and start earning by delivering products to
      customers. Simply fill out the form with your details and experience, and
      once approved, you'll get access to your Rider Dashboard to manage orders
      and track earnings.
    </p>
  </div>
);

export default PageHeader;
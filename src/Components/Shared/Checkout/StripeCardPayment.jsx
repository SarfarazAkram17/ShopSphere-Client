import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import visa from "../../../assets/images/visa.png";
import master from "../../../assets/images/mastar.png";
import amex from "../../../assets/images/amex.png";
import discover from "../../../assets/images/discover.png";
import MiniLoader from "../../Loader/MiniLoader";
import { FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import LazyImage from "../../LazyImage/LazyImage";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

// Card Element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

// Card Payment Form Component
const CardPaymentForm = ({
  createdOrder,
  totalAmount,
  userEmail,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { data: orderInfo, isPending } = useQuery({
    queryKey: ["orders", createdOrder.id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/orders/${createdOrder.id}?email=${userEmail}`
      );
      return res.data;
    },
  });

  if (isPending) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (orderInfo.paymentStatus === "paid") {
      toast.info("Order is already paid");
      navigate("/dashboard/myOrders");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Step 1: Create payment method first
      const card = elements.getElement(CardElement);

      if (!card) {
        throw new Error("Card element not found");
      }

      const { error: pmError } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      // Step 2: Create payment intent on your backend
      const { data } = await axiosSecure.post(
        `/payments/create-payment-intent?email=${userEmail}`,
        {
          amount: parseFloat(totalAmount * 100),
        }
      );

      const { clientSecret } = data;

      // Step 3: Confirm card payment with Stripe
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: orderInfo.billingAddress.name,
              email: orderInfo.billingAddress.email,
            },
          },
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Step 4: Verify payment was successful
      if (paymentIntent.status === "succeeded") {
        // Step 5: Update order with payment details
        await axiosSecure.post(`/payments?email=${userEmail}`, {
          orderId: createdOrder.id,
          amount: Number((paymentIntent.amount / 100).toFixed(2)),
          paymentMethod: "card",
          transactionId: paymentIntent.id,
          paymentStatus: "paid",
        });

        onSuccess();
      } else {
        throw new Error("Payment was not completed");
      }
    } catch (error) {
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Accepted Cards */}
      <div className="flex gap-2 items-center mb-4">
        <LazyImage src={visa} alt="Visa" className="h-13.5" priority={true} />
        <LazyImage
          src={master}
          alt="Mastercard"
          className="h-13.5"
          priority={true}
        />
        <LazyImage src={amex} alt="Amex" className="h-13.5" priority={true} />
        <LazyImage
          src={discover}
          alt="Discover"
          className="h-8"
          priority={true}
        />
      </div>

      {/* Card Details (Stripe CardElement) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details <span className="text-red-500">*</span>
        </label>
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your payment information is secure and encrypted
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <FaExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full btn btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <MiniLoader /> Processing Payment...
          </span>
        ) : (
          `Pay ৳${totalAmount.toFixed(2)}`
        )}
      </button>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
};

// Export the wrapped component
export const StripeCardPayment = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CardPaymentForm {...props} />
    </Elements>
  );
};
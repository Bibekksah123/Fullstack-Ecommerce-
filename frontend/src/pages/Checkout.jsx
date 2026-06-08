import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCreateOrderMutation, useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '../features/user/userApi';
import useCart from '../hooks/useCart';
import AddressStep from '../components/checkout/AddressStep';
import ShippingStep from '../components/checkout/ShippingStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ReviewStep from '../components/checkout/ReviewStep';
import Breadcrumb from '../components/layout/Breadcrumb';
import { toast } from 'react-hot-toast';
import formatCurrency from '../utils/formatCurrency';

// Load stripe client side
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51PxLh9RoP2zB9zJ5oMh8gH1vIeK1Gz');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();

  const [createOrderApi] = useCreateOrderMutation();
  const [createIntentApi] = useCreatePaymentIntentMutation();
  const [confirmPaymentApi] = useConfirmPaymentMutation();

  const checkoutState = location.state || { subtotal: cartSubtotal, shippingCost: 150, discount: 0, coupon: null };

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingCost, setShippingCost] = useState(checkoutState.shippingCost);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const steps = ['Address', 'Shipping', 'Payment', 'Review'];

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handleBackStep = () => setStep((prev) => prev - 1);

  const handleShippingSelect = (id, cost) => {
    setShippingMethod(id);
    setShippingCost(cost);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setStripeError(null);

    // 1. Prepare items mapping for backend order items schema
    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      variant: {
        size: item.variant?.Size || undefined,
        color: item.variant?.Color || undefined,
        storage: item.variant?.Storage || undefined,
      },
    }));

    // 2. Prepare address mapping to backend shippingAddress format
    const shippingDetails = {
      fullName: shippingAddress.name,
      phone: shippingAddress.phone,
      addressLine1: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state || 'N/A',
      postalCode: shippingAddress.postalCode || '00000',
      country: shippingAddress.country || 'Nepal',
    };

    try {
      // 3. Create initial order in pending status
      const orderRes = await createOrderApi({
        items: orderItems,
        shippingAddress: shippingDetails,
        paymentMethod,
        couponCode: checkoutState.coupon?.code || undefined,
      }).unwrap();

      const createdOrder = orderRes.data;

      // 4. Handle COD vs Stripe
      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully with Cash on Delivery!');
        clearCart();
        navigate(`/order/${createdOrder._id}/success`);
      } else {
        // Stripe flow
        if (!stripe || !elements) {
          toast.error('Stripe has not loaded. Please try again.');
          setIsProcessing(false);
          return;
        }

        // Call backend payment intent endpoint
        const intentRes = await createIntentApi({
          amount: createdOrder.totalPrice,
          orderId: createdOrder._id,
        }).unwrap();

        const cardElement = elements.getElement(CardElement);
        const { paymentIntent, error } = await stripe.confirmCardPayment(intentRes.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingAddress.name,
              phone: shippingAddress.phone,
              email: createdOrder.user?.email || '',
            },
          },
        });

        if (error) {
          setStripeError(error.message);
          toast.error(`Stripe Error: ${error.message}`);
          setIsProcessing(false);
          return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          // Confirm payment on backend
          await confirmPaymentApi({
            orderId: createdOrder._id,
            paymentIntentId: paymentIntent.id,
          }).unwrap();

          toast.success('Payment succeeded! Order confirmed.');
          clearCart();
          navigate(`/order/${createdOrder._id}/success`);
        }
      }
    } catch (err) {
      toast.error(err.data?.message || 'Failed to place order. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 items-start">
      
      {/* Wizard Forms */}
      <div className="lg:col-span-2 card p-6 md:p-8 space-y-8">
        
        {/* Step headers */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-150 dark:border-dark-800">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;

            return (
              <div key={s} className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-sm transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'bg-gray-150 dark:bg-dark-800 text-dark-500'
                }`}>
                  {stepNum}
                </span>
                <span className={`hidden sm:inline font-semibold text-xs uppercase tracking-wider ${
                  isActive ? 'text-primary-500' : 'text-dark-500'
                }`}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form sections */}
        {step === 1 && (
          <AddressStep
            selectedAddress={shippingAddress}
            onSelect={setShippingAddress}
            onNext={handleNextStep}
          />
        )}
        {step === 2 && (
          <ShippingStep
            selectedOption={shippingMethod}
            onSelect={handleShippingSelect}
            onBack={handleBackStep}
            onNext={handleNextStep}
          />
        )}
        {step === 3 && (
          <PaymentStep
            paymentMethod={paymentMethod}
            onSelect={setPaymentMethod}
            grandTotal={checkoutState.grandTotal}
            stripeError={stripeError}
            isProcessing={isProcessing}
            onBack={handleBackStep}
            onNext={handleNextStep}
          />
        )}
        {step === 4 && (
          <ReviewStep
            cartItems={cartItems}
            address={shippingAddress}
            shippingMethod={shippingMethod}
            paymentMethod={paymentMethod}
            subtotal={checkoutState.subtotal || cartSubtotal}
            shippingCost={shippingCost}
            discount={checkoutState.discount}
            isProcessing={isProcessing}
            onBack={handleBackStep}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>

      {/* Mini summary card */}
      <div className="card p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs">
          Order Summary
        </h4>
        <div className="space-y-3.5 text-sm font-semibold text-dark-600 dark:text-dark-400">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span>{formatCurrency(checkoutState.subtotal || cartSubtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
          </div>
          {checkoutState.discount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Promo Discount</span>
              <span>-{formatCurrency(checkoutState.discount)}</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export const Checkout = () => {
  return (
    <div className="section py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Checkout' }]} />
      <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
        Checkout Shipping & Payment
      </h2>
      
      {/* Mount Stripe Elements */}
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;

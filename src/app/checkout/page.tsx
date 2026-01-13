"use client";

import { useState, useEffect, useContext, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  Banknote,
  Truck,
  Shield,
  Package,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { UserContext } from "@/app/_context/UserContext";

// Initialize Stripe
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    discountpercentage: number;
  };
};

const paymentMethods = [
  {
    id: "card",
    name: "Pay with Card (Stripe)",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive",
    icon: Banknote,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("card");

  // Check if canceled from Stripe
  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      setError("Payment was canceled. Please try again.");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return;
      
      try {
        const res = await fetch(`/api/cart/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setCartItems(data.data);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user?.id]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleStripePayment = async () => {
    const shippingAddress = `${fullName}, ${address}, ${city}, ${state} - ${pincode}, Phone: ${phone}`;

    try {
      const res = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress }),
      });

      const data = await res.json();

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.message || "Failed to create payment session");
        setPlacing(false);
      }
    } catch (error) {
      console.error("Stripe error:", error);
      setError("Failed to initiate payment. Please try again.");
      setPlacing(false);
    }
  };

  const handleCODOrder = async () => {
    const shippingAddress = `${fullName}, ${address}, ${city}, ${state} - ${pincode}, Phone: ${phone}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod: "Cash on Delivery",
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/checkout/success?orderId=${data.data.id}&orderNumber=${data.data.orderNumber}`);
      } else {
        setError(data.message || "Failed to place order");
        setPlacing(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      setError("Please fill all shipping details");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setPlacing(true);

    if (selectedPayment === "card") {
      await handleStripePayment();
    } else {
      await handleCODOrder();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to your cart before checkout</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-indigo-600 transition">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href={`/cart/${user?.id}`} className="text-gray-500 hover:text-indigo-600 transition">Cart</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  Shipping Address
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main Street, Apartment 4B"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Maharashtra"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400001"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedPayment === method.id;

                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setSelectedPayment(method.id)}
                          className="sr-only"
                        />
                        <div className={`p-3 rounded-lg ${method.bgColor}`}>
                          <Icon className={`h-6 w-6 ${method.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-6 w-6 text-indigo-600" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Stripe Test Cards Info */}
                {selectedPayment === "card" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">🧪 Test Mode - Use these cards:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>✅ Success: <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code></li>
                      <li>❌ Decline: <code className="bg-blue-100 px-1 rounded">4000 0000 0000 0002</code></li>
                      <li>📅 Expiry: Any future date | CVC: Any 3 digits</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.thumbnail ? (
                          <Image
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-300 m-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.title}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : "text-gray-900"}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (18% GST)</span>
                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  disabled={placing}
                  className="w-full mt-6 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
                >
                  {placing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      {selectedPayment === "card" ? "Redirecting to Payment..." : "Placing Order..."}
                    </>
                  ) : selectedPayment === "card" ? (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay ${total.toFixed(2)} with Stripe
                    </>
                  ) : (
                    <>Place Order - ${total.toFixed(2)}</>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Fast Delivery
                  </span>
                </div>

                {/* Stripe Badge */}
                {selectedPayment === "card" && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">Powered by</p>
                    <p className="text-sm font-bold text-indigo-600">Stripe</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

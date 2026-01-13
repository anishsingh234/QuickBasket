"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  Home,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  
  // Can come from COD order or Stripe payment
  const orderIdParam = searchParams.get("orderId");
  const orderNumberParam = searchParams.get("orderNumber");
  const sessionId = searchParams.get("session_id"); // From Stripe

  const [orderNumber, setOrderNumber] = useState(orderNumberParam || "");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderId, setOrderId] = useState(orderIdParam || "");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verify Stripe payment and create order
  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId && !orderNumber) {
        setLoading(true);
        try {
          const res = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });

          const data = await res.json();

          if (data.success) {
            setOrderNumber(data.order.orderNumber);
            setOrderId(data.order.id);
          } else {
            setError(data.message || "Failed to verify payment");
          }
        } catch (err) {
          console.error("Verification error:", err);
          setError("Failed to verify payment. Please contact support.");
        } finally {
          setLoading(false);
        }
      }
    };

    verifyPayment();
  }, [sessionId, orderNumber]);

  const copyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="relative inline-block mb-8">
            <div className="bg-blue-100 p-6 rounded-full">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="relative inline-block mb-8">
            <div className="bg-red-100 p-6 rounded-full">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/checkout">
            <Button className="bg-red-600 hover:bg-red-700">Try Again</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-full">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {sessionId ? "Payment Successful! 🎉" : "Order Placed Successfully! 🎉"}
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We&apos;ve received your order and will begin processing it soon.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
            </div>
            <button
              onClick={copyOrderNumber}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Payment Status Badge */}
          {sessionId && (
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <CheckCircle className="h-4 w-4" />
              Payment Confirmed via Stripe
            </div>
          )}

          {/* Order Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="relative flex items-center gap-4 pb-6">
              <div className="bg-green-500 p-2 rounded-full z-10">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-500">Your order has been placed</p>
              </div>
            </div>

            <div className="relative flex items-center gap-4 pb-6">
              <div className="bg-gray-200 p-2 rounded-full z-10">
                <Package className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-600">Processing</p>
                <p className="text-sm text-gray-400">We&apos;re preparing your order</p>
              </div>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="bg-gray-200 p-2 rounded-full z-10">
                <Truck className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-600">Delivery</p>
                <p className="text-sm text-gray-400">Expected in 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-indigo-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              You&apos;ll receive an order confirmation email shortly
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              We&apos;ll notify you when your order ships
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              Track your order anytime from &quot;My Orders&quot;
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/orders" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12 gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Package className="h-5 w-5" />
              View My Orders
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full h-12 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Home className="h-5 w-5" />
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

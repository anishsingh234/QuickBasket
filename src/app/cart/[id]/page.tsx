"use client";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/app/_context/UserContext";
import DeleteButton from "@/app/_components/DeleteButton";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";

type Product = {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
};

type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart/${userId}`);
        const data = await res.json();
        if (data.success) {
          setCartItems(data.data);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 border rounded-xl bg-white">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2 w-full">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center py-12 sm:py-20">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base px-4">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Back Button - Mobile */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:hidden">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Continue Shopping</span>
        </Link>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Shopping Cart</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex gap-3 sm:gap-6">
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gray-50 flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28">
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                        {item.product.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                        <span className="text-lg sm:text-2xl font-bold text-purple-600">
                          ${item.product.price.toFixed(2)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">each</span>
                      </div>

                      {/* Quantity Controls - Mobile Optimized */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Qty:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-l-lg">
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <span className="px-3 sm:px-4 py-1 sm:py-2 border-x border-gray-300 bg-gray-50 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-r-lg">
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Delete - Mobile */}
                        <div className="flex items-center gap-3">
                          <span className="text-base sm:text-lg font-bold text-gray-900 sm:hidden">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <DeleteButton
                            userId={userId!}
                            productId={item.product.id}
                            onDeleted={(id) =>
                              setCartItems((prev) => prev.filter((i) => i.product.id !== id))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Price - Desktop */}
                    <div className="hidden sm:flex flex-col items-end gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-24 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-purple-600">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-5 sm:py-6 text-sm sm:text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
                🔒 Secure checkout • Multiple payment options
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
"use client";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/app/_context/UserContext";
import DeleteButton from "@/app/_components/DeleteButton";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import Link from "next/link";

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
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-48 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-6 border rounded-xl">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-20">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-6">
                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      width={120}
                      height={120}
                      className="object-cover w-30 h-30 group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        ${item.product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">each</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    
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
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span className="text-purple-600">${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold rounded-xl transition-colors">
              Proceed to Checkout
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
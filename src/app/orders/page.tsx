"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { UserContext } from "@/app/_context/UserContext";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
  };
};

type Order = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
};

const statusConfig = {
  PENDING: { 
    label: "Pending", 
    color: "bg-yellow-100 text-yellow-700", 
    icon: Clock,
    bgGradient: "from-yellow-50 to-orange-50"
  },
  CONFIRMED: { 
    label: "Confirmed", 
    color: "bg-blue-100 text-blue-700", 
    icon: CheckCircle,
    bgGradient: "from-blue-50 to-indigo-50"
  },
  PROCESSING: { 
    label: "Processing", 
    color: "bg-purple-100 text-purple-700", 
    icon: Package,
    bgGradient: "from-purple-50 to-pink-50"
  },
  SHIPPED: { 
    label: "Shipped", 
    color: "bg-indigo-100 text-indigo-700", 
    icon: Truck,
    bgGradient: "from-indigo-50 to-blue-50"
  },
  DELIVERED: { 
    label: "Delivered", 
    color: "bg-green-100 text-green-700", 
    icon: CheckCircle,
    bgGradient: "from-green-50 to-emerald-50"
  },
  CANCELLED: { 
    label: "Cancelled", 
    color: "bg-red-100 text-red-700", 
    icon: XCircle,
    bgGradient: "from-red-50 to-rose-50"
  },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-indigo-600 transition">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">My Orders</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <Package className="h-7 w-7 text-white" />
            </div>
            My Orders
          </h1>
          <p className="text-gray-500 mt-2">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you haven't placed any orders. Start shopping to see your orders here!
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <div 
                  key={order.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                >
                  {/* Order Header */}
                  <div 
                    className={`p-5 cursor-pointer transition hover:bg-gray-50`}
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${status.bgGradient}`}>
                          <StatusIcon className={`h-6 w-6 ${status.color.split(' ')[1]}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(order.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {/* Order Info */}
                      <div className="p-5 bg-gray-50 grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Shipping Address</p>
                            <p className="text-sm text-gray-500">{order.shippingAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Payment Method</p>
                            <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-5">
                        <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div 
                              key={item.id}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border">
                                {item.product.thumbnail ? (
                                  <Image
                                    src={item.product.thumbnail}
                                    alt={item.product.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link 
                                  href={`/product-info/${item.product.id}`}
                                  className="font-medium text-gray-900 hover:text-indigo-600 transition truncate block"
                                >
                                  {item.product.title}
                                </Link>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Order Total</span>
                          <span className="text-2xl font-bold text-indigo-600">
                            ₹{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingCart, 
  CreditCard, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Heart,
  Share2,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Package
} from "lucide-react";
import UpdateProduct from "@/app/_components/UpdateProduct";
import DeleteProduct from "@/app/_components/DeleteProduct";
import AddToCart from "@/app/_components/AddToCart";
import { UserContext } from "@/app/_context/UserContext";

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  discountpercentage: number;
  thumbnail: string;
  images: string[];
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isStaff } = useContext(UserContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/product/${id}`);
      const data = await res.json();
      setProduct(data?.data);
      setSelectedImage(data?.data?.images?.[0] || data?.data?.thumbnail || null);
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );

  const originalPrice = (
    product.price /
    (1 - product.discountpercentage / 100)
  ).toFixed(2);

  const savings = (parseFloat(originalPrice) - product.price).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-indigo-600 transition">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href={`/search?q=${product.category}`} className="text-gray-500 hover:text-indigo-600 transition capitalize">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left: Image Gallery */}
            <div className="p-6 lg:p-8 bg-gray-50">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm mb-4">
                {selectedImage || product.thumbnail ? (
                  <Image
                    src={selectedImage || product.thumbnail}
                    alt={product.title || "Product image"}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Package className="h-20 w-20" />
                  </div>
                )}
                
                {/* Discount Badge */}
                {product.discountpercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discountpercentage}% OFF
                  </div>
                )}

                {/* Wishlist & Share */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full shadow-md transition ${
                      isWishlisted 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-indigo-600 transition">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images?.length ? (
                  product.images.map((img, idx) =>
                    img ? (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                          selectedImage === img 
                            ? "border-indigo-500 ring-2 ring-indigo-200" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`thumb-${idx}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ) : null
                  )
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center border rounded-lg text-xs text-gray-400 bg-white">
                    No images
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Category */}
              <div className="mb-2">
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500 text-sm">1,234 Reviews</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">5K+ Sold</span>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="bg-green-500 text-white text-sm font-semibold px-2 py-0.5 rounded">
                    Save ₹{savings}
                  </span>
                </div>
                <p className="text-green-600 text-sm font-medium">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                {product.stock > 0 ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    <span className="text-gray-400">({product.stock} available)</span>
                  </>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 font-semibold text-gray-900 min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition rounded-r-lg"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <AddToCart prod={product} />
              </div>

              {/* Admin Actions - Only visible to STAFF */}
              {isStaff && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <UpdateProduct props={product} />
                  <DeleteProduct product={product} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Truck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Free Delivery</p>
              <p className="text-gray-500 text-xs">On orders above ₹500</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-green-100 p-3 rounded-full">
              <RotateCcw className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
              <p className="text-gray-500 text-xs">30-day return policy</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Secure Payment</p>
              <p className="text-gray-500 text-xs">100% protected</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Genuine Product</p>
              <p className="text-gray-500 text-xs">Verified quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

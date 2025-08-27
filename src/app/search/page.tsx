"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SearchProduct from "../_components/search";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Package, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  images: string[];
  stock: number;
  discountpercentage: number;
  thumbnail: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch search results');
        }
        return res.json();
      })
      .then((data) => {
        setResults(data.data || []);
      })
      .catch((err) => {
        console.error('Search error:', err);
        setError('Failed to load search results. Please try again.');
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const calculateDiscountedPrice = (price: number, discount: number): number => {
    return price * (1 - discount / 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.svg"
              alt="Quick Basket Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quick Basket</h1>
          </Link>
          <SearchProduct />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Search results for: <span className="text-indigo-600">"{query}"</span>
          </h1>
          {!loading && results.length > 0 && (
            <p className="text-gray-600">
              Found {results.length} product{results.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Searching products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No products found</p>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          {results.map((item) => {
            const discountedPrice = calculateDiscountedPrice(item.price, item.discountpercentage || 0);
            const hasDiscount = item.discountpercentage > 0;

            return (
              <div
                key={item.id}
                className="flex bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Product Image */}
                <div className="w-48 h-48 flex items-center justify-center p-4 bg-gray-50">
                  <img
                    src={item.thumbnail || "/placeholder.png"}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 p-6">
                  <Link href={`/product-info/${item.id}`}>
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 cursor-pointer line-clamp-2 mb-2">
                      {item.title}
                    </h2>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(item.rating || 0)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {item.rating?.toFixed(1) || "No rating"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Category and Stock Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span>
                      <span className="font-medium">Category:</span> {item.category}
                    </span>
                    <span className={`flex items-center gap-1 ${
                      item.stock > 10 
                        ? "text-green-600" 
                        : item.stock > 0 
                          ? "text-orange-600" 
                          : "text-red-600"
                    }`}>
                      <Package className="w-4 h-4" />
                      {item.stock > 0 
                        ? item.stock > 10 
                          ? "In Stock" 
                          : `Only ${item.stock} left`
                        : "Out of Stock"
                      }
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {/* <div className="flex items-center gap-3">
                    <button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div> */}
                </div>

                {/* Price Section */}
                <div className="w-48 p-6 border-l border-gray-100">
                  <div className="text-right">
                    {hasDiscount ? (
                      <>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {formatPrice(discountedPrice)}
                        </p>
                        <p className="text-lg text-gray-500 line-through mb-2">
                          {formatPrice(item.price)}
                        </p>
                        <div className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full inline-block">
                          {item.discountpercentage}% OFF
                        </div>
                      </>
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </p>
                    )}
                    
                    {hasDiscount && (
                      <p className="text-green-600 text-sm mt-2 font-medium">
                        You save {formatPrice(item.price - discountedPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
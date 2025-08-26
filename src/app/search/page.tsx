"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SearchProduct from "../_components/search";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.data || []))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Quick Basket Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <h1 className="text-2xl font-bold tracking-tight">Quick Basket</h1>
        </Link>
        <SearchProduct />
      </div>

      <h1 className="text-xl font-semibold mb-4">
        Search results for: <span className="text-indigo-600">"{query}"</span>
      </h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && results.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className="space-y-6">
        {results.map((item) => (
          <div
            key={item.id}
            className="flex border rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            {/* Product Image */}
            <div className="w-40 h-40 flex items-center justify-center p-2">
              <img
                src={item.thumbnail || "/placeholder.png"}
                alt={item.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 p-4"><Link href={`/product-info/`+item.id}>
              <h2 className="text-lg font-medium text-indigo-700 hover:underline cursor-pointer">
                {item.title}
              </h2>
              </Link>
              {/* Rating */}
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                  {item.rating?.toFixed(1) || "N/A"} ★
                </span>
              </div>

              {/* Description */}
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {item.description}
              </p>

              {/* Category + Stock */}
              <p className="mt-2 text-sm text-gray-500">
                Category: <span className="font-medium">{item.category}</span>
              </p>
              <p
                className={`mt-1 text-sm ${
                  item.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.stock > 0
                  ? `${item.stock} in stock`
                  : "Out of stock"}
              </p>
            </div>

            {/* Price + Discount */}
            <div className="w-40 p-4 text-right">
              <p className="text-2xl font-semibold text-gray-800">
                ₹{item.price.toFixed(2)}
              </p>
              <p className="text-green-600 font-medium">
                {item.discountpercentage}% off
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

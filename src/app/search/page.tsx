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
        <SearchProduct/>
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
            <div className="flex-1 p-4">
              <h2 className="text-lg font-medium text-indigo-700 hover:underline cursor-pointer">
                {item.title}
              </h2>

              {/* Rating + Reviews */}
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                  {item.rating || "4.4"} ★
                </span>
                <span className="ml-2">
                  {item.reviews || "13,203 Ratings & 976 Reviews"}
                </span>
              </div>

              {/* Features */}
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>{item.ram || "6 GB RAM"} | {item.storage || "128 GB ROM"}</li>
                <li>{item.display || "16.0 cm (6.3 inch) Full HD+ Display"}</li>
                <li>{item.camera || "48MP + 8MP + 2MP + 2MP | 13MP Front Camera"}</li>
                <li>{item.battery || "4000 mAh Battery"}</li>
                <li>{item.processor || "Qualcomm Snapdragon 665 Processor"}</li>
              </ul>
            </div>

            {/* Price + Offers */}
            <div className="w-40 p-4 text-right">
              <p className="text-2xl font-semibold text-gray-800">₹{item.price || "11,935"}</p>
              <p className="line-through text-sm text-gray-400">₹{item.oldPrice || "15,999"}</p>
              <p className="text-green-600 font-medium">{item.discount || "25% off"}</p>
              <p className="text-red-500 text-sm mt-1">Only few left</p>
              <p className="text-sm text-gray-600 mt-1">
                Upto <span className="font-semibold">₹9,900</span> Off on Exchange
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

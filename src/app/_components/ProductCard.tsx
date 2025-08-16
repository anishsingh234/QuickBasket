import Image from "next/image";
import React from "react";
import { Product } from "../../../generated/prisma";
import { Star } from "lucide-react"; // for rating stars

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const rating = product?.rating || 4; // out of 5

  return (
    <div
      className="relative w-64 rounded-2xl border shadow-md bg-white p-4 
    hover:border-2 hover:border-indigo-500
 transition"
    >
      {/* Discount Badge */}
      {product?.discountpercentage > 0 && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
          {product?.discountpercentage}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="flex justify-center">
        <Image
          src={product?.thumbnail || "/placeholder.png"}
          alt={product.title}
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      {/* Title */}
      <h2 className="mt-3 text-base font-semibold text-gray-900 truncate">
        {product?.title}
      </h2>

      {/* Prices */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg font-bold text-gray-900">
          ₹{product?.price}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}

import Image from "next/image";
import React from "react";
import { Product } from "../../../generated/prisma";
import { Star } from "lucide-react"; // for rating stars
import Link from "next/link";
interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const rating = product?.rating || 4; // out of 5
  const discountedPrice = product?.discountpercentage > 0 
    ? (product.price * (1 - product.discountpercentage / 100)).toFixed(2)
    : null;

  return (
    <div
      className="relative w-full rounded-2xl border shadow-md bg-white p-3 sm:p-4 
    hover:border-2 hover:border-indigo-500 transition group"
    >
      {/* Discount Badge */}
      {product?.discountpercentage > 0 && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md z-10">
          {Math.round(product?.discountpercentage)}% OFF
        </div>
      )}

      {/* Product Image */}
      <Link href={"/product-info/" + product?.id}>
        <div className="flex justify-center aspect-square relative overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={product?.thumbnail || "/placeholder.png"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Title */}
        <h2 className="mt-2 sm:mt-3 text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product?.title}
        </h2>

        {/* Prices */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ₹{discountedPrice || product?.price}
          </span>
          {discountedPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{product?.price}
            </span>
          )}
        </div>
      </Link>

      {/* Rating */}
      <div className="flex items-center gap-0.5 sm:gap-1 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} sm:w-4 sm:h-4`}
          />
        ))}
        <span className="text-[10px] sm:text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}

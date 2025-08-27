import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";
import { Product } from "../../../generated/prisma";

interface Props {
  title: string;
  icon: React.ReactNode;
  products: Product[];
  viewAllLink?: string;
  theme?: "green" | "blue" | "pink";
}

export default function CategoryCard({
  title,
  icon,
  products,
  viewAllLink = "#",
  theme = "blue",
}: Props) {
  const themeColors: Record<string, string> = {
    green: "from-green-50 to-green-100 text-green-700",
    blue: "from-blue-50 to-indigo-100 text-blue-700",
    pink: "from-pink-50 to-pink-100 text-pink-700",
  };

  return (
    <div
      className={`bg-gradient-to-br ${themeColors[theme]} rounded-2xl shadow-md hover:shadow-xl transition p-6`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {icon} {title}
        </h3>
        <Link
          href={viewAllLink}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <CategoryProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

/* 🆕 Custom ProductCard for CategoryCard */
function CategoryProductCard({ product }: { product: Product }) {
  const rating = product?.rating || 4;

  return (
    <Link
      href={"/product-info/" + product?.id}
      className="relative bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col"
    >
      {/* Discount */}
      {product?.discountpercentage > 0 && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
          {product.discountpercentage}% OFF
        </div>
      )}

      {/* Image */}
      <div className="flex justify-center mb-2">
        <Image
          src={product?.thumbnail || "/placeholder.png"}
          alt={product?.title}
          width={100}
          height={100}
          className="object-contain h-20 w-auto"
        />
      </div>

      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-900 truncate">
        {product?.title}
      </h2>

      {/* Price */}
      <p className="text-base font-bold text-gray-900 mt-1">
        ₹{product?.price}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }
          />
        ))}
        <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
      </div>
    </Link>
  );
}

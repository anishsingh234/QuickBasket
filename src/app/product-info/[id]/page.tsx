"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Edit, Trash2 } from "lucide-react";
import UpdateProduct from "@/app/_components/UpdateProduct";
import DeleteProduct from "@/app/_components/DeleteProduct";
import AddToCart from "@/app/_components/AddToCart";


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
  const [loading, setLoading] = useState(false);

  
  

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`http://localhost:3000/api/product/${id}`);
      const data = await res.json();
      setProduct(data?.data);
      setSelectedImage(data?.data?.images?.[0] || null);
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <p className="flex justify-center items-center">
        <Image src="/spinner.svg" alt="loading..." width={400} height={500} />
      </p>
    );

  // calculate original price
  const originalPrice = (
    product.price /
    (1 - product.discountpercentage / 100)
  ).toFixed(2);

  return (
    <div className="grid md:grid-cols-2 gap-10 p-8">
      {/* Left: Image carousel */}
      <div>
        {/* Main Product Image */}
        <div className="w-full h-[400px] relative border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          {selectedImage || product.thumbnail ? (
            <Image
              src={selectedImage || product.thumbnail}
              alt={product.title || "Product image"}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="/spinner.svg"
            />
          ) : (
            <span className="text-gray-500">No Image Available</span>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 mt-4">
          {product.images?.length ? (
            product.images.map((img, idx) =>
              img ? (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 relative border rounded-lg overflow-hidden ${
                    selectedImage === img ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt={`thumb-${idx}`}
                    width={80}
                    height={80}
                    placeholder="blur"
                    blurDataURL="/spinner.svg"
                    className="object-cover"
                  />
                </button>
              ) : null
            )
          ) : (
            <div className="w-20 h-20 flex items-center justify-center border rounded-lg text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* Right: Product Info */}
      <div>
        <h2 className="text-3xl font-bold mb-2">{product.title}</h2>

        {/* Price + Discount */}
        <div className="flex items-center gap-3 mb-3">
          <p className="text-2xl font-semibold text-purple-600">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-400 line-through">${originalPrice}</p>
          <span className="text-green-600 font-medium">
            -{product.discountpercentage}%
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500">⭐ {product.rating.toFixed(1)}</span>
          <p className="text-sm text-gray-500">(Stock: {product.stock})</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4">{product.description}</p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {/* 🛒 Add to Cart */}
          <AddToCart prod={product}/>
          {/* Buy Now */}
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Buy Now
          </Button>

          {/* Update Product */}
          <UpdateProduct props={product}>
            <Button variant="secondary">
              <Edit className="mr-2 h-4 w-4" />
              Update
            </Button>
          </UpdateProduct>

          {/* Delete Product */}
          <DeleteProduct product={product}>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DeleteProduct>
        </div>
      </div>
    </div>
  );
}

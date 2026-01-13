"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "../../../generated/prisma";
import { Edit, Save, X, Package, DollarSign, Star, Percent, ImageIcon, Loader2 } from "lucide-react";

export default function UpdateProduct({
  props,
  children,
}: {
  props: Product;
  children?: React.ReactNode;
}) {
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [category, setCategory] = useState(props.category);
  const [price, setPrice] = useState<number>(props.price);
  const [rating, setRating] = useState<number>(props.rating);
  const [images, setImages] = useState<string[]>(props.images || []);
  const [stock, setStock] = useState<number>(props.stock);
  const [discountpercentage, setDiscountpercentage] = useState<number>(
    props.discountpercentage || 0
  );
  const [thumbnail, setThumbnail] = useState(props.thumbnail || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedProduct = {
        id: props.id,
        title,
        description,
        category,
        price,
        rating,
        images,
        stock,
        discountpercentage: discountpercentage,
        thumbnail,
      };

      const res = await fetch(`/api/updateproduct`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        alert("✅ Product updated successfully!");
        window.location.reload();
      } else {
        alert("⚠️ Failed to update product. Try again!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("🚨 Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all"
          >
            <Edit className="h-4 w-4" />
            Edit Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-white text-xl flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Update Product
              </DialogTitle>
              <DialogDescription className="text-indigo-100">
                Modify the product details below
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                Product Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Price + Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  Price (₹)
                </Label>
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-400" />
                  Rating
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  max="5"
                  min="0"
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Stock + Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  Stock
                </Label>
                <Input
                  type="number"
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountpercentage" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-gray-400" />
                  Discount %
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  id="discountpercentage"
                  value={discountpercentage}
                  onChange={(e) =>
                    setDiscountpercentage(Number(e.target.value))
                  }
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label htmlFor="images" className="text-sm font-medium text-gray-700">
                Additional Images (comma separated URLs)
              </Label>
              <Input
                id="images"
                value={images.join(", ")}
                onChange={(e) =>
                  setImages(e.target.value.split(",").map((img) => img.trim()))
                }
                placeholder="url1, url2, url3"
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

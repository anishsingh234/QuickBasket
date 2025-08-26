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
import { Edit } from "lucide-react";

export default function UpdateProduct({
  props,
  children,
}: {
  props: Product;
  children?: React.ReactNode;
}) {
  // ✅ Initialize with existing values
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      console.log("Updating Product:", updatedProduct);

      const res = await fetch(`/api/updateproduct`, {
        method: "PUT", // ✅ use PUT/PATCH for updates
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
      } else {
        alert("⚠️ Failed to update product. Try again!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("🚨 Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Edit className="mr-2 h-4 w-4" />
          Update Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
            <DialogDescription>
              Modify the details below to update this product.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Price + Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Stock + Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  type="number"
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discountpercentage">Discount %</Label>
                <Input
                  type="number"
                  step="0.1"
                  id="discountpercentage"
                  value={discountpercentage}
                  onChange={(e) =>
                    setDiscountpercentage(Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="grid gap-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </div>

            {/* Images */}
            <div className="grid gap-2">
              <Label htmlFor="images">Images (comma separated URLs)</Label>
              <Input
                id="images"
                value={images.join(", ")}
                onChange={(e) =>
                  setImages(e.target.value.split(",").map((img) => img.trim()))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { useToast } from "../_context/ToastContext";

export function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [stock, setStock] = useState<number>(0);
  const [discountpercentage, setDiscountpercentage] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState("");
  const { success, error, warning } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const newProduct = {
      title,
      description,
      category,
      price: Number(price),
      rating: Number(rating),
      images,
      stock: Number(stock),
      discountPercentage: Number(discountpercentage),
      thumbnail,
    };

    console.log("Submitting Product:", newProduct);

    const res = await fetch("/api/addProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();

    if (result.success) {
      success("Product added successfully!");

      // Reset all states
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice(0);
      setRating(0);
      setImages([]);
      setStock(0);
      setDiscountpercentage(0);
      setThumbnail("");
    } else {
      warning("Failed to add product. Try again!");
    }
  } catch (err) {
    console.error("Error adding product:", err);
    error("Something went wrong. Please try again.");
  }
};



  return (
    <Dialog>
      {/* ✅ Use a span instead of button to look like a menu item */}
      <DialogTrigger asChild>
        <span className="text-sm text-gray-700 hover:text-indigo-600">
          Add Product
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Fill out the details below to add a new product to the catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

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

            <div className="grid gap-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </div>

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
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

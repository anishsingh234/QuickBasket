"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { UserContext } from "../_context/UserContext";

export default function AddToCart({ prod }: { prod: any }) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const handleAddToCart = async () => {
    if (!userId || !prod?.id) {
      alert("⚠️ Please login first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: prod.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Network response failed");

      const data = await res.json();
      if (data.success) {
        alert(`✅ ${prod.title} added to cart!`);
      } else {
        alert("❌ Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 text-base font-semibold"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

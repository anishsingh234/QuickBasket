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
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

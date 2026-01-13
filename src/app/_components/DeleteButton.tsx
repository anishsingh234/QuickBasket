"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "../_context/ToastContext";

export default function DeleteButton({
  userId,
  productId,
  onDeleted,
}: {
  userId: string;
  productId: string;
  onDeleted: (productId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { error } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();
      if (data.success) {
        onDeleted(productId);
      } else {
        error("Failed to delete item");
      }
    } catch (err) {
      console.error("Delete error:", err);
      error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}

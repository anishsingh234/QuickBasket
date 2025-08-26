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
import { Trash2 } from "lucide-react";

export default function DeleteProduct({
  product,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/deleteProduct", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Product deleted successfully!");
        // refresh or redirect if needed
        window.location.reload();
      } else {
        alert("⚠️ Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("🚨 Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            This action <b>cannot be undone</b>. This will permanently delete{" "}
            <span className="font-bold">{product.title}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="confirm">
            Please type <b>{product.title}</b> to confirm:
          </Label>
          <Input
            id="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Type "${product.title}"`}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== product.title || loading}
          >
            {loading ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Product
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

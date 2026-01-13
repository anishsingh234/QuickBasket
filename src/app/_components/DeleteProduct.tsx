"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "../../../generated/prisma";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";
import { useToast } from "../_context/ToastContext";

export default function DeleteProduct({
  product,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error, warning } = useToast();

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
        success("Product deleted successfully!");
        window.location.href = "/";
      } else {
        warning("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isConfirmed = confirmText === product.title;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-red-100">
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Warning</p>
                <p className="text-sm text-red-600 mt-1">
                  You are about to permanently delete{" "}
                  <span className="font-bold">&quot;{product.title}&quot;</span>. 
                  This will remove all associated data.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-sm font-medium text-gray-700">
              Type <span className="font-bold text-red-600">{product.title}</span> to confirm:
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter product name"
              className={`border-gray-200 focus:border-red-500 focus:ring-red-500 ${
                confirmText && !isConfirmed ? 'border-red-300 bg-red-50' : ''
              } ${isConfirmed ? 'border-green-300 bg-green-50' : ''}`}
            />
            {confirmText && !isConfirmed && (
              <p className="text-xs text-red-500">Product name doesn&apos;t match</p>
            )}
            {isConfirmed && (
              <p className="text-xs text-green-600">✓ Confirmed - ready to delete</p>
            )}
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
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || loading}
            className="gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Product
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

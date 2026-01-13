"use client"
import React, { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Package, Heart, Settings, HelpCircle, LogOut, ChevronDown, Plus, Shield } from "lucide-react";
import { AddProduct } from "./AddProduct";
import { UserContext } from "../_context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserDropDown() {
  const userContext = useContext(UserContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!userContext) {
    return null;
  }

  const { user, isStaff } = userContext;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 p-2 lg:px-3 lg:py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="User Menu"
      >
        <div className="relative">
          <div className={`p-1.5 rounded-full ${isStaff ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
          {user?.name || 'Account'}
        </span>
        <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-white shadow-xl border border-gray-100 rounded-xl p-2" align="end">
        {/* User Info Header */}
        <div className={`px-3 py-3 mb-2 rounded-lg ${isStaff ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${isStaff ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                {isStaff && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-medium px-1.5 py-0.5 rounded">
                    <Shield className="h-3 w-3" />
                    Staff
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Staff Actions - Only visible to STAFF */}
        {isStaff && (
          <>
            <div className="px-1 mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">Staff Actions</p>
              <div className="flex items-center gap-2 p-2 hover:bg-amber-50 cursor-pointer rounded-lg transition">
                <Plus className="h-4 w-4 text-amber-600" />
                <AddProduct />
              </div>
            </div>
            <DropdownMenuSeparator className="bg-gray-100" />
          </>
        )}

        {/* Menu Items */}
        <div className="py-1">
          <Link href="/orders">
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg transition">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">My Orders</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg transition">
            <Heart className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Wishlist</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg transition">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg transition">
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Help & Support</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gray-100" />

        {/* Logout */}
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2.5 mt-1 hover:bg-red-50 cursor-pointer rounded-lg transition text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

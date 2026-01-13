"use client"
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import UserDropDown from "./userDropDown";
import SearchProduct from "./search";
import { UserContext } from "../_context/UserContext";

export default function Header() {
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              QuickBasket
            </h1>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-8">
            <SearchProduct />
          </div>

          {/* Cart and User */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link
              href={`/cart/${userId}`}
              className="relative flex items-center gap-2 p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
            <UserDropDown />
          </div>
        </div>
      </div>
    </header>
  );
}

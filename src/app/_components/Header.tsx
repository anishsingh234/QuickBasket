import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SiOpensearch } from "react-icons/si";
import { RiMenuSearchLine } from "react-icons/ri";
import { IoIosBasket } from "react-icons/io";
import UserDropDown from "./userDropDown";

export default function Header() {
  return (
    <header className="bg-indigo-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Quick Basket Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <h1 className="text-2xl font-bold tracking-tight">Quick Basket</h1>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex items-center flex-grow max-w-xl mx-6 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <SiOpensearch className="text-indigo-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search essentials, groceries and more..."
            className="flex-grow bg-transparent text-gray-800 text-sm placeholder-gray-400 focus:outline-none"
            aria-label="Search essentials"
          />
          <RiMenuSearchLine className="text-indigo-500 ml-2" size={20} />
        </div>

        {/* Cart and User */}
        <div className="flex items-center gap-6 ml-4">
          <Link href="/cart" className="flex items-center gap-1 hover:text-gray-100 transition">
            <IoIosBasket size={24} />
            <span className="text-sm font-medium">Cart</span>
          </Link>
          <UserDropDown />
        </div>
      </div>
    </header>
  );
}

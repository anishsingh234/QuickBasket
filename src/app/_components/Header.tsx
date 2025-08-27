"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SiOpensearch } from "react-icons/si";
import { RiMenuSearchLine } from "react-icons/ri";
import { IoIosBasket } from "react-icons/io";
import UserDropDown from "./userDropDown";
import SearchProduct from "./search";
import { useContext } from "react";
import { UserContext } from "../_context/UserContext";
export default function Header() {
  const { user } = useContext(UserContext);
  const userId = user?.id;
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
        <SearchProduct/>

        {/* Cart and User */}
        <div className="flex items-center gap-6 ml-4">
          <Link
            href={`/cart/${userId}`}
            className="flex items-center gap-1 hover:text-gray-100 transition"
          >
            <IoIosBasket size={24} />
            <span className="text-sm font-medium">Cart</span>
          </Link>
          <UserDropDown />
        </div>
      </div>
    </header>
  );
}

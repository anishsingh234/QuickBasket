import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuCircleUserRound } from "react-icons/lu";
import { FaUser, FaCreditCard, FaUsers, FaRegClipboard } from "react-icons/fa";

export default function UserDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-indigo-600 transition"
        aria-label="User Menu"
      >
        <LuCircleUserRound className="h-6 w-6" />
        <span className="text-sm font-medium">User</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 bg-white shadow-lg border border-gray-200 rounded-md">
        <DropdownMenuLabel className="text-gray-600">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 hover:bg-indigo-100 cursor-pointer">
          <FaUser className="h-4 w-4 text-gray-600" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 hover:bg-indigo-100 cursor-pointer">
          <FaCreditCard className="h-4 w-4 text-gray-600" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 hover:bg-indigo-100 cursor-pointer">
          <FaUsers className="h-4 w-4 text-gray-600" />
          Team
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 hover:bg-indigo-100 cursor-pointer">
          <FaRegClipboard className="h-4 w-4 text-gray-600" />
          Subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

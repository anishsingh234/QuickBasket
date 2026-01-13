import React from 'react'
import { Search } from 'lucide-react'

export default function SearchProduct() {
  return (
    <form
      className="flex items-center w-full bg-gray-100 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 px-2 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all border border-transparent focus-within:border-indigo-200"
      action="/search"
      method="GET"
    >
      <Search className="text-gray-400 mr-2 sm:mr-3 flex-shrink-0" size={18} />
      <input
        name="q"
        type="text"
        placeholder="Search..."
        className="flex-grow bg-transparent text-gray-800 text-sm placeholder-gray-500 focus:outline-none min-w-0"
        aria-label="Search products"
      />
      <button 
        type="submit"
        className="bg-indigo-600 text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-indigo-700 transition ml-1 sm:ml-2 flex-shrink-0"
      >
        <span className="hidden sm:inline">Search</span>
        <Search className="sm:hidden h-4 w-4" />
      </button>
    </form>
  )
}

import React from 'react'
import { RiMenuSearchLine } from 'react-icons/ri'
import { SiOpensearch } from 'react-icons/si'

export default function SearchProduct() {
  return (
    <form
          className="hidden md:flex items-center flex-grow max-w-xl mx-6 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          action="/search"
          method="GET"
        >
          <SiOpensearch className="text-indigo-500 mr-2" size={20} />
          <input
            name="q"
            type="text"
            placeholder="Search essentials, groceries and more..."
            className="flex-grow bg-transparent text-gray-800 text-sm placeholder-gray-400 focus:outline-none"
            aria-label="Search essentials"
          />
          <button type="submit">
            <RiMenuSearchLine className="text-indigo-500 ml-2" size={20} />
          </button>
        </form>
  )
}

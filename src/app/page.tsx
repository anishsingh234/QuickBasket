import React from "react";
import ProductCard from "./_components/ProductCard";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import CategoryCard from "./_components/CategoryCard";
import prismaClient from "@/db/prisma";
import Link from "next/link";
import { 
  ShoppingBag, 
  Truck, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Zap,
  Star,
  Gift,
  Clock,
  CheckCircle,
  Mail,
  Bell,
  Percent
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountpercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export default async function HomePage() {
  let sportsProducts: Product[] = [];
  let electronicsProducts: Product[] = [];
  let groceriesProducts: Product[] = [];
  let vehicleProducts: Product[] = [];
  let furnitureProducts: Product[] = [];
  let allProducts: Product[] = [];
  
  try {
    const [sports, electronics, groceries, vehicles, furniture, all] = await Promise.all([
      prismaClient.product.findMany({
        where: { category: { contains: "sports", mode: "insensitive" } },
        take: 10,
      }),
      prismaClient.product.findMany({
        where: { category: { contains: "electronics", mode: "insensitive" } },
        take: 10,
      }),
      prismaClient.product.findMany({
        where: { category: { contains: "groceries", mode: "insensitive" } },
        take: 4,
      }),
      prismaClient.product.findMany({
        where: { category: { contains: "vehicle", mode: "insensitive" } },
        take: 4,
      }),
      prismaClient.product.findMany({
        where: { category: { contains: "furniture", mode: "insensitive" } },
        take: 4,
      }),
      prismaClient.product.findMany({
        take: 8,
        orderBy: { rating: "desc" },
      }),
    ]);
    
    sportsProducts = sports;
    electronicsProducts = electronics;
    groceriesProducts = groceries;
    vehicleProducts = vehicles;
    furnitureProducts = furniture;
    allProducts = all;
  } catch (error) {
    console.error("Database error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We&apos;re having trouble loading the page. Please try again later.</p>
          <Link 
            href="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition inline-block"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">New Season Collection 2026</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Shop Smart,
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Live Better
                </span>
              </h1>
              
              <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover thousands of products at unbeatable prices. From groceries to electronics, 
                we&apos;ve got everything you need delivered right to your doorstep.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/search?q=all"
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition shadow-xl shadow-black/20 group"
                >
                  Start Shopping
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/search?q=deals"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition border border-white/20"
                >
                  <Gift className="h-5 w-5" />
                  Today&apos;s Deals
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">Easy Returns</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">Secure Checkout</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Stats Cards */}
            <div className="hidden lg:block relative">
              {/* Floating Cards */}
              <div className="relative h-96">
                {/* Main Card */}
                <div className="absolute top-0 right-0 bg-white rounded-2xl shadow-2xl p-6 w-72 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">50,000+</p>
                      <p className="text-gray-500 text-sm">Products Available</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 Rating</span>
                  </div>
                </div>
                
                {/* Secondary Card */}
                <div className="absolute top-32 left-0 bg-white rounded-2xl shadow-2xl p-5 w-64 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Fast Delivery</p>
                      <p className="text-gray-500 text-sm">Within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                {/* Third Card */}
                <div className="absolute bottom-0 right-12 bg-white rounded-2xl shadow-2xl p-5 w-56 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-2.5 rounded-xl">
                      <Percent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Up to 70% Off</p>
                      <p className="text-gray-500 text-sm">On selected items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition">
              <div className="bg-indigo-100 p-3 rounded-xl flex-shrink-0">
                <Truck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Free Delivery</p>
                <p className="text-sm text-gray-500">Orders over ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition">
              <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Secure Payment</p>
                <p className="text-sm text-gray-500">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition">
              <div className="bg-amber-100 p-3 rounded-xl flex-shrink-0">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">24/7 Support</p>
                <p className="text-sm text-gray-500">Dedicated help</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition">
              <div className="bg-pink-100 p-3 rounded-xl flex-shrink-0">
                <Gift className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Daily Deals</p>
                <p className="text-sm text-gray-500">Save up to 70%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked just for you</p>
            </div>
          </div>
          <Link 
            href="/search?q=all"
            className="hidden sm:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition group"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {allProducts.slice(0, 8).map((product, index) => (
            <div key={product.id || index} className="transform hover:-translate-y-1 transition-transform duration-200">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link 
            href="/search?q=all"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Sports Collection */}
      {sportsProducts.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Sports Collection
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Gear up for your active lifestyle</p>
                </div>
              </div>
              <Link 
                href="/search?q=sports"
                className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition group"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {sportsProducts.map((product, index) => (
                <div 
                  key={product.id || index} 
                  className="flex-shrink-0 snap-start transform hover:-translate-y-1 transition-transform duration-200"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="sm:hidden mt-4 text-center">
              <Link 
                href="/search?q=sports"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Shop Sports
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Cards Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-500 text-sm mt-1">Explore our top categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groceriesProducts.length > 0 && (
            <CategoryCard
              title="Groceries"
              icon={<span className="text-2xl">🛒</span>}
              products={groceriesProducts}
              viewAllLink="/search?q=groceries"
              theme="green"
            />
          )}
          {vehicleProducts.length > 0 && (
            <CategoryCard
              title="Vehicles"
              icon={<span className="text-2xl">🚗</span>}
              products={vehicleProducts}
              viewAllLink="/search?q=vehicle"
              theme="blue"
            />
          )}
          {furnitureProducts.length > 0 && (
            <CategoryCard
              title="Furniture"
              icon={<span className="text-2xl">🛋️</span>}
              products={furnitureProducts}
              viewAllLink="/search?q=furniture"
              theme="pink"
            />
          )}
        </div>
      </section>

      {/* Electronics Collection */}
      {electronicsProducts.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Electronics
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Latest gadgets & devices</p>
                </div>
              </div>
              <Link 
                href="/search?q=electronics"
                className="hidden sm:flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition group"
              >
                Explore
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {electronicsProducts.map((product, index) => (
                <div 
                  key={product.id || index} 
                  className="flex-shrink-0 snap-start transform hover:-translate-y-1 transition-transform duration-200"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="sm:hidden mt-4 text-center">
              <Link 
                href="/search?q=electronics"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Shop Electronics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-full mb-6">
                <Bell className="h-4 w-4 text-indigo-400" />
                <span className="text-indigo-300 text-sm font-medium">Stay Updated</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">20% OFF</span> Your First Order
              </h3>
              
              <p className="text-gray-400 text-lg mb-6">
                Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and special offers.
              </p>
              
              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Exclusive member-only discounts</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Early access to flash sales</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Personalized product recommendations</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white">Join 50,000+ Subscribers</h4>
                <p className="text-gray-400 mt-2">No spam, unsubscribe anytime</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group"
                >
                  Subscribe Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              
              <p className="text-center text-gray-500 text-sm mt-6">
                By subscribing, you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

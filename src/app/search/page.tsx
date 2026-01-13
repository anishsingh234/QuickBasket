"use client";
import { useEffect, useState, Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Star,
  Package,
  AlertCircle,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  List,
  Tag,
  Percent,
} from "lucide-react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  images: string[];
  stock: number;
  discountpercentage: number;
  thumbnail: string;
}

type SortOption = "relevance" | "price-low" | "price-high" | "rating" | "newest" | "discount";

// Helper to calculate discounted price
const getDiscountedPrice = (price: number, discount: number): number => {
  return price * (1 - discount / 100);
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  // Filter states - Initialize from URL params
  const [showFilters, setShowFilters] = useState(false); // Hidden by default on mobile
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "relevance"
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [minRating, setMinRating] = useState<number>(
    Number(searchParams.get("rating")) || 0
  );
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true"
  );
  const [discountOnly, setDiscountOnly] = useState(
    searchParams.get("discount") === "true"
  );

  // Price range bounds based on all results
  const [maxPriceBound, setMaxPriceBound] = useState(10000);

  // Debounced search input for live search
  const debouncedSearchInput = useDebounce(searchInput, 300);

  // Get unique categories from results with memoization
  const categories = useMemo(() => {
    return [...new Set(results.map((p) => p.category))].sort();
  }, [results]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    results.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [results]);

  // Update URL with current filters
  const updateURL = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === "0" || value === "false") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newURL);
    },
    [searchParams]
  );

  // Fetch results
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch search results");
        return res.json();
      })
      .then((data) => {
        const products = data.data || [];
        setResults(products);
        
        // Set max price bound based on all results
        if (products.length > 0) {
          const maxPrice = Math.ceil(Math.max(...products.map((p: Product) => p.price)));
          setMaxPriceBound(maxPrice + 100);
          
          // Only reset price range if it's the initial load
          if (!searchParams.get("maxPrice")) {
            setPriceRange([0, maxPrice + 100]);
          }
        }
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError("Failed to load search results. Please try again.");
        setResults([]);
        setFilteredResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  // Apply filters and sorting with memoization
  useEffect(() => {
    let filtered = [...results];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Filter by price (using discounted price)
    filtered = filtered.filter((p) => {
      const effectivePrice = getDiscountedPrice(p.price, p.discountpercentage || 0);
      return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
    });

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Filter by discount
    if (discountOnly) {
      filtered = filtered.filter((p) => p.discountpercentage > 0);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = getDiscountedPrice(a.price, a.discountpercentage || 0);
          const priceB = getDiscountedPrice(b.price, b.discountpercentage || 0);
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = getDiscountedPrice(a.price, a.discountpercentage || 0);
          const priceB = getDiscountedPrice(b.price, b.discountpercentage || 0);
          return priceB - priceA;
        });
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        filtered.sort((a, b) => (b.discountpercentage || 0) - (a.discountpercentage || 0));
        break;
      case "newest":
        // Reverse to show newest (assuming newest are at the end)
        filtered.reverse();
        break;
      default:
        // relevance - keep original order from API
        break;
    }

    setFilteredResults(filtered);
  }, [results, selectedCategories, priceRange, minRating, inStockOnly, discountOnly, sortBy]);

  // Update URL when filters change
  useEffect(() => {
    updateURL({
      categories: selectedCategories.length > 0 ? selectedCategories.join(",") : null,
      minPrice: priceRange[0] > 0 ? String(priceRange[0]) : null,
      maxPrice: priceRange[1] < maxPriceBound ? String(priceRange[1]) : null,
      rating: minRating > 0 ? String(minRating) : null,
      inStock: inStockOnly ? "true" : null,
      discount: discountOnly ? "true" : null,
      sort: sortBy !== "relevance" ? sortBy : null,
      view: viewMode !== "grid" ? viewMode : null,
    });
  }, [selectedCategories, priceRange, minRating, inStockOnly, discountOnly, sortBy, viewMode, maxPriceBound, updateURL]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Live search on debounced input change
  useEffect(() => {
    if (debouncedSearchInput !== query && debouncedSearchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearchInput.trim())}`);
    }
  }, [debouncedSearchInput]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinRating(0);
    setInStockOnly(false);
    setDiscountOnly(false);
    setSortBy("relevance");
    setPriceRange([0, maxPriceBound]);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = selectedCategories.length;
    if (minRating > 0) count++;
    if (inStockOnly) count++;
    if (discountOnly) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPriceBound) count++;
    return count;
  }, [selectedCategories, minRating, inStockOnly, discountOnly, priceRange, maxPriceBound]);

  const hasActiveFilters = activeFilterCount > 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Bar Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 py-6 md:py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-4">
            {query ? `Search Results` : 'Find Products'}
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 md:pr-32 py-3 md:py-4 rounded-xl text-base md:text-lg border-0 shadow-lg focus:ring-2 focus:ring-white/50 outline-none"
            />
            <Button
              type="submit"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700"
            >
              Search
            </Button>
          </form>
          {query && (
            <p className="text-white/90 mt-3 text-center text-sm md:text-base">
              Showing results for "<span className="font-semibold text-white">{query}</span>"
              {!loading && (
                <span className="block md:inline md:ml-2">
                  • {filteredResults.length} {filteredResults.length === 1 ? 'product' : 'products'} found
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700 text-sm">
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear all</span>
              </Button>
            )}
            
            {/* Results count on mobile */}
            <span className="text-sm text-gray-500 md:hidden">
              {filteredResults.length} results
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-2 sm:px-4 py-2 pr-8 sm:pr-10 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer max-w-[140px] sm:max-w-none"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Best Deals</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* View Toggle - Always visible */}
            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 sm:p-2 ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 sm:p-2 ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}
          
          {/* Filters Sidebar / Mobile Drawer */}
          <div className={`
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
            w-[280px] sm:w-[320px] lg:w-64 flex-shrink-0
            transform transition-transform duration-300 ease-in-out
            lg:transform-none
            ${!showFilters && 'lg:hidden'}
          `}>
            <div className="bg-white h-full lg:h-auto lg:rounded-xl shadow-xl lg:shadow-sm p-4 md:p-5 lg:sticky lg:top-24 space-y-5 md:space-y-6 overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between lg:hidden border-b pb-3 mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="text-sm text-gray-500">No categories</p>
                    ) : (
                      categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 capitalize flex-1 group-hover:text-indigo-600">
                            {cat}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({categoryCounts[cat] || 0})
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="0"
                        max={maxPriceBound}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$0</span>
                        <span>${maxPriceBound}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Min</label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value));
                            setPriceRange([val, Math.max(val, priceRange[1])]);
                          }}
                          className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-indigo-500"
                          min="0"
                        />
                      </div>
                      <span className="text-gray-400 mt-5">-</span>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Max</label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => {
                            const val = Math.max(priceRange[0], Number(e.target.value));
                            setPriceRange([priceRange[0], val]);
                          }}
                          className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-indigo-500"
                          min={priceRange[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rating }, (_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">& up</span>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">All ratings</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Availability</h3>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <Package className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600">In Stock Only</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={(e) => setDiscountOnly(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <Percent className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600">On Sale Only</span>
                  </label>
                </div>
                
                {/* Mobile Apply Button */}
                <div className="lg:hidden pt-4 border-t mt-4">
                  <Button 
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Show {filteredResults.length} Results
                  </Button>
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="w-full mt-2"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-100 rounded-lg md:bg-transparent md:p-0">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs md:text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    <span className="capitalize">{cat}</span>
                    <button
                      onClick={() => removeCategory(cat)}
                      className="ml-0.5 hover:text-indigo-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < maxPriceBound) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs md:text-sm rounded-full">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, maxPriceBound])}
                      className="ml-0.5 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs md:text-sm rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    {minRating}+ stars
                    <button
                      onClick={() => setMinRating(0)}
                      className="ml-0.5 hover:text-yellow-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs md:text-sm rounded-full">
                    <Package className="w-3 h-3" />
                    In Stock
                    <button
                      onClick={() => setInStockOnly(false)}
                      className="ml-0.5 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {discountOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 text-xs md:text-sm rounded-full">
                    <Percent className="w-3 h-3" />
                    On Sale
                    <button
                      onClick={() => setDiscountOnly(false)}
                      className="ml-0.5 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 md:py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                </div>
                <span className="mt-4 text-gray-600 font-medium">Searching products...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Something went wrong</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && query && filteredResults.length === 0 && (
              <div className="text-center py-12 md:py-20 bg-white rounded-xl shadow-sm">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                </div>
                <p className="text-lg md:text-xl font-semibold text-gray-800 mb-2">No products found</p>
                <p className="text-gray-500 mb-6 max-w-md mx-auto px-4">
                  {hasActiveFilters
                    ? "We couldn't find products matching your filters. Try adjusting them."
                    : `No results for "${query}". Try a different search term.`}
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} className="bg-indigo-600 hover:bg-indigo-700">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}

            {/* Empty Query */}
            {!query && (
              <div className="text-center py-12 md:py-20 bg-white rounded-xl shadow-sm">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-indigo-600" />
                </div>
                <p className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Search for products</p>
                <p className="text-gray-500 max-w-md mx-auto px-4">
                  Enter a search term above to find products in our catalog
                </p>
              </div>
            )}

            {/* Grid View */}
            {!loading && viewMode === "grid" && filteredResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                {filteredResults.map((item) => {
                  const discountedPrice = getDiscountedPrice(
                    item.price,
                    item.discountpercentage || 0
                  );
                  const hasDiscount = item.discountpercentage > 0;

                  return (
                    <Link href={`/product-info/${item.id}`} key={item.id}>
                      <div className="bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">
                        {/* Image */}
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={item.thumbnail || "/placeholder.png"}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.png";
                            }}
                          />
                          {hasDiscount && (
                            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                              -{Math.round(item.discountpercentage)}%
                            </div>
                          )}
                          {item.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold text-xs md:text-sm">
                                Out of Stock
                              </span>
                            </div>
                          )}
                          {item.stock > 0 && item.stock <= 5 && (
                            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-orange-500 text-white text-[10px] md:text-xs font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                              Only {item.stock} left
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-2.5 md:p-4 flex-1 flex flex-col">
                          <p className="text-[10px] md:text-xs text-indigo-600 font-medium uppercase tracking-wide mb-0.5 md:mb-1">
                            {item.category}
                          </p>
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-1.5 md:mb-2 group-hover:text-indigo-600 transition-colors flex-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-0.5 md:gap-1 mb-2 md:mb-3">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 md:w-4 md:h-4 ${
                                    i < Math.floor(item.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] md:text-sm text-gray-500 ml-0.5 md:ml-1">
                              ({item.rating?.toFixed(1)})
                            </span>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
                            <span className="text-base md:text-xl font-bold text-gray-900">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs md:text-sm text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {!loading && viewMode === "list" && filteredResults.length > 0 && (
              <div className="space-y-3 md:space-y-4">
                {filteredResults.map((item) => {
                  const discountedPrice = getDiscountedPrice(
                    item.price,
                    item.discountpercentage || 0
                  );
                  const hasDiscount = item.discountpercentage > 0;

                  return (
                    <Link href={`/product-info/${item.id}`} key={item.id}>
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="w-full sm:w-40 md:w-48 h-40 sm:h-40 md:h-48 flex-shrink-0 bg-gray-100 relative">
                          <img
                            src={item.thumbnail || "/placeholder.png"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.png";
                            }}
                          />
                          {hasDiscount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{Math.round(item.discountpercentage)}%
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
                                {item.category}
                              </p>
                              <h3 className="font-semibold text-base md:text-lg text-gray-900 line-clamp-2 sm:line-clamp-1 mb-1 md:mb-2 hover:text-indigo-600 transition-colors">
                                {item.title}
                              </h3>
                            </div>
                            <span
                              className={`text-xs md:text-sm font-medium whitespace-nowrap px-2 py-1 rounded-full ${
                                item.stock > 10
                                  ? "bg-green-100 text-green-700"
                                  : item.stock > 0
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.stock > 0
                                ? item.stock > 10
                                  ? "In Stock"
                                  : `${item.stock} left`
                                : "Out of Stock"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">{renderStars(item.rating)}</div>
                            <span className="text-sm text-gray-500">
                              ({item.rating?.toFixed(1)})
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2 md:mb-3 flex-1 hidden sm:block">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl md:text-2xl font-bold text-gray-900">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              {hasDiscount && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {hasDiscount && (
                              <span className="text-sm text-green-600 font-medium hidden sm:block">
                                Save ${(item.price - discountedPrice).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

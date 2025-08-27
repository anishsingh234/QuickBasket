// @ts-nocheck
import React from "react";
import ImageSlider from "./_components/Slider";
import ProductCard from "./_components/ProductCard";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import CategoryCard from "./_components/CategoryCard";

export default async function HomePage() {
  let product1: any[] = [];
  let product2: any[] = [];
  let data;
  try {
    const response = await fetch("http://localhost:3000/api/product", {
      cache: "no-store",
    });
    data = await response.json();
    product1 = data?.data1 || [];
    product2 = data?.data2 || [];
  } catch (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-semibold text-lg">
        Server error. Please try again later.
      </div>
    );
  }
  const { data3 = [], data4 = [], data5 = [] } = data;

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Slider */}
      <div className="shadow-md">
        <ImageSlider />
      </div>

      {/* Sports Section */}
      <section className="mt-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Grab the best deal on{" "}
            <span className="text-blue-600">Sports Collection</span>
          </h2>
          <button className="text-blue-600 text-sm font-medium hover:underline transition">
            View All →
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6">
          {product1.map((elem, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 bg-white rounded-2xl shadow hover:shadow-lg transition duration-200"
            >
              <ProductCard product={elem} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Explore <span className="text-blue-600">Top Picks</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="Groceries"
            icon={<span>🛒</span>}
            products={data3}
            viewAllLink="/search?q=groceries"
            theme="green"
          />
          <CategoryCard
            title="Vehicles"
            icon={<span>🚗</span>}
            products={data4}
            viewAllLink="/search?q=vehicle"
            theme="blue"
          />
          <CategoryCard
            title="Beauty"
            icon={<span>💄</span>}
            products={data5}
            viewAllLink="/search?q=beauty"
            theme="pink"
          />
        </div>
      </section>
      {/* Womens Section */}
      <section className="mt-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Grab the best deal on{" "}
            <span className="text-blue-600">Women’s Collection</span>
          </h2>
          <button className="text-blue-600 text-sm font-medium hover:underline transition">
            View All →
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6">
          {product2.map((elem, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 bg-white rounded-2xl shadow hover:shadow-lg transition duration-200"
            >
              <ProductCard product={elem} />
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}

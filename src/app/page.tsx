// @ts-nocheck
import React from "react";
import ImageSlider from "./_components/Slider";
import ProductCard from "./_components/ProductCard";
import Footer from "./_components/Footer";
import Header from "./_components/Header";

export default async function HomePage() {
  let product1: any[] = [];
  let product2: any[] = [];

  try {
    const response = await fetch("http://localhost:3000/api/product", {
      cache: "no-store",
    });
    const data = await response.json();
    product1 = data?.data1 || [];
    product2 = data?.data2 || [];
  } catch (error) {
    return <>Server error</>;
  }

  return (
    <div className="bg-gray-50">
      <Header/>
      {/* Hero Slider */}
      <ImageSlider />

      {/* Section 1 */}
      <section className="mt-10 px-6">
        <div className="flex justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Grab the best deal on{" "}
            <span className="text-blue-600">Sports Collection</span>
          </h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            View All →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {product1.map((elem, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              {/* 👆 fixed width to avoid overlapping */}
              <ProductCard product={elem} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 2 */}
      <section className="mt-10 px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Grab the best deal on{" "}
            <span className="text-blue-600">Womens Collection</span>
          </h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            View All →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {product2.map((elem, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              {/* 👆 fixed width */}
              <ProductCard product={elem} />
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </div>
  );
}

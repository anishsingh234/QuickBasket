"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const images = [
  "/img1.webp",
  "/img2.webp",
  "/img3.webp",
  "/img4.webp",
  "/img5.webp",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // auto-slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-8xl mx-auto overflow-hidden rounded mt-5">
      {/* Images */}
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full flex-shrink-0"
            width={800}
            height={160}
          />
        ))}
      </div>

      {/* Left button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        <ChevronLeft />
      </button>

      {/* Right button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-2 rounded-full ${idx === current ? "bg-black" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

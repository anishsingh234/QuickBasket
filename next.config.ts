import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config) {
    // ignore Windows protected folders
    config.watchOptions = {
      ignored: [
        "**/node_modules/**",
        "**/.next/**",
        "C:/Users/Lenovo/Cookies",
        "C:/Users/Lenovo/AppData/**",
      ],
    };
    return config;
  },
};

export default nextConfig;

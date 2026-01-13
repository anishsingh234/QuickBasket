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
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Output configuration for deployment
  output: "standalone",
  
  // Fix Windows permission issues during build
  webpack(config, { isServer }) {
    config.watchOptions = {
      ignored: [
        "**/node_modules/**",
        "**/.next/**",
        "**/.git/**",
        "C:/Users/*/Application Data/**",
        "C:/Users/*/Cookies/**",
        "C:/Users/*/AppData/**",
        "C:/Users/*/Local Settings/**",
      ],
    };
    return config;
  },
};

export default nextConfig;

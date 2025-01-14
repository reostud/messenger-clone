import type { NextConfig } from "next";

//const nextConfig: NextConfig = {
/* config options here */
//swcPlugins: [["next-superjson-plugin", {}]],
//images: {
//domains: [
//"res.cloudinary.com",
//"avatars.githubusercontent.com",
//"lh3.googleusercontent.com",
//],
//},
//};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if\
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

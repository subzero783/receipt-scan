/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true, // Log full URLs for fetch requests
    },
    hmrRefreshes: true, // Log HMR refreshes
  },
};

export default nextConfig;

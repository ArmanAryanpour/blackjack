/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: isProd ? "/blackjack/" : "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

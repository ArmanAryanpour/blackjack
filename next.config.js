/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: isProd ? "/blackjack/" : "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

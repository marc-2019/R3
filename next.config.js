/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Remove serverActions since it's now available by default
  },
};

module.exports = nextConfig;
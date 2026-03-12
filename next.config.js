/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow local image previews from uploads folder
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Required for Vercel serverless functions with larger payloads (image/audio uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

module.exports = nextConfig;

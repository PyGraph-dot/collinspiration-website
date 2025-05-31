/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVE OR SET TO FALSE FOR PRODUCTION
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  images: {
    unoptimized: false, // <--- CHANGE THIS TO FALSE for optimization
    // If you are loading images from external domains (like Cloudinary),
    // you MUST add them here:
    // domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@next/font/google'],
  },
}
export default nextConfig
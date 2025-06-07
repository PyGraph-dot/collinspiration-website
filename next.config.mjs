/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configs ...
  images: {
    unoptimized: false, // Keep this as false for optimization
    remotePatterns: [ // This is the correct, modern way to configure external image hosts
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '**',
      },
      // NEW: Allow images from placehold.co
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '**',
      },
      // Add any other external image hosts here
    ],
  },
  // ... rest of your next.config.mjs ...
};

export default nextConfig;

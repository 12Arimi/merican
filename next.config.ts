import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // If anyone (or any bot) hits the bare domain
        source: '/',
        destination: '/en',
        permanent: true, // This sends the 308 code bots love
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lxvghczvmslyiiyrpzaw.supabase.co',
      },
    ],
  },
};

export default nextConfig;
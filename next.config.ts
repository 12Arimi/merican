import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
      // --- SERVICES & PROJECTS ---
      // This catches /services, /en/services, /sw/services, etc.
      {
        source: '/:lang(en|sw|fr|es|de|it)/services/:path*',
        destination: '/:lang/services-projects',
        permanent: true,
      },
      {
        source: '/services/:path*',
        destination: '/services-projects',
        permanent: true,
      },
      {
        source: '/:lang(en|sw|fr|es|de|it)/projects/:path*',
        destination: '/:lang/services-projects',
        permanent: true,
      },
      {
        source: '/projects/:path*',
        destination: '/services-projects',
        permanent: true,
      },

      // --- CLIENTS & PARTNERS ---
      // This specifically fixes the /en/clients issue you found
      {
        source: '/:lang(en|sw|fr|es|de|it)/clients/:path*',
        destination: '/:lang/partners-clients',
        permanent: true,
      },
      {
        source: '/clients/:path*',
        destination: '/partners-clients',
        permanent: true,
      },
      {
        source: '/:lang(en|sw|fr|es|de|it)/partners/:path*',
        destination: '/:lang/partners-clients',
        permanent: true,
      },
      {
        source: '/partners/:path*',
        destination: '/partners-clients',
        permanent: true,
      },

      // --- ORDERS ---
      {
        source: '/:lang(en|sw|fr|es|de|it)/order/:path*',
        destination: '/:lang/request-for-quote',
        permanent: true,
      },
      {
        source: '/order/:path*',
        destination: '/request-for-quote',
        permanent: true,
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
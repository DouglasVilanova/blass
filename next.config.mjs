/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    // Single string — same pattern as working 4tentos config
    // frame-ancestors replaces X-Frame-Options (no need for both)
    value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.analytics.google.com *.googleadservices.com *.doubleclick.net *.facebook.com *.facebook.net; " +
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' fonts.gstatic.com data:; " +
      "connect-src 'self' *.supabase.co *.supabase.in *.googletagmanager.com *.google-analytics.com analytics.google.com *.googleadservices.com www.google.com *.google.com.br *.doubleclick.net *.facebook.net; " +
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.facebook.com; " +
      "frame-ancestors 'self';",
  },
];

const nextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year — aggressive proxy cache for /_next/image
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },

  transpilePackages: ["lucide-react"],
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;

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
    // A cota de otimizacao de imagem da Vercel se esgotou e toda transformacao
    // nova passou a responder 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED),
    // quebrando imagens de forma intermitente: as ja cacheadas abriam, as novas nao.
    //
    // Nao dependemos desse otimizador: lib/upload.ts ja converte todo upload para
    // WebP com Sharp e limita a dimensao (1600px produtos/blog, 2400px banners),
    // entao o arquivo que sai do bucket ja chega pronto e leve (~60 KB).
    //
    // Com unoptimized, o next/image serve a URL original e nao consome cota.
    // Para reativar a otimizacao (exige plano Vercel com cota disponivel),
    // basta remover esta linha.
    unoptimized: true,

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
      // Assets de marca (/public/novo) — mudam só em deploy → cache forte com revalidação.
      {
        source: "/novo/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      // Fontes self-hosted — praticamente imutáveis.
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Favicon.
      {
        source: "/icon.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000" },
        ],
      },
    ];
  },
};

export default nextConfig;

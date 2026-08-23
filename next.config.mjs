/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // Do not advertise the framework version to attackers.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Stop MIME sniffing (an uploaded file cannot be coerced into script).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Disallow framing to prevent clickjacking of the admin UI.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Trim the referrer sent to third parties.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Drop access to device APIs the site never uses.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // Admin pages must never be cached by a proxy or the browser.
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/api/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;

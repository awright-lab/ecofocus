import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'google-fonts' },
    },
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|webp|ico)$/i,
      handler: 'CacheFirst',
      options: { cacheName: 'images' },
    },
    {
      urlPattern: /^https:\/\/.*\.(css|js)$/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-resources' },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // ✅ Important for static export or PWA conflicts
  },
};

export default withPWA(nextConfig);


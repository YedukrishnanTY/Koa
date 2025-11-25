import withPWA from 'next-pwa';

const pwa = withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // empty turbopack config prevents the startup error
  turbopack: {}
};

export default pwa(nextConfig);

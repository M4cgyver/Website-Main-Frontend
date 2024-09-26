/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('bun:sqlite');
    return config;
  },

  experimental: {
    ppr: true,
  },
}

export default nextConfig;
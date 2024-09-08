/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.externals.push('bun:sqlite');
      return config;
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        ppr: true,
    },
}

export default nextConfig;
/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')()
const nextConfig = removeImports({
    reactStrictMode: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    webpack(config) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            bufferutil: require.resolve('bufferutil'),
            net: require.resolve('net'),
            request: require.resolve('request'),
            tls: require.resolve('tls'),
            'utf-8-validate': require.resolve('utf-8-validate'),
        };

        return config;
    },
})

module.exports = nextConfig

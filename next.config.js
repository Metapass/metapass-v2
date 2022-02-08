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
})

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')()
const { withSentryConfig } = require('@sentry/nextjs')
const nextConfig = removeImports({
    reactStrictMode: true,
    sentry: {
        // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
        // for client-side builds. (This will be the default starting in
        // `@sentry/nextjs` version 8.0.0.) See
        // https://webpack.js.org/configuration/devtool/ and
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
        // for more information.
        hideSourceMaps: true,
    },
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
        }

        return config
    },
})

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
}
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)

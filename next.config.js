/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();
const nextConfig = removeImports({
  reactStrictMode: true,
  swc: true,
});

module.exports = nextConfig;

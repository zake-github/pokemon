/** @type {import('next').NextConfig} */
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const nextConfig = {
  // experimental: {
  //   outputStandalone: true,
  // },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/play/**'
      }
    ]
  }
};

module.exports = nextConfig;

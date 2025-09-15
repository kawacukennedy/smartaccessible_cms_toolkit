/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'i18next',
    'i18next-browser-languagedetector',
    'i18next-http-backend',
    'react-i18next',
    'styled-jsx',
  ],
};

export default nextConfig;

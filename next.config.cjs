/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  swcMinify: true,
  webpack: (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return webpackConfig;
  },
};

module.exports = config;

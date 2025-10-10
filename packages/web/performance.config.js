// Performance Configuration for Webpack and Build Optimization
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  // Webpack optimization configuration
  optimization: {
    // Code splitting
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunks
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // React and related libraries
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        // UI libraries
        ui: {
          test: /[\\/]node_modules[\\/](lucide-react|@headlessui|tailwindcss)[\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 15,
        },
        // Analytics and monitoring
        analytics: {
          test: /[\\/]lib[\\/](analytics|performance|telemetry)[\\/]/,
          name: 'analytics',
          chunks: 'all',
          priority: 5,
        },
        // Media processing
        media: {
          test: /[\\/]lib[\\/](mediaProcessor|aiWorkflows)[\\/]/,
          name: 'media',
          chunks: 'all',
          priority: 5,
        },
      },
    },

    // Minimize bundle size
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            drop_debugger: process.env.NODE_ENV === 'production',
            pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : [],
          },
          mangle: {
            safari10: true,
          },
        },
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],

    // Runtime chunk for better caching
    runtimeChunk: 'single',
  },

  // Plugins for performance optimization
  plugins: [
    // Bundle analyzer (only in development)
    ...(process.env.ANALYZE === 'true' ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false,
      }),
    ] : []),

    // Compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // Only compress files larger than 10KB
      minRatio: 0.8,
    }),

    // Brotli compression (if supported)
    ...(typeof CompressionPlugin !== 'undefined' ? [
      new CompressionPlugin({
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        compressionOptions: {
          level: 11,
        },
      }),
    ] : []),
  ],

  // Module optimization
  module: {
    rules: [
      // Image optimization
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images/',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },

      // Font optimization
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },

  // Performance budgets
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 1048576, // 1MB

    // Custom asset filter
    assetFilter: (assetFilename) => {
      // Don't warn for source maps, images, or fonts
      return !/\.(map|png|jpe?g|gif|svg|webp|woff|woff2|eot|ttf|otf)$/.test(assetFilename);
    },
  },

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    devServer: {
      // Enable hot module replacement
      hot: true,

      // Enable compression
      compress: true,

      // Optimize dev server performance
      watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
      },

      // Performance hints
      performance: {
        hints: false,
      },
    },
  }),
};

// Performance monitoring utilities
const performanceUtils = {
  // Measure bundle size
  measureBundleSize: (stats) => {
    const assets = stats.assets || [];
    const jsAssets = assets.filter(asset => asset.name.endsWith('.js'));
    const cssAssets = assets.filter(asset => asset.name.endsWith('.css'));

    const totalJsSize = jsAssets.reduce((sum, asset) => sum + asset.size, 0);
    const totalCssSize = cssAssets.reduce((sum, asset) => sum + asset.size, 0);

    console.log('📦 Bundle Size Report:');
    console.log(`  JavaScript: ${(totalJsSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  CSS: ${(totalCssSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total: ${((totalJsSize + totalCssSize) / 1024 / 1024).toFixed(2)} MB`);

    // Warn if bundle is too large
    if (totalJsSize > 512 * 1024) {
      console.warn('⚠️  JavaScript bundle exceeds 512KB budget');
    }
    if (totalCssSize > 100 * 1024) {
      console.warn('⚠️  CSS bundle exceeds 100KB budget');
    }
  },

  // Analyze chunks
  analyzeChunks: (stats) => {
    const chunks = stats.chunks || [];
    console.log('🔍 Chunk Analysis:');

    chunks.forEach(chunk => {
      const size = chunk.size / 1024; // KB
      console.log(`  ${chunk.names.join(', ') || 'unnamed'}: ${size.toFixed(2)} KB`);
    });
  },

  // Generate performance report
  generateReport: (stats) => {
    const report = {
      timestamp: new Date().toISOString(),
      buildTime: stats.buildTime,
      hash: stats.hash,
      assets: stats.assets?.map(asset => ({
        name: asset.name,
        size: asset.size,
        sizeKB: (asset.size / 1024).toFixed(2),
      })),
      chunks: stats.chunks?.map(chunk => ({
        id: chunk.id,
        names: chunk.names,
        size: chunk.size,
        sizeKB: (chunk.size / 1024).toFixed(2),
      })),
    };

    // Save report to file
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(process.cwd(), 'performance-report.json');

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('📊 Performance report saved to:', reportPath);
  },
};

module.exports.performanceUtils = performanceUtils;
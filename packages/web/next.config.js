require('dotenv').config()

const withSass = require('@zeit/next-sass')
const withMDX = require('@next/mdx')()

module.exports = withMDX(
  withSass({
    target: 'serverless',
    env: {
      PR_GA_TRACKING_ID: process.env.PR_GA_TRACKING_ID,
      PR_GITHUB_CLIENT_ID: process.env.PR_GITHUB_CLIENT_ID,
      PR_API_ENDPOINT: process.env.PR_API_ENDPOINT,
    },
    cssModules: true,
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty',
          net: 'empty',
          tls: 'empty',
        }
      }

      return {
        ...config,
        module: {
          ...config.module,
          rules: [
            ...config.module.rules,
            {
              test: /\.md$/,
              use: 'raw-loader',
            },
          ],
        },
      }
    },
  })
)

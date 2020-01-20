require('dotenv').config()
const withSass = require('@zeit/next-sass')

module.exports = withSass({
  target: 'serverless',
  env: {
    PR_GA_TRACKING_ID: process.env.PR_GA_TRACKING_ID,
  },
  cssModules: true,
})

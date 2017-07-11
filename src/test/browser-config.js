'use strict'

const path = require('path')
const _ = require('lodash')

const timeout = require('../config/custom').timeout
const user = require('../config/user')

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'karma.conf.js')

function getPatterns (ctx) {
  if (ctx.files && ctx.files.length > 0) {
    return ctx.files
  }

  return [
    'test/browser.js',
    'test/**/*.spec.js'
  ]
}

function webworkerClient (ctx) {
  return {
    mochaWebWorker: {
      pattern: getPatterns(ctx),
      mocha: {
        timeout: timeout
      }
    }
  }
}

const defaultClient = {
  mocha: {
    timeout: timeout
  }
}

function getClient (isWebworker, ctx) {
  if (isWebworker) {
    return webworkerClient(ctx)
  }

  return defaultClient
}

function getConfig (isWebworker, ctx) {
  const ctxFiles = getPatterns(ctx).map((pattern) => ({
    pattern: pattern,
    included: !isWebworker
  }))

  const fixtureFiles = [{
    pattern: 'test/fixtures/**/*',
    watched: false,
    served: true,
    included: false
  }]
  const userKarma = user().karma
  const userFiles = userKarma.files || []

  return _.defaultsDeep({
    files: ctxFiles.concat(fixtureFiles).concat(userFiles)
  }, userKarma, {
    configFile: CONFIG_FILE,
    singleRun: !ctx.watch,
    watch: ctx.watch,
    frameworks: isWebworker ? ['mocha-webworker'] : ['mocha'],
    logLevel: ctx.verbose ? 'debug' : 'error',
    client: getClient(isWebworker, ctx),
    mochaOwnReporter: {
      reporter: ctx.verbose ? 'spec' : 'progress'
    }
  })
}

module.exports = getConfig

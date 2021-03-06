'use strict'

module.exports = {
  command: 'update-last-successful-build',
  desc: 'Update last known good build branch',
  builder: {
    branch: {
      describe: 'Which branch to update',
      type: 'string',
      default: 'build/last-successful'
    },
    remote: {
      describe: 'Which remote to use',
      type: 'string',
      default: 'origin'
    },
    message: {
      describe: 'The message to use when adding the shrinkwrap and yarn.lock file',
      type: 'string',
      default: 'chore: add lockfiles'
    }
  },
  handler (argv) {
    const cmd = require('../src/update-last-successful-build')
    return cmd(argv)
  }
}

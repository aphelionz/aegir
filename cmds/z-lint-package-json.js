'use strict'

const execa = require('execa')
const path = require('path')
const { fromAegir, fromRoot } = require('../src/utils')

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/tclindner/npm-package-json-lint#cli-commands-and-configuration
`

module.exports = {
  command: 'lint-package-json',
  desc: 'Lint package.json with aegir defaults.',
  aliases: ['lint-package', 'lpj'],
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
  },
  handler (argv) {
    const input = argv._.slice(1)
    const forwardOptions = argv['--'] ? argv['--'] : []
    const useBuiltinConfig = !forwardOptions.includes('--configFile')
    const config = useBuiltinConfig
      ? ['-c', fromAegir('src/config/.npmpackagejsonlintrc.json')]
      : []

    return execa('npmPkgJsonLint', [
      fromRoot('package.json'),
      ...config,
      ...input,
      ...forwardOptions
    ], {
      stdio: 'inherit',
      localDir: path.join(__dirname, '..'),
      preferLocal: true
    })
  }
}

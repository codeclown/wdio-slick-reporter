const chalk = require('chalk')
const events = require('events')
const util = require('util')
const SlickReporterState = require('./state')
const print = require('./print')
const render = require('./render')
const wrapLines = require('./wrapLines')

const factory = _process => {
  const SlickReporter = function(baseReporter, config, options) {
    SlickReporterState.call(this)

    this.process = _process

    if (config.maxInstances > 1) {
      this.process.stdout.write(chalk.yellow('Warning: wdio-slick-reporter is meant to be ran when maxInstances: 1') + '\n')
    }

    if (config.logLevel !== 'silent') {
      this.process.stdout.write(chalk.yellow('Warning: wdio-slick-reporter output can break when logLevel !== silent') + '\n')
    }

    let printing = true

    let previousLines = []

    this.on('change', runners => {
      if (!printing) {
        return
      }

      const rendered = render(runners, { colorize: true })

      // If a line naturally wraps to multiple lines in the terminal,
      // it messes up the ansi-escape eraseLines later
      const terminalColumns = this.process.stdout.columns
      const lines = wrapLines(terminalColumns, rendered)

      const changes = print(previousLines, lines)

      if (changes) {
        this.process.stdout.write(changes)
        previousLines = lines.concat()
      }
    })

    this.process.on('SIGINT', () => {
      printing = false
    })
  }

  SlickReporter.reporterName = 'SlickReporter';

  util.inherits(SlickReporter, SlickReporterState)

  return SlickReporter
}

const SlickReporter = factory(process)

// Allow injecting process for testing purposes
SlickReporter.factory = factory

exports = module.exports = SlickReporter

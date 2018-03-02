const chalk = require('chalk')
const events = require('events')
const util = require('util')
const { eraseLines } = require('ansi-escapes')
const SlickReporterState = require('./state')
const render = require('./render')
const wrapLines = require('./wrapLines')

const SlickReporter = function(baseReporter, config, options) {
  SlickReporterState.call(this)

  if (config.maxInstances > 1) {
    console.log(chalk.yellow('Warning: wdio-slick-reporter is meant to be ran when maxInstances: 1'))
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
    const terminalColumns = process.stdout.columns
    const lines = wrapLines(terminalColumns, rendered)

    let firstMismatch = null
    for (let i = 0; i < Math.max(lines.length, previousLines.length); i++) {
      if (lines[i] !== previousLines[i]) {
        firstMismatch = i
        break
      }
    }

    if (firstMismatch !== null) {
      const linesToUpdate = lines.slice(firstMismatch)

      // + 1 for automatic newline (current cursor line) in terminal
      const linesToErase = previousLines.length - firstMismatch + 1

      process.stdout.write(eraseLines(linesToErase))
      linesToUpdate.forEach(line => {
        console.log(line)
      })

      previousLines = lines.concat()
    }
  })

  process.on('SIGINT', () => {
    printing = false
  })
}

SlickReporter.reporterName = 'SlickReporter';

util.inherits(SlickReporter, SlickReporterState)

exports = module.exports = SlickReporter

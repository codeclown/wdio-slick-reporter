const chalk = require('chalk')
const events = require('events')
const util = require('util')
const { eraseLines } = require('ansi-escapes')
const SlickReporterState = require('./state')
const render = require('./render')

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

    const lines = render(runners, chalk)

    const firstMismatch = lines.findIndex((line, index) => line !== previousLines[index])
    const linesToUpdate = lines.slice(firstMismatch)

    // Don't erase more than this program has printed
    const linesToErase = Math.min(previousLines.length, linesToUpdate.length + 1)

    process.stdout.write(eraseLines(linesToErase))

    linesToUpdate.forEach(line => {
      console.log(line)
    })

    previousLines = lines.concat()
  })

  process.on('SIGINT', () => {
    printing = false
  })
}

SlickReporter.reporterName = 'SlickReporter';

util.inherits(SlickReporter, SlickReporterState)

exports = module.exports = SlickReporter

const chalk = require('chalk')
const jsonDiff = require('json-diff')

const noColor = new chalk.constructor({level: 0})

const render = (runners, { colorize }) => {
  const colors = colorize ? chalk : noColor

  const output = []

  runners.forEach(runner => {
    const runnerOutput = []
    runnerOutput.push(
      colors[runner.tests.passed.length ? 'green' : 'gray'](`${runner.tests.passed.length} passed`) + '  ' +
      colors[runner.tests.failed.length ? 'red' : 'gray'](`${runner.tests.failed.length} failed`) + '  ' +
      colors[runner.tests.pending.length ? 'cyan' : 'gray'](`${runner.tests.pending.length} pending`)
    )
    if (runner.tests.failed.length) {
      runnerOutput.push('')
      runnerOutput.push(colors.red.bold('Failures:'))
      runner.tests.failed.forEach(test => {
        runnerOutput.push('')
        runnerOutput.push(colors.gray('  - ') + test.fullTitle)
        if (test.screenshotFilename) {
          runnerOutput.push(colors.gray('    Screenshot:'))
          runnerOutput.push(colors.gray(`      ${runner.screenshotPath}/${test.screenshotFilename}`))
        }
        if (test.err.hasOwnProperty('expected') && test.err.hasOwnProperty('actual')) {
          const diff = jsonDiff.diffString(test.err.expected, test.err.actual, { color: colorize })
          const diffLines = diff.split('\n').slice(0, -1) // Ignore last (empty) line
          runnerOutput.push(colors.gray('    Assertion error, diff:'))
          diffLines.forEach(line => {
            runnerOutput.push(colors.gray('        ') + line)
          })
        } else if (test.err.stack) {
          runnerOutput.push(colors.gray('    Stack:'))
          test.err.stack.split("\n").forEach(line => {
            runnerOutput.push(colors.gray('      ' + line))
          })
        } else {
          runnerOutput.push(colors.gray('    Error:'))
          runnerOutput.push(colors.gray('      ' + test.err.message))
        }
      })
    }
    if (runner.currentTest) {
      runnerOutput.push('')
      runnerOutput.push(colors.gray('❯ ') + colors.bold(runner.currentTest) + colors.gray(' (currently running)'))
    }
    runnerOutput.push('')
    runnerOutput.push('')
    output.push('')
    output.push(colors.bold(runner.cid) + '  ' + runner.specs.join(' '))
    const paddingLeft = ' '.repeat(runner.cid.length + 2)
    runnerOutput.forEach(line => {
      output.push(line ? paddingLeft + line : '')
    })
  })

  return output
}

exports = module.exports = render

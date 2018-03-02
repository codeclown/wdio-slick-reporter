const chalk = require('chalk')
const jsonDiff = require('json-diff')

const noColor = new chalk.constructor({level: 0})

const render = (runners, { colorize }) => {
  const colors = colorize ? chalk : noColor

  const output = []

  runners.forEach(runner => {
    output.push('')
    output.push(colors.bold(runner.cid) + ' ' + runner.specs.join(' '))
    output.push('  ' +
      colors[runner.tests.passed.length ? 'green' : 'gray'](`${runner.tests.passed.length} passed`) + '  ' +
      colors[runner.tests.failed.length ? 'red' : 'gray'](`${runner.tests.failed.length} failed`) + '  ' +
      colors[runner.tests.pending.length ? 'cyan' : 'gray'](`${runner.tests.pending.length} pending`)
    )
    if (runner.currentTest) {
      output.push('')
      output.push(colors.gray('  ❯ ') + colors.bold(runner.currentTest) + colors.gray(' (currently running)'))
    }
    if (runner.tests.failed.length) {
      output.push('')
      output.push(colors.red('  Failures:'))
      runner.tests.failed.forEach(test => {
        const screenshot = test.screenshotFilename ? colors.gray(`  →  ${runner.screenshotPath}/${test.screenshotFilename}`) : ''
        output.push(colors.gray('    - ') + test.fullTitle + screenshot)
        if (test.err.hasOwnProperty('expected') && test.err.hasOwnProperty('actual')) {
          const diff = jsonDiff.diffString(test.err.expected, test.err.actual, { color: colorize })
          const diffLines = diff.split('\n').slice(0, -1) // Ignore last (empty) line
          output.push(colors.gray('      Assertion error, diff:'))
          diffLines.forEach(line => {
            output.push(colors.gray('          ') + line)
          })
        } else {
          output.push(colors.gray('      Error:'))
          output.push(colors.gray('        ' + test.err.message))
        }
        if (test.err.stack) {
          output.push(colors.gray('      Stack:'))
          test.err.stack.split("\n").forEach(line => {
            output.push(colors.gray('        ' + line))
          })
        }
      })
    }
    output.push('')
  })

  return output
}

exports = module.exports = render

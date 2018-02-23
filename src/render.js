const render = (runners, chalk) => {
  const output = []

  runners.forEach(runner => {
    output.push('')
    output.push(chalk.bold(runner.cid) + ' ' + runner.specs.join(' '))
    output.push('  ' +
      chalk[runner.tests.passed.length ? 'green' : 'gray'](`${runner.tests.passed.length} passed`) + '  ' +
      chalk[runner.tests.failed.length ? 'red' : 'gray'](`${runner.tests.failed.length} failed`) + '  ' +
      chalk[runner.tests.pending.length ? 'cyan' : 'gray'](`${runner.tests.pending.length} pending`)
    )
    if (runner.currentTest) {
      output.push('')
      output.push(chalk.gray('  ❯ ') + chalk.bold(runner.currentTest) + chalk.gray(' (currently running)'))
    }
    if (runner.tests.failed.length) {
      output.push('')
      output.push(chalk.red('  Failures:'))
      runner.tests.failed.forEach(test => {
        const screenshot = test.screenshotFilename ? chalk.gray(`  →  ${runner.screenshotPath}/${test.screenshotFilename}`) : ''
        output.push(chalk.gray('    - ') + test.fullTitle + screenshot)
        output.push(chalk.gray('      Error:'))
        output.push(chalk.gray('        ' + test.err.message))
        if (test.err.stack) {
          output.push(chalk.gray('      Stack:'))
          test.err.stack.split("\n").forEach(line => {
            output.push(chalk.gray('        ' + line))
          })
        }
      })
    }
    output.push('')
  })

  return output
}

exports = module.exports = render

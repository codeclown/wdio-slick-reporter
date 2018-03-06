const events = require('events')
const util = require('util')

const SlickReporterState = function() {
  const runners = []
  this.runners = runners

  this.on('runner:start', runner => {
    runners.push({
      cid: runner.cid,
      specs: runner.specs,
      currentTest: null,
      screenshotPath: runner.config.screenshotPath,
      pendingScreenshot: null,
      tests: {
        passed: [],
        failed: [],
        pending: []
      }
    })
    this.emit('change', runners)
  })

  this.on('test:start', test => {
    const runner = runners.find(runner => runner.cid === test.cid)
    runner.currentTest = test.fullTitle
    this.emit('change', runners)
  })

  this.on('test:pending', test => {
    const runner = runners.find(runner => runner.cid === test.cid)
    runner.tests.pending.push(test)
    this.emit('change', runners)
  })

  this.on('test:pass', test => {
    const runner = runners.find(runner => runner.cid === test.cid)
    runner.tests.passed.push(test)
    this.emit('change', runners)
  })

  this.on('runner:screenshot', shot => {
    const runner = runners.find(runner => runner.cid === shot.cid)
    runner.pendingScreenshot = shot
  })

  this.on('test:fail', test => {
    const runner = runners.find(runner => runner.cid === test.cid)
    if (runner.pendingScreenshot) {
      test.screenshotFilename = runner.pendingScreenshot.filename
      runner.pendingScreenshot = null
    }
    runner.tests.failed.push(test)
    this.emit('change', runners)
  })

  this.on('runner:end', asd => {
    const runner = runners.find(runner => runner.cid === asd.cid)
    runner.currentTest = null
    this.emit('change', runners)
  })
}

util.inherits(SlickReporterState, events.EventEmitter)

exports = module.exports = SlickReporterState

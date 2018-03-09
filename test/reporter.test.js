const assert = require('assert')
const { eraseLines } = require('ansi-escapes')
const SlickReporter = require('../src/reporter')

// Not necessary anywhere
const baseReporter = null
const options = null

// Suitable, recommended-viable base config
const config = {
  maxInstances: 1,
  logLevel: 'silent'
}

describe('reporter', () => {
  let writes
  let eventCallbacks
  let Reporter
  beforeEach(() => {
    writes = []
    eventCallbacks = {}
    Reporter = SlickReporter.factory({
      stdout: {
        columns: 80,
        write: data => {
          writes.push(data)
        }
      },
      on: (event, callback) => {
        eventCallbacks['process.' + event] = callback
      }
    })
  })

  it('warns if maxInstances !== 1', () => {
    const instance = new Reporter(baseReporter, Object.assign({}, config, { maxInstances: 2 }), options)
    assert.deepEqual(writes, [
      '\u001b[33mWarning: wdio-slick-reporter is meant to be ran when maxInstances: 1\u001b[39m\n'
    ])
  })

  it('warns if logLevel !== silent', () => {
    const instance = new Reporter(baseReporter, Object.assign({}, config, { logLevel: 'debug' }), options)
    assert.deepEqual(writes, [
      '\u001b[33mWarning: wdio-slick-reporter output can break when logLevel !== silent\u001b[39m\n'
    ])
  })

  it('does not print anything if configuration is valid', () => {
    const instance = new Reporter(baseReporter, config, options)
    assert.equal(writes.length, 0, 'should not have written anything')
  })

  it('prints upon state changes', () => {
    const instance = new Reporter(baseReporter, config, options)

    instance.emit('runner:start', {
      cid: '00-01',
      specs: ['./sample-file.js'],
      config: {
        screenshotPath: './shots'
      }
    })

    assert.equal(writes.length, 1)

    instance.emit('test:start', {
      cid: '00-01',
      fullTitle: 'Sample test'
    })

    assert.equal(writes.length, 2)
  })

  it('stops printing after SIGINT to prevent crazy flickering due to flow of events', () => {
    const instance = new Reporter(baseReporter, config, options)
    assert.equal(typeof eventCallbacks['process.SIGINT'], 'function', 'should register SIGINT listener')

    instance.emit('runner:start', {
      cid: '00-01',
      specs: ['./sample-file.js'],
      config: {
        screenshotPath: './shots'
      }
    })

    assert.equal(writes.length, 1)

    eventCallbacks['process.SIGINT']()

    instance.emit('test:start', {
      cid: '00-01',
      fullTitle: 'Sample test'
    })

    assert.equal(writes.length, 1, 'should not have written anymore')
  })

  it('handles output that wraps to multiple lines', () => {
    const instance = new Reporter(baseReporter, config, options)

    // This test exists because output would get messed up when erasing lines,
    // if any of the previous lines had wrapped to multiple lines in the terminal

    instance.emit('runner:start', {
      cid: '00-01',
      specs: ['./sample-file.js'],
      config: {
        screenshotPath: './shots'
      }
    })

    assert.equal(writes.length, 1)

    const longName = 'Very long test name, longer than process.stdout.columns and should therefore wrap to multiple lines'
    const wrapped = 'Very long test name, longer than process.stdout.columns a\nnd should therefore wrap to multiple lines'

    instance.emit('test:start', {
      cid: '00-01',
      fullTitle: longName
    })

    assert.equal(writes.length, 2)
    assert.equal(writes[1].includes(wrapped), true, 'did wrap long line')

    // Currently output looks like this:
    // ---
    //   00-01  ./sample-file.js
    //          0 passed  0 failed  0 pending
    //
    //          ❯ Very long test name, longer than process.stdout.columns a
    //   nd should therefore wrap to multiple lines (currently running)
    //
    //
    // ---

    instance.emit('test:pass', {
      cid: '00-01',
      fullTitle: longName
    })

    // Now output should look like this:
    // ---
    //   00-01  ./sample-file.js
    //          1 passed  0 failed  0 pending
    //
    //          ❯ Very long test name, longer than process.stdout.columns a
    //   nd should therefore wrap to multiple lines (currently running)
    //
    //
    // ---
    assert.equal(writes.length, 3)
    assert.equal(writes[2].startsWith(eraseLines(6) + '       \u001b[32m1 passed'), true, 'erased correct amount of lines')
  })
})

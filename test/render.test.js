const assert = require('assert')
const renderer = require('../src/render')
const SlickReporterState = require('../src/state')

const render = runners => renderer(runners, { colorize: false })

const sampleRunner = {
  cid: '00-01',
  specs: ['./sample-file.js'],
  config: {
    screenshotPath: './shots'
  }
}

const sampleTest = {
  cid: '00-01',
  fullTitle: 'Sample test'
}

describe('render', () => {
  let state
  beforeEach(() => {
    state = new SlickReporterState
  })

  it('renders empty state', () => {
    assert.deepEqual(render(state.runners), [])
  })

  it('renders a runner', () => {
    state.emit('runner:start', sampleRunner)

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  0 failed  0 pending',
      '',
      ''
    ])
  })

  it('renders currently running test', () => {
    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  0 failed  0 pending',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders amount of passed tests', () => {
    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('test:pass', sampleTest)

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  1 passed  0 failed  0 pending',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders amount of pending tests', () => {
    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('test:pending', sampleTest)

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  0 failed  1 pending',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders amount of failed tests and lists them', () => {
    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('test:fail', Object.assign({}, sampleTest, {
      err: {
        message: 'Foobar',
        stack: undefined
      }
    }))

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  1 failed  0 pending',
      '',
      '  Failures:',
      '',
      '    - Sample test',
      '      Error:',
      '        Foobar',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders stack for failed tests if available', () => {
    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('test:fail', Object.assign({}, sampleTest, {
      err: {
        message: 'Foobar',
        stack: 'stack example'
      }
    }))

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  1 failed  0 pending',
      '',
      '  Failures:',
      '',
      '    - Sample test',
      '      Stack:',
      '        stack example',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders diff if test failed with an assertion error', () => {
    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('test:fail', Object.assign({}, sampleTest, {
      err: {
        message: 'Foobar',
        expected: 'asd',
        actual: 'foo'
      }
    }))

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  1 failed  0 pending',
      '',
      '  Failures:',
      '',
      '    - Sample test',
      '      Assertion error, diff:',
      '          -"asd"',
      '          +"foo"',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders multi-line diff if test failed with an assertion error', () => {
    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('test:fail', Object.assign({}, sampleTest, {
      err: {
        message: 'Foobar',
        expected: { asd: true },
        actual: { foo: true }
      }
    }))

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  1 failed  0 pending',
      '',
      '  Failures:',
      '',
      '    - Sample test',
      '      Assertion error, diff:',
      '           {',
      '          -  asd: true',
      '          +  foo: true',
      '           }',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders paths to screenshots for failed tests', () => {
    const exampleShot = {
      cid: '00-01',
      filename: 'chrome-error-shot-example.png'
    }

    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('runner:screenshot', exampleShot)
    state.emit('test:fail', Object.assign({}, sampleTest, {
      err: {
        message: 'Foobar'
      }
    }))

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  0 passed  1 failed  0 pending',
      '',
      '  Failures:',
      '',
      '    - Sample test',
      '      Screenshot:',
      '        ./shots/chrome-error-shot-example.png',
      '      Error:',
      '        Foobar',
      '',
      '  ❯ Sample test (currently running)',
      '',
      ''
    ])
  })

  it('renders multiple runners', () => {
    const anotherRunner = {
      cid: '00-02',
      specs: ['./another-file.js'],
      config: {
        screenshotPath: './shots'
      }
    }

    state.emit('runner:start', sampleRunner)
    state.emit('test:start', sampleTest)
    state.emit('test:pass', sampleTest)
    state.emit('runner:end', sampleRunner)
    state.emit('runner:start', anotherRunner)

    assert.deepEqual(render(state.runners), [
      '',
      '00-01 ./sample-file.js',
      '  1 passed  0 failed  0 pending',
      '',
      '',
      '',
      '00-02 ./another-file.js',
      '  0 passed  0 failed  0 pending',
      '',
      ''
    ])
  })
})

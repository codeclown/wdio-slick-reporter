const assert = require('assert')
const wrapLines = require('../src/wrapLines')

describe('wrapLines', () => {
  it('supports 0 and empty lines', () => {
    assert.deepEqual(wrapLines(50, []), [])
    assert.deepEqual(wrapLines(50, ['']), [''])
  })

  it('does not wrap lines if not necessary', () => {
    assert.deepEqual(wrapLines(50, [
      'fool',
      'foobar'
    ]), [
      'fool',
      'foobar'
    ])
  })

  it('wraps lines that are too long', () => {
    assert.deepEqual(wrapLines(3, [
      'fool',
      'foobar'
    ]), [
      'foo',
      'l',
      'foo',
      'bar'
    ])

    assert.deepEqual(wrapLines(3, [
      'fool',
      'hm',
      'foobar'
    ]), [
      'foo',
      'l',
      'hm',
      'foo',
      'bar'
    ])

    assert.deepEqual(wrapLines(3, [
      'fool very long',
      'hm',
      'foobar'
    ]), [
      'foo',
      'l v',
      'ery',
      ' lo',
      'ng',
      'hm',
      'foo',
      'bar'
    ])
  })

  it('supports varying maxColumns', () => {
    assert.deepEqual(wrapLines(3, [
      'fool long'
    ]), [
      'foo',
      'l l',
      'ong'
    ])

    assert.deepEqual(wrapLines(4, [
      'fool long'
    ]), [
      'fool',
      ' lon',
      'g'
    ])

    assert.deepEqual(wrapLines(6, [
      'fool long'
    ]), [
      'fool l',
      'ong'
    ])
  })

  it('does not break colors', () => {
    assert.deepEqual(wrapLines(4, [
      '\u001b[90m0 passed\u001b[39m  \u001b[31m1 failed\u001b[39m  \u001b[90m0 pending\u001b[39m'
    ]), [
      '\u001b[90',
      'm0 p',
      'asse',
      'd\u001b[3',
      '9m  ',
      '\u001b[31',
      'm1 f',
      'aile',
      'd\u001b[3',
      '9m  ',
      '\u001b[90',
      'm0 p',
      'endi',
      'ng\u001b[',
      '39m'
    ])
  })
})

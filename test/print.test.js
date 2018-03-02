const assert = require('assert')
const print = require('../src/print')

describe('print', () => {
  it('supports 0 lines', () => {
    assert.deepEqual(print([], []), '')
  })

  it('returns an empty string if nothing changed', () => {
    const lines = [
      'first',
      'second'
    ]
    assert.deepEqual(print(lines, lines), '')
  })

  it('overwrites changed lines', () => {
    assert.deepEqual(print([
      'first',
      'second',
      'third'
    ], [
      'first',
      'second',
      'foobar'
    ]), '\u001b[2K\u001b[Gfoobar')

    assert.deepEqual(print([
      'first',
      'second',
      'third'
    ], [
      'first',
      'foobar',
      'third'
    ]), '\u001b[2K\u001b[1A\u001b[2K\u001b[Gfoobar\nthird')

    assert.deepEqual(print([
      'first',
      'second',
      'third'
    ], [
      'foobar',
      'second',
      'third'
    ]), '\u001b[2K\u001b[1A\u001b[2K\u001b[1A\u001b[2K\u001b[Gfoobar\nsecond\nthird')
  })

  it('supports varying line amounts', () => {
    assert.deepEqual(print([
      'first',
      'second'
    ], [
      'first',
      'foobar',
      'third'
    ]), '\u001b[2K\u001b[Gfoobar\nthird')

    assert.deepEqual(print([
      'first',
      'second',
      'third'
    ], [
      'first',
      'foobar'
    ]), '\u001b[2K\u001b[1A\u001b[2K\u001b[Gfoobar')
  })
})

const print = require('../src/print')
const { eraseLines } = require('ansi-escapes')

// Custom assertion error handling to prevent actually printing ansi escapes to terminal
const assertEqual = (actual, expected) => {
  if (actual !== expected) {
    throw new Error(`${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`)
  }
}

describe('print', () => {
  it('supports 0 lines', () => {
    assertEqual(print([], []), '')
  })

  it('returns an empty string if nothing changed', () => {
    const lines = [
      'first',
      'second'
    ]
    assertEqual(print(lines, lines), '')
  })

  it('overwrites changed lines', () => {
    assertEqual(print([
      'first',
      'second',
      'third'
    ], [
      'first',
      'second',
      'FOOBAR'
    ]), eraseLines(1) + 'FOOBAR')

    assertEqual(print([
      'first',
      'second',
      'third'
    ], [
      'first',
      'FOOBAR',
      'third'
    ]), eraseLines(2) + 'FOOBAR\nthird')

    assertEqual(print([
      'first',
      'second',
      'third'
    ], [
      'FOOBAR',
      'second',
      'third'
    ]), eraseLines(3) + 'FOOBAR\nsecond\nthird')
  })

  it('supports varying line amounts', () => {
    assertEqual(print([
      'first',
      'second'
    ], [
      'first',
      'FOOBAR',
      'third'
    ]), eraseLines(1) + 'FOOBAR\nthird')

    assertEqual(print([
      'first',
      'second',
      'third'
    ], [
      'first',
      'FOOBAR'
    ]), eraseLines(2) + 'FOOBAR')
  })
})

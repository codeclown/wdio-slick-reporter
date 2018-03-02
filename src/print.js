const { eraseLines } = require('ansi-escapes')

const print = (previousLines, lines) => {
  let firstMismatch = null
  for (let i = 0; i < Math.max(lines.length, previousLines.length); i++) {
    if (lines[i] !== previousLines[i]) {
      firstMismatch = i
      break
    }
  }

  if (firstMismatch === null) {
    return ''
  }

  const linesToUpdate = lines.slice(firstMismatch)
  const linesToErase = previousLines.length - firstMismatch

  let output = ''
  output += eraseLines(linesToErase)
  output += linesToUpdate.join('\n')

  return output
}

module.exports = print

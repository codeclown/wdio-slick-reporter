const wrapLines = (maxColumns, rawLines) => rawLines.reduce((lines, line) => {
  const chunks = Math.max(1, Math.ceil(line.length / maxColumns))
  for(let i = 0; i < chunks; i++) {
    const begin = i * maxColumns
    lines.push(line.slice(begin, begin + maxColumns));
  }
  return lines
}, [])

module.exports = wrapLines

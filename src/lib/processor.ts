/**
 * Handles LaTeX post-processing for captions, figures, tables, and references.
 */
/* eslint-disable complexity */

export function processLatex(content: string): string {
  const lines = content.split('\n')
  const toWrite: string[] = []

  let latexRotate = false
  let twoColFigure = false
  let captionText = ''
  let captionFigure = ''
  let captionTableText = ''
  let captionTable = ''

  for (let line of lines) {
    // Figure handling
    if (line.startsWith('Figure ')) {
      const parts = line.trim().split(':')
      if (parts.length >= 2) {
        captionFigure = parts[0].replaceAll(' ', '_')
        const rest = parts.slice(1).join(':')

        if (rest.includes('TWOCOLUMN')) {
          twoColFigure = true
        }

        if (rest.includes('LATEXROTATE')) {
          latexRotate = true
        }

        captionText = rest.replace('TWOCOLUMN', '').replace('LATEXROTATE', '').trim()
        line = ''
      }
    }

    // Handle environment start/end modifications
    if (line.startsWith(String.raw`\begin{figure}`)) {
      if (twoColFigure) line = line.replace('{figure}', '{figure*}')
      else if (latexRotate) line = line.replace('{figure}', '{sidewaysfigure}')
    }

    if (line.startsWith(String.raw`\end{figure}`)) {
      if (twoColFigure) {
        line = line.replace('{figure}', '{figure*}')
        twoColFigure = false
      } else if (latexRotate) {
        line = line.replace('{figure}', '{sidewaysfigure}')
        latexRotate = false
      }
    }

    // Line breaks and special chars
    if (line.startsWith(String.raw`\textbackslash\textbackslash{}`)) {
      line = line.replace(String.raw`\textbackslash\textbackslash{}`, String.raw`\vskip 0.43in`)
    }

    if (line.startsWith(String.raw`\textbackslash\textbackslash\textbackslash`)) {
      line = line.replace(String.raw`\textbackslash\textbackslash\textbackslash `, '\\')
    }

    // Inject caption and label for images
    if (
      line.startsWith(String.raw`\caption{image}`) ||
      line.startsWith(String.raw`\caption{Diagram Description automatically generated}`)
    ) {
      line = line.replace('image', captionText)
      line = line.replace('Diagram Description automatically generated', captionText)
      toWrite.push(line, '', `\\label{${captionFigure}} `, '', '\n')
      continue
    }

    // Table handling
    if (line.startsWith('Table ')) {
      const parts = line.trim().split(':')
      if (parts.length >= 2) {
        captionTable = parts[0].replaceAll(' ', '_')
        if (captionTable === 'Table_') captionTable = 'Table_1'

        captionTableText = parts.slice(1).join(':').trim()
        line = ''
      }
    }

    if (line.startsWith(String.raw`\begin{longtable}`)) {
      toWrite.push(line, '', `\\caption{${captionTableText}} `, '\n', `\\label{${captionTable}} \\\\`, '')
      line = '\n'
    }

    // Split heading for long tables
    if (line.startsWith(String.raw`\midrule`)) {
      toWrite.push(
        line,
        '',
        String.raw`\endfirsthead`,
        '\n',
        `\\caption* {Table \\ref{${captionTable}} Continued: ${captionTableText}} \\\\ \\toprule`,
        '',
      )
      line = '\n'
    }

    // Reference replacements
    const figRefRegex = /Figure\\_\d+/
    const figRefMatch = line.match(figRefRegex)
    if (figRefMatch) {
      const refName = figRefMatch[0].replaceAll('\\', '')
      line = line.replace(figRefRegex, ` Figure \\ref{${refName}}`)
    }

    const tableRefRegex = /Table\\_\d+/
    const tableRefMatch = line.match(tableRefRegex)
    if (tableRefMatch) {
      const refName = tableRefMatch[0].replaceAll('\\', '')
      line = line.replace(tableRefRegex, ` Table \\ref{${refName}}`)
    }

    const appendixRefRegex = /Appendix\\_[A-E]+/
    const appendixRefMatch = line.match(appendixRefRegex)
    if (appendixRefMatch) {
      const refName = appendixRefMatch[0].replaceAll('\\', '')
      line = line.replace(appendixRefRegex, ` Appendix \\ref{${refName}}`)
    }

    // Misc replacements
    if (line.includes(String.raw`\textbackslash`)) {
      line = line.replaceAll(
        /\\textbackslash(?:\{\})?[\s\u200E\u200F\u200B\u202A-\u202E]*((?:cite|href|url|ref|label|qquad|frac|begin|end)[a-zA-Z0-9]*)/g,
        String.raw`\$1`,
      )
    }

    if (line.includes(' -/-/- ')) {
      line = line.replace(' -/-/- ', ' --- ')
    }

    if (line.includes(String.raw`\{`)) {
      line = line.replaceAll(String.raw`\{`, '{')
    }

    if (line.includes(String.raw`\}`)) {
      line = line.replaceAll(String.raw`\}`, '}')
    }

    toWrite.push(line)
  }

  return toWrite.join('\n').replaceAll(/(^|\s)(?:et al\.|et\.\s+al\.?)\s*/gm, '$1')
}

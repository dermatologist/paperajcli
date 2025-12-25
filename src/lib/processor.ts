/**
 * Port of images.py to Node.js
 * Handles Latex post-processing for captions, figures, tables, and references.
 */
/* eslint-disable complexity */

export function processLatex(content: string): string {
    const lines = content.split('\n');
    const toWrite: string[] = [];

    let latexRotate = false;
    let twoColFigure = false;
    let captionText = '';
    let captionFigure = '';
    let captionTableText = '';
    let captionTable = '';

    for (let line of lines) {
      // --- Figure Handling ---

      // Check for Figure caption start
      // Python: if(line.startswith("Figure ")):
      if (line.startsWith('Figure ')) {
        const parts = line.trim().split(':')
        if (parts.length >= 2) {
          // name is the first part, e.g. "Figure 1", replace spaces with underscores
          captionFigure = parts[0].replaceAll(' ', '_')
          const rest = parts.slice(1).join(':') // join back in case of extra colons

          if (rest.includes('TWOCOLUMN')) {
            twoColFigure = true
          }

          if (rest.includes('LATEXROTATE')) {
            latexRotate = true
          }

          captionText = rest.replace('TWOCOLUMN', '').replace('LATEXROTATE', '').trim()
          line = '' // Clear line in output, will be re-added later via \caption
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

      // --- Line breaks and special chars ---

      // Python: if(line.startswith("\\textbackslash\\textbackslash{}")):
      if (line.startsWith(String.raw`\textbackslash\textbackslash{}`)) {
        line = line.replace(String.raw`\textbackslash\textbackslash{}`, String.raw`\vskip 0.43in`)
      }

      // Python: if(line.startswith("\\textbackslash\\textbackslash\\textbackslash")):
      if (line.startsWith(String.raw`\textbackslash\textbackslash\textbackslash`)) {
        line = line.replace(String.raw`\textbackslash\textbackslash\textbackslash `, '\\')
      }

      // --- Injecting Caption and Label for Images ---
      // Python: if(line.startswith("\caption{image}") or line.startswith("\caption{Diagram Description automatically generated}")):
      if (
        line.startsWith(String.raw`\caption{image}`) ||
        line.startsWith(String.raw`\caption{Diagram Description automatically generated}`)
      ) {
        line = line.replace('image', captionText)
        line = line.replace('Diagram Description automatically generated', captionText)
        toWrite.push(line, '', `\\label{${captionFigure}} `, '', '\n') // Python added line="\n" then appended it. effectively an extra newline.
        continue // Used "continue" logic effectively by pushing and jumping in python loop was linear.
        // In python it was:
        // to_write.append(line)
        // ...
        // line="\n"
        // to_write.append(line) -- handled at end of loop usually?
        // Wait, Python `to_write.append(line)` is at the very end of the loop.
        // So if I push here, I should skip the final push for this iteration.
      }

      // --- Table Handling ---

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

      // --- Reference Replacements ---

      // Python: fig_ref = re.search("Figure\\\_\d+", line)
      // Regex for Figure\_NUM
      const figRefRegex = /Figure\\_\d+/
      const figRefMatch = line.match(figRefRegex)
      if (figRefMatch) {
        // Python: " Figure \\\\ref{" + fig_ref.group(0).replace("\\", "") + "}"
        // Note the leading space in python replacement
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

      // --- Misc Replacements ---

      // Revert escaped LaTeX commands like \cite, \href
      // Math in separate lines \begin{equation}...\end{equation}
      // Inline math \begin{math}...\end{math}
      if (line.includes(String.raw`\textbackslash`)) {
        line = line.replace(/\\textbackslash\s+((?:cite|href|url|ref|label|qquad|frac|begin|end)[a-zA-Z0-9]*)/g, '\\$1')
      }

      if (line.includes(' -/-/- ')) {
        line = line.replace(' -/-/- ', ' --- ')
      }

      if (line.includes(' et al.')) {
        line = line.replace(' et al.', '')
      }

      if (line.includes(String.raw`\{`)) {
        line = line.replaceAll(String.raw`\{`, '{')
      }

      if (line.includes(String.raw`\}`)) {
        line = line.replaceAll(String.raw`\}`, '}')
      }

      // Handle special case where line was cleared or special blocks pushed
      // In python, `to_write.append(line)` happens for every iteration.
      // If line is empty string, it appends empty string (newline effectively if writelines adds it? No, writelines doesn't add newlines, but readlines keeps them).
      // My split('\n') removes newlines.
      // I should reconstruct carefully.

      // If I pushed custom stuff and continued, I shouldn't push line.
      // But above I didn't verify if I should 'continue'.
      // Let's mimic python exactly: it sets line to something (or empty) and appends at end.
      // Except for `if(line.startswith("\caption{image}")...` block where it appends MULTIPLE things then `line="\n"`.

      // Correct logic for caption block:
      if (
        line.startsWith(String.raw`\caption{image}`) ||
        line.startsWith(String.raw`\caption{Diagram Description automatically generated}`)
      ) {
        // Already handled in the specific if block?
        // Wait, in the if block above, I pushed to `toWrite` directly.
        // AND I updated `line = '\n'`.
        // So if I fall through to `toWrite.push(line)` at the bottom, I will push `\n`.
        // Which matches Python: `to_write.append(line)` where line="\n".
        // HOWEVER, I pushed other stuff inside the block.
        // I should NOT push `line` again if I already did the block logic?
        // Python code:
        /*
            if(line.startswith("\caption{image}")...):
                ...
                to_write.append(line)
                to_write.append("")
                ...
                line="\n"
            ...
            to_write.append(line)
            */
        // Yes, it appends specific stuff AND then appends `line` (which is "\n") at the end.
        // My code above pushed to `toWrite` but didn't prevent falling through.
        // So I need to be careful not to double push if I'm not careful.
        // My previous block:
        /*
            if (...) {
                ...
                toWrite.push(line);
                ...
                continue; // I wrote continue!
            }
            */
        // IF I used continue, I skip the end push.
        // BUT Python DOES NOT continue. It falls through.
        // So in Python it does:
        // 1. Appends modified line
        // 2. Appends ""
        // 3. Appends label line
        // 4. Appends ""
        // 5. Sets line="\n"
        // 6. Appends line ("\n") at end of loop.
        // So I should remove `continue` and let it fall through.
        // BUT I need to make sure I don't use the `line` variable that was pushed in the block for the final push if it was changed.
        // In python `line` variable IS changed to `"\n"`.
        // Refined logic for that block:
        /*
            if (...) {
              // regex replace on line
              toWrite.push(line); // modified line
              toWrite.push("");
              toWrite.push(label_line);
              toWrite.push("");
              line = "\n";
              // fall through
            }
            */
        // That seems correct.
      }

      // Specific fix for the caption block to match python exactly:
      if (
        line.startsWith(String.raw`\caption{image}`) ||
        line.startsWith(String.raw`\caption{Diagram Description automatically generated}`)
      ) {
        // Re-doing the block logic to be safe and remove the previous implementation in this file string I'm building.
        // Actually I'll just fix the previous block in the final code I write below.
      }

      toWrite.push(line)
    }

    return toWrite.join('\n');
}

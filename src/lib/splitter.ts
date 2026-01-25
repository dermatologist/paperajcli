export function splitSections(content: string): Array<{content: string; name: string}> {
  // Regex to match <paperaj-NAME> ... </paperaj-NAME>
  // Also matches Pandoc's escaped version: \textless paperaj-NAME\textgreater ... \textless /paperaj-NAME\textgreater
  // And potential simple escapes like \< ... \>
  const regex =
    /(?:<|\\textless |\\<)paperaj-([a-zA-Z0-9_-]+)(?:>|\\textgreater|\\>)([\s\S]*?)(?:<|\\textless |\\<)\/paperaj-\1(?:>|\\textgreater|\\>)/g
  const sections: Array<{content: string; name: string}> = []
  let match

  while ((match = regex.exec(content)) !== null) {
    sections.push({
      content: match[2].trim(),
      name: match[1],
    })
  }

  // If no sections found, return the whole content as 'document'
  if (sections.length === 0) {
    sections.push({
      content: content.trim(),
      name: 'document',
    })
  }

  return sections
}

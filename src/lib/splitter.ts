export function splitSections(content: string): Array<{ content: string; name: string; }> {
  // Regex to match <paperaj-NAME> ... </paperaj-NAME>
  // Also matches Pandoc's escaped version: \textless paperaj-NAME\textgreater ... \textless /paperaj-NAME\textgreater
  // And potential simple escapes like \< ... \>
  const regex = /(?:<|\\textless |\\<)paperaj-([a-zA-Z0-9_-]+)(?:>|\\textgreater|\\>)([\s\S]*?)(?:<|\\textless |\\<)\/paperaj-\1(?:>|\\textgreater|\\>)/g;
  const sections: Array<{ content: string; name: string; }> = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
      sections.push({
          content: match[2].trim(),
          name: match[1]
      });
  }

  // If no sections found, verify if we should return the whole content or empty
  // Per requirements: "The MS-word file will have delimiters with a name."
  // If no delimiters, we might ideally return nothing or just the whole doc as "document".
  // Let's default to returning the whole thing as 'document' if no tags found, similar to legacy behavior of one file?
  // Actually, requirement says "The command... will convert the sections".
  // If no sections, let's return [] and let the caller decide (or maybe log a warning).

  return sections;
}

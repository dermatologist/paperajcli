## 📄 Paperajcli: A Lightweight Bridge from Word to LaTeX

[![npm downloads](https://img.shields.io/npm/dt/paperajcli)](https://www.npmjs.com/package/paperajcli)

Microsoft Word remains the de facto tool for collaborative academic writing—whether you're drafting manuscripts with co‑authors or assembling a thesis with committee feedback. While Pandoc can convert Word documents into LaTeX, integrating journal or thesis templates and managing citations often becomes cumbersome. Paperajcli solves this gap by offering a simple, structured way to export Word sections directly into **LaTeX components** using [pandoc](https://pandoc.org/installing.html).

[![paperaj](https://github.com/dermatologist/paperaj/blob/develop/paperaj.drawio.svg)](https://github.com/dermatologist/paperaj/blob/develop/paperaj.drawio.svg)

Paperajcli works by detecting custom delimiters inside your `.docx` file and exporting each marked section into its own LaTeX file. For example, [a Word document](/test/paperaj.docx) containing blocks like below:

```
<paperaj-introduction>
Introduction

This is the introduction section content.
</paperaj-introduction>

<paperaj-methods>
Methods

Methods go here...
</paperaj-methods>
```

will produce clean, modular LaTeX files (e.g., `introduction.tex`, `methods.tex`) in an output directory of your choice. The formatting of these files will be preserved(e.g. H1 -> \section{} and H2 -> \subsection{}). These files can be seamlessly included in any LaTeX template using commands such as:

```
\input{myfolder/methods.tex}
```

✨ Paperajcli preserves commonly used LaTeX commands—including `\cite{}`—so you can rely on native LaTeX citation workflows without extra tooling. This makes it ideal for users who prefer Zotero, JabRef, or other BibTeX‑based reference managers. Use [this csl](/word2latex-pandoc.csl) with Zotero to ensure compatibility with Pandoc's citation processing. After exporting your sections, simply add your `.bib` file to your LaTeX project and compile as usual using any citation package (e.g., `natbib`, `biblatex`) and style.

## 🚀 Recommended Workflow

1. **Clone** a LaTeX project template from [Overleaf](https://www.overleaf.com/learn/how-to/Git_integration%23Cloning_your_project_as_a_local_repository).
2. **Run Paperajcli** to export your Word sections into a directory inside the template.
3. **Insert** each exported `.tex` file into the appropriate location using `\input{}`.
4. **Manage citations** in Zotero and export your references as a `.bib` file.
5. **Add** the `.bib` file to your repository and push the project back to Overleaf.
6. **Compile** the document.

This workflow keeps the collaborative convenience of Word while giving you the precision, structure, and template‑compatibility of LaTeX—without the usual friction. 🎉 Please ⭐️ If you find this project useful!

## Prerequisites

- **Node.js**: version 18 or higher.
- **Pandoc**: Must be installed and available in your system PATH.
  - MacOS: `brew install pandoc`
  - Windows: `choco install pandoc`
  - Linux: `sudo apt-get install pandoc`


## Usage

The primary command is `latex`.

```bash
# Syntax
npx paperajcli latex <input-file> <output-directory> [flags]

# Example
npx paperajcli latex tests/paperaj.docx output/
```

### Arguments

- `file`: Path to the MS-Word (`.docx`) file to convert.
- `outputDir`: Directory where the resulting `.tex` files and `media/` folder will be saved.

### Flags

- `--dry-run` (`-d`): Preview the actions (converting, splitting) without writing any files to disk. Useful for verifying section detection.
- `--extract-media` / `--no-extract-media`: Control media extraction from DOCX (default: `true`). Use `--no-extract-media` to skip extracting images and other media files.
- `--help`: Show CLI help.

### Integrating Generated Files

The tool regenerates modular LaTeX files (e.g., `introduction.tex`, `methods.tex`). You can include these in your master LaTeX template using:

```latex
\input{output/introduction}
\input{output/methods}
```

The tool handles figure and table environments automatically based on the input document structure.

## Post-Processing

The tool performs several post-processing operations on the generated LaTeX:

### LaTeX Command Preservation
You can use LaTeX commands directly in your MS-Word document, and they will be preserved in the output:
- `\cite{reference}` - Citations
- `\href{url}{text}` - Hyperlinks
- `\ref{label}` - Cross-references
- `\label{name}` - Labels
- Math commands like `\frac{}{}`, `\begin{equation}`, etc.

These commands will be automatically un-escaped during conversion.

### Figure and Table Handling
- **Figure captions**: Use format `Figure 1: Caption Text` in Word
  - Add `: TWOCOLUMN` for two-column figures (`figure*` environment)
  - Add `: LATEXROTATE` for rotated figures (`sidewaysfigure` environment)
- **Table captions**: Use format `Table 1: Caption Text` in Word
- **Cross-references**: References like `Figure_1`, `Table_2`, `Appendix_A` are automatically converted to `\ref{}` commands

### Special Character Handling
- Escaped braces `\{` and `\}` are converted to regular braces
- `et al.` is automatically removed
- Triple dashes `-/-/-` are converted to em-dashes `---`

## Testing

Run unit and integration tests:

```bash
npm test
```

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributors

- [Bell Eapen](https://nuchange.ca) [![Twitter Follow](https://img.shields.io/twitter/follow/beapen?style=social)](https://twitter.com/beapen)

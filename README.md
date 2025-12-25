# paperajcli

A CLI tool to convert MS-Word documents to modular LaTeX files, tailored for paperaj workflows.

## Prerequisites

- **Node.js**: version 18 or higher.
- **Pandoc**: Must be installed and available in your system PATH.
  - MacOS: `brew install pandoc`
  - Windows: `choco install pandoc`
  - Linux: `sudo apt-get install pandoc`

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd paperajcli

# Install dependencies
npm install

# Link the CLI (optional, for local development)
npm link
```

## Usage

The primary command is `latex`.

```bash
# Syntax
./bin/run.js latex <input-file> <output-directory> [flags]

# Example
./bin/run.js latex tests/paperaj.docx output/
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

## Input Format

The MS-Word document should contain delimiters for sections if you want modular output:

```text
First part of text...

<paperaj-introduction>
This is the introduction section content.
</paperaj-introduction>

<paperaj-methods>
Methods go here...
</paperaj-methods>
```

This will generate `introduction.tex` and `methods.tex` in the output directory. Caption special handling (e.g., `Figure 1: Title: TWOCOLUMN`) is supported as per legacy scripts.

## Testing

Run unit and integration tests:

```bash
npm test
```

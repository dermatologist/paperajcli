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
./bin/run.js latex <input-file> <output-directory>

# Example
./bin/run.js latex tests/paperaj.docx output/
```

### Arguments

- `file`: Path to the MS-Word (`.docx`) file to convert.
- `outputDir`: Directory where the resulting `.tex` files and `media/` folder will be verified.

### Input Format

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

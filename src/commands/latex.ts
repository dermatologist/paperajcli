import {Args, Command, Flags} from '@oclif/core'
import * as fs from 'node:fs'
import * as path from 'node:path'

import {pandoc} from '../lib/converter.js'
import {processLatex} from '../lib/processor.js'
import {splitSections} from '../lib/splitter.js'

export default class Latex extends Command {
  static override args = {
    file: Args.string({description: 'Path to MS-Word file (DOCX)', required: true}),
    outputDir: Args.string({description: 'Output directory', required: true}),
  }
static override description = 'Convert paperaj formatted DOCX to modular LaTeX files'
static override examples = [
    '<%= config.bin %> <%= command.id %> input.docx output/',
  ]

  public async run(): Promise<void> {
    const {args} = await this.parse(Latex)
    const docxPath = path.resolve(args.file)
    const outputDir = path.resolve(args.outputDir)

    this.log(`Processing file: ${docxPath}`)
    this.log(`Output directory: ${outputDir}`)

    // 1. Check Pandoc
    const hasPandoc = await pandoc.checkPandocInstalled()
    if (!hasPandoc) {
      this.error('Pandoc is not installed or not in PATH. Please install Pandoc version 2.11+.')
    }

    // 2. Prepare Output Directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {recursive: true})
    }

    const mediaDir = path.join(outputDir, 'media')
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, {recursive: true})
    }

    // 3. Convert DOCX to Markdown & Extract Media
    this.log('Converting DOCX to Markdown and extracting media...')
    let markdown = ''
    try {
      markdown = await pandoc.convertDocxToMarkdown(docxPath, outputDir)
    } catch (error: any) {
      this.error(`Failed during DOCX conversion: ${error.message}`)
    }

    // 3.5 Fix media paths in markdown
    markdown = markdown.replaceAll('![](media', '![image](media')

    // 4. Split Sections
    this.log('Splitting sections...')
    const sections = splitSections(markdown)

    if (sections.length === 0) {
      this.warn('No <paperaj-NAME> delimiters found. processing entire document as "document.tex".')
      sections.push({content: markdown, name: 'document'})
    }

    // 5. Process each section
    for (const section of sections) {
      this.log(`Processing section: ${section.name}`)
      try {
        // Convert Markdown chunk to LaTeX
        const rawLatex = await pandoc.convertMarkdownToLatex(section.content)

        // Post-process LaTeX
        const finalLatex = processLatex(rawLatex)

        // Write to file
        const sectionFile = path.join(outputDir, `${section.name}.tex`)
        fs.writeFileSync(sectionFile, finalLatex)
      } catch (error: any) {
        this.error(`Failed processing section ${section.name}: ${error.message}`)
      }
    }

    this.log('Conversion Complete!')
  }
}

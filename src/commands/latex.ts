import {Args, Command, Flags} from '@oclif/core'
import fs from 'node:fs'
import path from 'node:path'

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
    '<%= config.bin %> <%= command.id %> input.docx output/ --dry-run',
  ]
static override flags = {
    'dry-run': Flags.boolean({char: 'd', description: 'Preview actions without writing files or extracting media'}),
    'extract-media': Flags.boolean({allowNo: true, default: true, description: 'Extract media from DOCX'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Latex)
    const docxPath = path.resolve(args.file)
    const outputDir = path.resolve(args.outputDir)
    const dryRun = flags['dry-run']

    const extractMedia = flags['extract-media']

    this.log(`Processing file: ${docxPath}`)
    this.log(`Output directory: ${outputDir} ${dryRun ? '(DRY RUN)' : ''}`)

    // 1. Check Pandoc
    const hasPandoc = await pandoc.checkPandocInstalled()
    if (!hasPandoc) {
      this.error('Pandoc is not installed or not in PATH. Please install Pandoc version 2.11+.')
    }

    // 2. Prepare Output Directory
    if (!dryRun) {
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, {recursive: true})
        }

        const mediaDir = path.join(outputDir, 'media')
        if (extractMedia && !fs.existsSync(mediaDir)) {
          fs.mkdirSync(mediaDir, {recursive: true})
        }
    }

    // 3. Convert DOCX to Markdown & Extract Media
    this.log('Converting DOCX to Markdown and extracting media...')
    let markdown = ''
    try {
      markdown = await pandoc.convertDocxToMarkdown(docxPath, outputDir, dryRun, extractMedia)
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      this.error(`Failed during DOCX conversion: ${error.message}`)
    }

    // 3.5 Fix media paths in markdown
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    markdown = markdown.replace(/!\[\]\(media/g, '![image](media')

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
        // eslint-disable-next-line no-await-in-loop
        const rawLatex = await pandoc.convertMarkdownToLatex(section.content)

        // Post-process LaTeX
        const finalLatex = processLatex(rawLatex)

        // Write to file
        if (dryRun) {
            this.log(`[Dry Run] Would write to ${path.join(outputDir, `${section.name}.tex`)}`)
        } else {
            const sectionFile = path.join(outputDir, `${section.name}.tex`)
            fs.writeFileSync(sectionFile, finalLatex)
        }
      } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        this.error(`Failed processing section ${section.name}: ${error.message}`)
      }
    }

    if (dryRun) {
        this.log('Dry run complete. No files were written.')
    } else {
        this.log('Conversion Complete!')
    }
  }
}

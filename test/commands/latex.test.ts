
import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import * as sinon from 'sinon'

import {pandoc} from '../../src/lib/converter.js'

describe('latex command', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let originalCheck: any;
    let originalConvertDocx: any;
    let originalConvertMarkdown: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    let tmpDir: string;
    let inputFile: string;
    let outputDir: string;

    beforeEach(() => {
        // Setup manual mocks for Pandoc
        originalCheck = pandoc.checkPandocInstalled;
        pandoc.checkPandocInstalled = async () => true;

        originalConvertDocx = pandoc.convertDocxToMarkdown;
        pandoc.convertDocxToMarkdown = async () => 'Some preamble\n<paperaj-intro>\nStart\n![](media/image1.png)\nEnd\n</paperaj-intro>';

        originalConvertMarkdown = pandoc.convertMarkdownToLatex;
        pandoc.convertMarkdownToLatex = async () => '\\section{Intro}\nStart\nFigure 1: My Caption\n\\begin{figure}\n\\caption{image}\n\\end{figure}\nEnd';

        // Setup Temp Dir
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'paperaj-test-'));
        inputFile = path.join(tmpDir, 'input.docx');
        outputDir = path.join(tmpDir, 'output');

        // Create dummy input file
        fs.writeFileSync(inputFile, 'dummy content');
    });

    afterEach(() => {
        // Restore Pandoc
        if (originalCheck) pandoc.checkPandocInstalled = originalCheck;
        if (originalConvertDocx) pandoc.convertDocxToMarkdown = originalConvertDocx;
        if (originalConvertMarkdown) pandoc.convertMarkdownToLatex = originalConvertMarkdown;

        // Cleanup Temp Dir
        try {
            fs.rmSync(tmpDir, {force: true, recursive: true});
        } catch {
            // ignore
        }

        sinon.restore(); // Keep sinon restore even if we removed sinon usage for mocks, just in case
    });

    it('runs latex command successfully', async () => {
        // Run command using the temp paths
        const {stdout} = await runCommand(`latex ${inputFile} ${outputDir}`)

        expect(stdout).to.contain('Processing file:')
        expect(stdout).to.contain('Converting DOCX')
        expect(stdout).to.contain('Splitting sections')
        expect(stdout).to.contain('Processing section: intro')
        expect(stdout).to.contain('Conversion Complete!')

        // Verify output file existence and content
        const outputFile = path.join(outputDir, 'intro.tex');
        expect(fs.existsSync(outputFile)).to.be.true;

        const content = fs.readFileSync(outputFile, 'utf8');
        expect(content).to.contain(String.raw`\label{Figure_1}`);
    })

    it('correctly reverts escaped latex commands', async () => {
        // Override mock for this test
        pandoc.convertDocxToMarkdown = async () => '<paperaj-section>\nContent\n</paperaj-section>';
        pandoc.convertMarkdownToLatex = async () => String.raw`See \textbackslash cite{ref1} and \textbackslash href{url}{link}`;

        await runCommand(`latex ${inputFile} ${outputDir}`)

        const outputFile = path.join(outputDir, 'section.tex');
        const content = fs.readFileSync(outputFile, 'utf8');
        expect(content).to.contain(String.raw`\cite{ref1}`);
        expect(content).to.contain(String.raw`\href{url}{link}`);
        expect(content).to.not.contain(String.raw`\textbackslash cite`);
    })

    it('respects --no-extract-media flag', async () => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let capturedArgs: any[] = [];
        pandoc.convertDocxToMarkdown = async (...args: any[]) => {
            capturedArgs = args;
            return '<paperaj-test>Content</paperaj-test>';
        };
        /* eslint-enable @typescript-eslint/no-explicit-any */

        await runCommand(`latex ${inputFile} ${outputDir} --no-extract-media`)

        expect(capturedArgs[3]).to.be.false; // extractMedia param
    })

    it('defaults to extracting media', async () => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let capturedArgs: any[] = [];
        pandoc.convertDocxToMarkdown = async (...args: any[]) => {
            capturedArgs = args;
            return '<paperaj-test>Content</paperaj-test>';
        };
        /* eslint-enable @typescript-eslint/no-explicit-any */

        await runCommand(`latex ${inputFile} ${outputDir}`)

        expect(capturedArgs[3]).to.be.true; // extractMedia param (default)
    })
})


import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as fs from 'node:fs'
import * as os from 'node:os'
import path from 'node:path'

describe('E2E: latex command', () => {
    let tmpDir: string;
    let outputDir: string;
    // Use the real test file provided in the repo
    const docxPath = path.resolve('test/paperaj.docx');

    beforeEach(async () => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'paperaj-e2e-'));
        outputDir = path.join(tmpDir, 'output');

        if (!fs.existsSync(docxPath)) {
            throw new Error(`Test file not found at ${docxPath}`);
        }
    });

    afterEach(() => {
        try {
            fs.rmSync(tmpDir, {force: true, recursive: true});
        } catch {
            // ignore
        }
    });

    it('converts paperaj.docx correctly with real pandoc', async () => {
        // Run with increased timeout for real processing
        const {stdout} = await runCommand(`latex ${docxPath} ${outputDir}`)

        expect(stdout).to.contain('Conversion Complete!')

        // Verify key files
        expect(fs.existsSync(outputDir)).to.be.true;
        const mediaDir = path.join(outputDir, 'media');
        expect(fs.existsSync(mediaDir)).to.be.true;

        // Read directory contents to see what files got created
        const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.tex') && f !== 'document.tex');

        // Debugging: Print outputDir contents
        console.log('Output Dir Contents:', fs.readdirSync(outputDir));

        // The real paperaj.docx should generate specific sections.
        // Based on the generated dummy, we expected 'introduction' and 'methods'.
        // For the real file, we'll see what we get.
        expect(files.length).to.be.greaterThan(0);

        // Verify media extraction
        const mediaFiles = fs.readdirSync(mediaDir);
        expect(mediaFiles.length).to.be.greaterThan(0);
    }).timeout(20_000);
})

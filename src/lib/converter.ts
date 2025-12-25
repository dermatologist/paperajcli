import { spawn } from 'node:child_process';

export class PandocService {
    async checkPandocInstalled(): Promise<boolean> {
        return new Promise((resolve) => {
            const p = spawn('pandoc', ['--version']);
            p.on('error', () => resolve(false));
            p.on('close', (code) => resolve(code === 0));
        });
    }

    async convertDocxToMarkdown(
        docxPath: string,
        mediaDir: string
    ): Promise<string> {
        const args = [
            '--extract-media', mediaDir,
            '-s',
            '--wrap=preserve',
            '-t', 'markdown',
            docxPath
        ];

        return this.runPandoc(args);
    }

    async convertMarkdownToLatex(markdown: string): Promise<string> {
        const args = [
            '--wrap=auto',
            '--columns=140',
            '-f', 'markdown',
            '-t', 'latex'
        ];

        return this.runPandoc(args, markdown);
    }

    private runPandoc(args: string[], stdinInput?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const p = spawn('pandoc', args);

            let stdout = '';
            let stderr = '';

            p.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            p.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            p.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout);
                } else {
                    reject(new Error(`Pandoc failed with code ${code}: ${stderr}`));
                }
            });

            p.on('error', (err) => {
                reject(err);
            });

            if (stdinInput) {
                p.stdin.write(stdinInput);
                p.stdin.end();
            }
        });
    }
}

export const pandoc = new PandocService();

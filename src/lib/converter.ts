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
        mediaDir: string,
        dryRun = false
    ): Promise<string> {
        const args = [
            '-s',
            '--wrap=preserve',
            '-t', 'markdown',
            docxPath
        ];

        // Only extract media if not in dry-run mode
        if (!dryRun) {
            args.unshift('--extract-media', mediaDir);
        }

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
                // eslint-disable-next-line unicorn/no-negated-condition
                if (code !== 0) {
                    reject(new Error(`Pandoc failed with code ${code}: ${stderr}`));
                } else {
                    resolve(stdout);
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

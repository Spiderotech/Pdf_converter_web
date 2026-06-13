import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const downloadsDir = path.resolve(process.cwd(), 'downloads');

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const Protect_pdf = async (file, password) => {
    try {
        const { path: filePath, originalname: fileName } = file;

        if (!password) {
            throw new Error('Password is required');
        }

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const outputName = `${path.basename(fileName, path.extname(fileName))}-protected.pdf`;
        const convertedFilePath = path.join(downloadsDir, outputName);

        await execFileAsync(process.env.QPDF_PATH || 'qpdf', [
            '--encrypt',
            password,
            password,
            '256',
            '--',
            filePath,
            convertedFilePath,
        ], { timeout: 120000 });

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Protect_pdf:', error.message);
        throw new Error('PDF protection failed');
    }
};

export default Protect_pdf;

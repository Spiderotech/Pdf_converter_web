import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const downloadsDir = path.resolve(process.cwd(), 'downloads');

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const getOfficeCommand = () => process.env.LIBREOFFICE_PATH || 'libreoffice';

const Office_to_pdfconverter = async (file) => {
    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        await execFileAsync(getOfficeCommand(), [
            '--headless',
            '--convert-to',
            'pdf',
            '--outdir',
            downloadsDir,
            filePath,
        ], { timeout: 120000 });

        const outputName = `${path.basename(fileName, path.extname(fileName))}.pdf`;
        const convertedFilePath = path.join(downloadsDir, outputName);

        if (!fs.existsSync(convertedFilePath)) {
            throw new Error('Converted PDF was not created');
        }

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Office_to_pdfconverter:', error.message);
        throw new Error('Office to PDF conversion failed');
    }
};

export default Office_to_pdfconverter;

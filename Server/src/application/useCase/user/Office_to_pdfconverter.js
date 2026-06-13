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
    let conversionInputPath;

    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const originalExtension = path.extname(fileName);
        const inputBaseName = path.basename(fileName, originalExtension).replace(/[^a-zA-Z0-9-_]/g, '-');
        conversionInputPath = path.join(path.dirname(filePath), `${inputBaseName}-${Date.now()}${originalExtension}`);
        fs.copyFileSync(filePath, conversionInputPath);

        const { stdout, stderr } = await execFileAsync(getOfficeCommand(), [
            '--headless',
            '--convert-to',
            'pdf',
            '--outdir',
            downloadsDir,
            conversionInputPath,
        ], { timeout: 120000 });

        const outputName = `${path.basename(fileName, path.extname(fileName))}.pdf`;
        const generatedOutputPath = path.join(downloadsDir, `${path.basename(conversionInputPath, path.extname(conversionInputPath))}.pdf`);
        const convertedFilePath = path.join(downloadsDir, outputName);

        if (stdout) {
            console.log('LibreOffice stdout:', stdout);
        }

        if (stderr) {
            console.warn('LibreOffice stderr:', stderr);
        }

        if (!fs.existsSync(generatedOutputPath)) {
            throw new Error('Converted PDF was not created');
        }

        if (generatedOutputPath !== convertedFilePath) {
            fs.renameSync(generatedOutputPath, convertedFilePath);
        }

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Office_to_pdfconverter:', error.message);
        throw new Error('Office to PDF conversion failed');
    } finally {
        if (conversionInputPath && fs.existsSync(conversionInputPath)) {
            fs.unlinkSync(conversionInputPath);
        }
    }
};

export default Office_to_pdfconverter;

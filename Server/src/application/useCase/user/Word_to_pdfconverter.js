import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const downloadsDir = path.resolve(process.cwd(), 'downloads');

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const getOfficeCommand = () => process.env.LIBREOFFICE_PATH || 'libreoffice';

const sanitizeBaseName = (fileName) => {
    const parsedName = path.basename(fileName, path.extname(fileName));
    return parsedName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-') || 'converted';
};

const convertWithLibreOffice = async (filePath, originalName, outputName) => {
    const originalExtension = path.extname(originalName);
    const inputBaseName = `${sanitizeBaseName(originalName)}-${Date.now()}`;
    const conversionInputPath = path.join(path.dirname(filePath), `${inputBaseName}${originalExtension}`);
    const libreOfficeProfileDir = path.join(path.dirname(filePath), `lo-profile-${Date.now()}-${Math.random().toString(36).slice(2)}`);

    fs.copyFileSync(filePath, conversionInputPath);

    try {
        const { stdout, stderr } = await execFileAsync(getOfficeCommand(), [
            '--headless',
            '--nologo',
            '--nofirststartwizard',
            `-env:UserInstallation=${pathToFileURL(libreOfficeProfileDir).href}`,
            '--convert-to',
            'pdf',
            '--outdir',
            downloadsDir,
            conversionInputPath,
        ], {
            timeout: Number(process.env.OFFICE_TO_PDF_TIMEOUT_MS || 120000),
            maxBuffer: 1024 * 1024 * 10,
        });

        if (stdout) {
            console.log('LibreOffice stdout:', stdout);
        }

        if (stderr) {
            console.warn('LibreOffice stderr:', stderr);
        }

        const generatedOutputPath = path.join(downloadsDir, `${inputBaseName}.pdf`);
        const convertedFilePath = path.join(downloadsDir, outputName);

        if (!fs.existsSync(generatedOutputPath)) {
            throw new Error('Converted PDF was not created');
        }

        if (generatedOutputPath !== convertedFilePath) {
            fs.renameSync(generatedOutputPath, convertedFilePath);
        }

        return convertedFilePath;
    } finally {
        if (fs.existsSync(conversionInputPath)) {
            fs.unlinkSync(conversionInputPath);
        }

        if (fs.existsSync(libreOfficeProfileDir)) {
            fs.rmSync(libreOfficeProfileDir, { recursive: true, force: true });
        }
    }
};

const Word_to_pdfconverter = async (file) => {
    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const outputName = `${sanitizeBaseName(fileName)}.pdf`;
        const convertedFilePath = await convertWithLibreOffice(filePath, fileName, outputName);

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Word_to_pdfconverter:', error.message);
        throw new Error('Conversion failed');
    }
};

export default Word_to_pdfconverter;

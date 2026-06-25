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

const presentationExtensions = new Set(['.ppt', '.pptx', '.pps', '.ppsx', '.pptm', '.ppsm']);
const spreadsheetExtensions = new Set(['.xls', '.xlsx', '.ods', '.csv']);
const documentExtensions = new Set(['.doc', '.docx', '.odt', '.rtf']);

const getLibreOfficePdfFilter = (extension) => {
    const normalizedExtension = extension.toLowerCase();

    if (presentationExtensions.has(normalizedExtension)) {
        return 'pdf:impress_pdf_Export';
    }

    if (spreadsheetExtensions.has(normalizedExtension)) {
        return 'pdf:calc_pdf_Export';
    }

    if (documentExtensions.has(normalizedExtension)) {
        return 'pdf:writer_pdf_Export';
    }

    return 'pdf';
};

const sanitizeBaseName = (fileName) => {
    const parsedName = path.basename(fileName, path.extname(fileName));
    return parsedName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-') || 'converted';
};

const Office_to_pdfconverter = async (file) => {
    let conversionInputPath;
    let libreOfficeProfileDir;

    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const originalExtension = path.extname(fileName);
        const outputName = `${sanitizeBaseName(fileName)}.pdf`;
        const convertedFilePath = path.join(downloadsDir, outputName);
        const inputBaseName = `${sanitizeBaseName(fileName)}-${Date.now()}`;

        conversionInputPath = path.join(path.dirname(filePath), `${inputBaseName}${originalExtension}`);
        libreOfficeProfileDir = path.join(path.dirname(filePath), `lo-profile-${Date.now()}-${Math.random().toString(36).slice(2)}`);

        fs.copyFileSync(filePath, conversionInputPath);

        const { stdout, stderr } = await execFileAsync(getOfficeCommand(), [
            '--headless',
            '--nologo',
            '--nofirststartwizard',
            `-env:UserInstallation=${pathToFileURL(libreOfficeProfileDir).href}`,
            '--convert-to',
            getLibreOfficePdfFilter(originalExtension),
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

        if (libreOfficeProfileDir && fs.existsSync(libreOfficeProfileDir)) {
            fs.rmSync(libreOfficeProfileDir, { recursive: true, force: true });
        }
    }
};

export default Office_to_pdfconverter;

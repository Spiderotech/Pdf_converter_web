import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';

const execFileAsync = promisify(execFile);
const downloadsDir = path.resolve(process.cwd(), 'downloads');

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const getGhostscriptCommand = () => process.env.GHOSTSCRIPT_PATH || 'gs';

const fallbackCompressWithPdfLib = async (filePath, outputPath) => {
    const sourceBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(sourceBytes);
    const bytes = await pdfDoc.save({ useObjectStreams: true });
    fs.writeFileSync(outputPath, bytes);
};

const Compress_pdf = async (file, quality = 'ebook') => {
    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const outputName = `${path.basename(fileName, path.extname(fileName))}-compressed.pdf`;
        const convertedFilePath = path.join(downloadsDir, outputName);
        const qualityMap = {
            screen: '/screen',
            ebook: '/ebook',
            printer: '/printer',
            prepress: '/prepress',
        };
        const pdfSettings = qualityMap[quality] || qualityMap.ebook;

        try {
            await execFileAsync(getGhostscriptCommand(), [
                '-sDEVICE=pdfwrite',
                '-dCompatibilityLevel=1.4',
                `-dPDFSETTINGS=${pdfSettings}`,
                '-dNOPAUSE',
                '-dQUIET',
                '-dBATCH',
                `-sOutputFile=${convertedFilePath}`,
                filePath,
            ], { timeout: 120000 });
        } catch (ghostscriptError) {
            console.warn('Ghostscript compression failed, using pdf-lib fallback:', ghostscriptError.message);
            await fallbackCompressWithPdfLib(filePath, convertedFilePath);
        }

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Compress_pdf:', error.message);
        throw new Error('PDF compression failed');
    }
};

export default Compress_pdf;

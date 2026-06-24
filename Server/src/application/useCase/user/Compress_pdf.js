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

const getQpdfCommand = () => process.env.QPDF_PATH || 'qpdf';

const compressWithPdfLib = async (filePath, outputPath) => {
    const sourceBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(sourceBytes);
    const bytes = await pdfDoc.save({ useObjectStreams: true });
    fs.writeFileSync(outputPath, bytes);
};

const Compress_pdf = async (file, quality = 'ebook') => {
    const temporaryFiles = [];

    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const outputName = `${path.basename(fileName, path.extname(fileName))}-compressed.pdf`;
        const convertedFilePath = path.join(downloadsDir, outputName);
        const compressionLevelMap = {
            printer: '3',
            ebook: '6',
            screen: '9',
        };
        const compressionLevel = compressionLevelMap[quality] || compressionLevelMap.ebook;
        const uniqueSuffix = `${process.pid}-${Date.now()}`;
        const qpdfCandidatePath = `${convertedFilePath}.${uniqueSuffix}.qpdf`;
        const pdfLibCandidatePath = `${convertedFilePath}.${uniqueSuffix}.pdf-lib`;
        const candidates = [filePath];

        temporaryFiles.push(qpdfCandidatePath, pdfLibCandidatePath);

        try {
            await execFileAsync(getQpdfCommand(), [
                '--object-streams=generate',
                '--stream-data=compress',
                '--recompress-flate',
                `--compression-level=${compressionLevel}`,
                '--',
                filePath,
                qpdfCandidatePath,
            ], { timeout: 120000 });

            if (fs.existsSync(qpdfCandidatePath)) {
                candidates.push(qpdfCandidatePath);
            }
        } catch (qpdfError) {
            console.warn('qpdf compression failed:', qpdfError.message);
        }

        try {
            await compressWithPdfLib(filePath, pdfLibCandidatePath);

            if (fs.existsSync(pdfLibCandidatePath)) {
                candidates.push(pdfLibCandidatePath);
            }
        } catch (pdfLibError) {
            console.warn('pdf-lib compression fallback failed:', pdfLibError.message);
        }

        const smallestCandidate = candidates.reduce((smallestPath, candidatePath) => {
            return fs.statSync(candidatePath).size < fs.statSync(smallestPath).size
                ? candidatePath
                : smallestPath;
        }, filePath);

        if (smallestCandidate === filePath) {
            fs.copyFileSync(filePath, convertedFilePath);
        } else {
            fs.renameSync(smallestCandidate, convertedFilePath);
        }

        if (!fs.existsSync(convertedFilePath)) {
            throw new Error('Compressed PDF was not created');
        }

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Compress_pdf:', error.message);
        throw new Error('PDF compression failed');
    } finally {
        for (const temporaryFile of temporaryFiles) {
            if (fs.existsSync(temporaryFile)) {
                fs.unlinkSync(temporaryFile);
            }
        }
    }
};

export default Compress_pdf;

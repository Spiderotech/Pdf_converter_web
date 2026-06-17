import { execFile } from 'child_process';
import slidesCloud from 'asposeslidescloud';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const downloadsDir = path.resolve(process.cwd(), 'downloads');

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const getOfficeCommand = () => process.env.LIBREOFFICE_PATH || 'libreoffice';

const presentationExtensions = new Set(['.ppt', '.pptx', '.pps', '.ppsx', '.pptm', '.ppsm']);

const getSlidesApi = () => {
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Aspose credentials are missing. Set ASPOSE_CLIENT_ID and ASPOSE_CLIENT_SECRET in Server/.env');
    }

    return new slidesCloud.SlidesApi(clientId, clientSecret);
};

const convertPresentationToPdf = async (filePath, convertedFilePath) => {
    const slidesApi = getSlidesApi();
    const response = await slidesApi.convert(fs.createReadStream(filePath), 'pdf');

    if (!response.body || response.body.length === 0) {
        throw new Error('Converted PDF was empty');
    }

    fs.writeFileSync(convertedFilePath, response.body);
};

const Office_to_pdfconverter = async (file) => {
    let conversionInputPath;

    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const originalExtension = path.extname(fileName);
        const outputName = `${path.basename(fileName, path.extname(fileName))}.pdf`;
        const convertedFilePath = path.join(downloadsDir, outputName);

        if (presentationExtensions.has(originalExtension.toLowerCase())) {
            console.log('Converting presentation to PDF with Aspose Slides...');
            await convertPresentationToPdf(filePath, convertedFilePath);
            return { convertedFilePath, url: `/downloads/${outputName}` };
        }

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

        const generatedOutputPath = path.join(downloadsDir, `${path.basename(conversionInputPath, path.extname(conversionInputPath))}.pdf`);

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

import { PdfApi } from 'asposepdfcloud';
import fs from 'fs';
import path from 'path';
const downloadsDir = path.resolve(process.cwd(), 'downloads');
const remoteFolder = 'PdfToWord';

const conversionOptions = {
    addReturnToLineEnd: false,
    format: 'DocX',
    imageResolutionX: 300,
    imageResolutionY: 300,
    maxDistanceBetweenTextLines: 2,
    mode: 'Textbox',
    recognizeBullets: true,
    relativeHorizontalProximity: 2.5,
};

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const getStorageName = () => process.env.ASPOSE_STORAGE_NAME || 'pdf converter storage';

const sanitizeBaseName = (fileName) => {
    const parsedName = path.basename(fileName, path.extname(fileName));
    return parsedName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-') || 'converted';
};

const getPdfApi = () => {
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Aspose credentials are missing. Set ASPOSE_CLIENT_ID and ASPOSE_CLIENT_SECRET in Server/.env');
    }

    return new PdfApi(clientId, clientSecret);
};

const Pdf_to_wordconverter = async (file) => {
    let uploadedRemotePath;
    let pdfApi;
    let storageName;

    try {
        pdfApi = getPdfApi();
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const fileBuffer = fs.readFileSync(filePath);
        storageName = getStorageName();
        const outputName = `${sanitizeBaseName(fileName)}.docx`;
        const remoteFileName = `${sanitizeBaseName(fileName)}-${Date.now()}${path.extname(fileName) || '.pdf'}`;
        const remotePath = `${remoteFolder}/${remoteFileName}`;
        uploadedRemotePath = remotePath;

        // Step 1: Upload the file to Aspose cloud storage
        console.log('Uploading file to Aspose storage...');
        await pdfApi.uploadFile(remotePath, fileBuffer, storageName);
        console.log('File uploaded successfully:', remotePath);

        // Step 2: Convert the PDF to Word and download the converted buffer.
        console.log('Converting PDF to Word...');
        const fileData = await pdfApi.getPdfInStorageToDoc(
            remoteFileName,
            conversionOptions.addReturnToLineEnd,
            conversionOptions.format,
            conversionOptions.imageResolutionX,
            conversionOptions.imageResolutionY,
            conversionOptions.maxDistanceBetweenTextLines,
            conversionOptions.mode,
            conversionOptions.recognizeBullets,
            conversionOptions.relativeHorizontalProximity,
            remoteFolder,
            storageName
        );

        if (!fileData.body || fileData.body.length === 0) {
            throw new Error('Converted Word document was empty');
        }

        ensureDownloadsDir();
        const convertedFilePath = path.join(downloadsDir, outputName);
        fs.writeFileSync(convertedFilePath, fileData.body);

        console.log('File downloaded successfully:', convertedFilePath);

        // Return the file path or a downloadable URL
        return { convertedFilePath, url: `/downloads/${path.basename(convertedFilePath)}` };

    } catch (error) {
        console.error('Error in Pdf_to_wordconverter:', error.message); 
        throw new Error('Conversion failed');
    } finally {
        if (pdfApi && uploadedRemotePath) {
            try {
                await pdfApi.deleteFile(uploadedRemotePath, storageName);
            } catch (cleanupError) {
                console.warn('Aspose cleanup failed:', cleanupError.message);
            }
        }
    }
};

export default Pdf_to_wordconverter;

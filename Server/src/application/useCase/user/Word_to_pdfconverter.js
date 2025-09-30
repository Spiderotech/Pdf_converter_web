import { WordsApi, UploadFileRequest, ConvertDocumentRequest } from 'asposewordscloud';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const clientId = '';
const clientSecret = '';
const wordsApi = new WordsApi(clientId, clientSecret);

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Pdf_to_WordConverter = async (file) => {
    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const fileBuffer = fs.readFileSync(filePath);

        const storageName = ''; // Specify storage name if needed
        const remotePath = `Converted/${fileName}`;

        // Step 1: Upload the PDF file to Aspose cloud storage
        console.log('Uploading PDF file to Aspose storage...');
        const uploadRequest = new UploadFileRequest({
            path: remotePath,
            fileContent: fileBuffer,
            storageName: storageName,
        });

        const uploadResponse = await wordsApi.uploadFile(uploadRequest);

        if (!uploadResponse || !uploadResponse.body || !uploadResponse.body.uploaded || uploadResponse.body.uploaded.length === 0) {
            throw new Error(`File upload failed. Response: ${JSON.stringify(uploadResponse)}`);
        }

        console.log('File uploaded successfully:', uploadResponse.body.uploaded[0]);

        // Step 2: Convert the PDF document to Word
        console.log('Converting PDF to Word...');
        const convertRequest = new ConvertDocumentRequest({
            document: fs.createReadStream(filePath),
            format: 'pdf',
        });

        const convertResponse = await wordsApi.convertDocument(convertRequest); 

        // Step 3: Save the converted Word document
        const wordFileName = path.basename(fileName, path.extname(fileName)) + '.pdf';
        const downloadPath = path.join(__dirname, 'downloads', wordFileName);
        fs.writeFileSync(downloadPath, convertResponse.body);

        console.log('File converted and saved successfully:', downloadPath);

        // Return the file path or a downloadable URL
        return { convertedFilePath: downloadPath, url: `/downloads/${path.basename(downloadPath)}` };

    } catch (error) {
        console.error('Error in Pdf_to_WordConverter:', error.message);

        // Log detailed error response if available
        if (error.response && error.response.body) {
            console.error('Server response (raw):', error.response.body.toString());
        }

        // Log the raw error object for more context
        console.error('Raw error:', error);

        throw new Error('Conversion failed');
    }
};

export default Pdf_to_WordConverter;

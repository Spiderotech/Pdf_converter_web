import { PdfApi } from 'asposepdfcloud';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const clientId = '';
const clientSecret = '';
const pdfApi = new PdfApi(clientId, clientSecret);

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Pdf_to_wordconverter = async (file) => {
    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const fileBuffer = fs.readFileSync(filePath);

        const storageName = 'pdf converter storage'; // Specify the storage name if needed, otherwise leave as an empty string
        const resultPath = `Converted/${path.basename(fileName, '.pdf')}.docx`;

        // Step 1: Upload the file to Aspose cloud storage
        console.log('Uploading file to Aspose storage...');
        await pdfApi.uploadFile(fileName, Buffer.from(fileBuffer), storageName);
        console.log('File uploaded successfully:', fileName);

        // Step 2: Convert the PDF to Word document in storage
        console.log('Converting PDF to Word...');
        await pdfApi.putPdfInStorageToDoc(
            fileName,
            resultPath,
            '', '', '', '', '', '', '', '', '', // Empty optional parameters 
            storageName
        );
        console.log('File converted successfully:', resultPath); 

        // Step 3: Download the converted file from Aspose storage
        console.log('Downloading converted file...');
        const fileData = await pdfApi.downloadFile(resultPath, storageName, '');
        const convertedFilePath = path.join(__dirname, 'downloads', path.basename(resultPath));
        
        fs.writeFileSync(convertedFilePath, fileData.body);

        console.log('File downloaded successfully:', convertedFilePath);

        // Return the file path or a downloadable URL
        return { convertedFilePath, url: `/downloads/${path.basename(convertedFilePath)}` };

    } catch (error) {
        console.error('Error in Pdf_to_wordconverter:', error.message); 
        throw new Error('Conversion failed');
    }
};

export default Pdf_to_wordconverter;

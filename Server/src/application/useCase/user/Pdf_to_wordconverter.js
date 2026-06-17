import { ConvertDocumentRequest, WordsApi } from 'asposewordscloud';
import fs from 'fs';
import path from 'path';

const downloadsDir = path.resolve(process.cwd(), 'downloads');

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const sanitizeBaseName = (fileName) => {
    const parsedName = path.basename(fileName, path.extname(fileName));
    return parsedName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-') || 'converted';
};

const getWordsApi = () => {
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Aspose credentials are missing. Set ASPOSE_CLIENT_ID and ASPOSE_CLIENT_SECRET in Server/.env');
    }

    return new WordsApi(clientId, clientSecret);
};

const Pdf_to_wordconverter = async (file) => {
    try {
        const wordsApi = getWordsApi();
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const outputName = `${sanitizeBaseName(fileName)}.docx`;
        const convertedFilePath = path.join(downloadsDir, outputName);

        console.log('Converting PDF to editable Word...');
        const convertRequest = new ConvertDocumentRequest({
            document: fs.createReadStream(filePath),
            format: 'docx',
        });

        const convertResponse = await wordsApi.convertDocument(convertRequest);

        if (!convertResponse.body || convertResponse.body.length === 0) {
            throw new Error('Converted Word document was empty');
        }

        ensureDownloadsDir();
        fs.writeFileSync(convertedFilePath, convertResponse.body);

        console.log('File converted successfully:', convertedFilePath);

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Pdf_to_wordconverter:', error.message);
        throw new Error('Conversion failed');
    }
};

export default Pdf_to_wordconverter;

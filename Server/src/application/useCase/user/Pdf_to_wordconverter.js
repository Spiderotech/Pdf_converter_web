import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const downloadsDir = path.resolve(process.cwd(), 'downloads');
const scriptsDir = path.resolve(process.cwd(), 'scripts');

const ensureDownloadsDir = () => {
    fs.mkdirSync(downloadsDir, { recursive: true });
};

const sanitizeBaseName = (fileName) => {
    const parsedName = path.basename(fileName, path.extname(fileName));
    return parsedName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-') || 'converted';
};

const getPythonCommand = () => process.env.PYTHON_PDF_TOOLS_BIN || process.env.PYTHON_BIN || 'python3';
const getPdfToWordScript = () => {
    const engine = (process.env.PDF_TO_WORD_ENGINE || 'pdf2docx').toLowerCase();

    if (engine === 'structured' || engine === 'google-docs') {
        return 'pdf_to_structured_docx.py';
    }

    return 'pdf_to_docx.py';
};

const Pdf_to_wordconverter = async (file) => {
    try {
        const { path: filePath, originalname: fileName } = file;

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        ensureDownloadsDir();

        const outputName = `${sanitizeBaseName(fileName)}.docx`;
        const convertedFilePath = path.join(downloadsDir, outputName);
        const scriptName = getPdfToWordScript();
        const scriptPath = path.join(scriptsDir, scriptName);

        console.log(`Converting PDF to editable Word locally with ${scriptName}...`);

        const { stdout, stderr } = await execFileAsync(getPythonCommand(), [
            scriptPath,
            filePath,
            convertedFilePath,
        ], {
            timeout: Number(process.env.PDF_TO_DOCX_TIMEOUT_MS || 300000),
            maxBuffer: 1024 * 1024 * 10,
        });

        if (stdout) {
            console.log('PDF to DOCX stdout:', stdout);
        }

        if (stderr) {
            console.warn('PDF to DOCX stderr:', stderr);
        }

        if (!fs.existsSync(convertedFilePath) || fs.statSync(convertedFilePath).size === 0) {
            throw new Error('Converted Word document was not created');
        }

        return { convertedFilePath, url: `/downloads/${outputName}` };
    } catch (error) {
        console.error('Error in Pdf_to_wordconverter:', error.message);
        throw new Error('Conversion failed');
    }
};

export default Pdf_to_wordconverter;

# PDF Converter Web - Website Update, Tools, and Hosting Plan

## 1. Goal

The goal is to upgrade the current PDF Converter Web project into a public online document tools website.

The updated website should allow users to open a tool, upload a file, process it, and download the result without requiring login.

Recommended launch model:

```text
Frontend: Namecheap Stellar shared hosting
Backend: Railway
Database: Not required for launch
Ads: Google AdSense for website monetization
Advanced conversion APIs: Optional later
```

## 2. Recommended Product Direction

For the first public version, login should not be required.

Public tool flow:

```text
Open website -> choose tool -> upload file -> process file -> download output
```

This is better for launch because:

- Users can convert files faster.
- The app is simpler to maintain.
- No password or user account security is needed.
- MongoDB can be avoided at launch.
- Hosting cost stays low.
- AdSense approval is easier when the site is simple and publicly accessible.

Login can be added later only if the site needs:

- Conversion history
- Saved files
- Premium plans
- Usage limits
- Admin dashboard
- Subscription billing
- User-specific quotas

## 3. Existing Project Summary

Current structure:

```text
Pdf_converter_web/
|-- Client/      React + Vite frontend
|-- Server/      Node.js + Express backend
|-- README.md
```

Current frontend:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- Axios

Current backend:

- Node.js
- Express
- Multer
- MongoDB/Mongoose
- JWT/Bcrypt authentication
- Aspose PDF/Words Cloud SDKs

Current working tools:

- PDF to Word
- Word to PDF

Current user features:

- Register
- Login
- Google login
- Account page

Recommended update:

- Keep the backend for file processing.
- Hide or remove login/register/account from the public launch flow.
- Keep authentication code only if premium features are planned soon.
- Replace hardcoded localhost URLs with environment-based API URLs.

## 4. New Tool List

Planned tools:

```text
Compress PDF
Merge PDF
Split PDF
Sign PDF
Edit PDF
PDF to DOCX / Word
DOCX / Word to PDF
PPTX to PDF
XLSX to CSV
Excel to PDF
PDF to Excel
Unlock PDF
Protect PDF
```

Recommended routes:

```text
/compress-pdf
/merge-pdf
/split-pdf
/sign-pdf
/edit-pdf
/pdf-to-word
/word-to-pdf
/pptx-to-pdf
/xlsx-to-csv
/excel-to-pdf
/pdf-to-excel
/unlock-pdf
/protect-pdf
```

Recommended backend base route:

```text
/api/v1/tools
```

Recommended backend endpoints:

```text
POST /api/v1/tools/compress-pdf
POST /api/v1/tools/merge-pdf
POST /api/v1/tools/split-pdf
POST /api/v1/tools/sign-pdf
POST /api/v1/tools/edit-pdf
POST /api/v1/tools/pdf-to-word
POST /api/v1/tools/word-to-pdf
POST /api/v1/tools/pptx-to-pdf
POST /api/v1/tools/xlsx-to-csv
POST /api/v1/tools/excel-to-pdf
POST /api/v1/tools/pdf-to-excel
POST /api/v1/tools/unlock-pdf
POST /api/v1/tools/protect-pdf
```

## 5. Free Libraries To Use

Use free libraries first. Add paid APIs only for conversions that cannot be done reliably with npm packages.

### 5.1 PDF Libraries

| Feature | Library | Recommended Location | Notes |
|---|---|---|---|
| Merge PDF | `pdf-lib` | Frontend or backend | Good free option |
| Split PDF | `pdf-lib` | Frontend or backend | Good free option |
| Reorder PDF pages | `pdf-lib` | Frontend or backend | Good free option |
| Rotate PDF pages | `pdf-lib` | Frontend or backend | Good free option |
| Add text to PDF | `pdf-lib` | Frontend or backend | Good for basic editing |
| Add image to PDF | `pdf-lib` | Frontend or backend | Useful for signatures |
| Sign PDF with image/drawing | `pdf-lib` | Frontend or backend | Not a certificate-based digital signature |
| Fill PDF forms | `pdf-lib` | Frontend or backend | Good if PDF has form fields |
| PDF preview | `pdfjs-dist` | Frontend | Use for viewing pages |
| Extract PDF text | `pdf-parse` | Backend | Useful for search/extraction |
| Image processing | `sharp` | Backend | Useful for image to PDF and compression helpers |

### 5.2 Office and Spreadsheet Libraries

| Feature | Library | Recommended Location | Notes |
|---|---|---|---|
| XLSX to CSV | `xlsx` | Frontend or backend | Best free first tool |
| CSV to XLSX | `xlsx` | Frontend or backend | Optional extra |
| Read Excel data | `xlsx` | Frontend or backend | Good support |
| Generate DOCX | `docx` | Frontend or backend | Creates Word files |
| Read DOCX text | `mammoth` | Frontend or backend | Extracts clean text from DOCX |

Install frontend libraries:

```bash
cd Client
npm install pdf-lib pdfjs-dist xlsx mammoth docx
```

Install backend libraries:

```bash
cd Server
npm install pdf-lib pdf-parse multer xlsx mammoth docx sharp
```

## 6. Feature Feasibility

| Feature | Possible With Free Libraries? | Recommended Implementation |
|---|---|---|
| Compress PDF | Partially | Start with basic optimization; advanced compression later |
| Merge PDF | Yes | Use `pdf-lib` |
| Split PDF | Yes | Use `pdf-lib` |
| Sign PDF | Yes | Use `pdf-lib` with image/drawn signature |
| Edit PDF | Basic only | Use `pdfjs-dist` preview + `pdf-lib` overlays |
| PDF to DOCX | Not reliably | Use Aspose/CloudConvert later |
| DOCX to PDF | Not reliably on Railway without extra binaries | Use API later, or LibreOffice on VPS |
| PPTX to PDF | Not reliably on Railway without extra binaries | Use API later, or LibreOffice on VPS |
| XLSX to CSV | Yes | Use `xlsx` |
| Excel to PDF | Not reliably | Use API later, or LibreOffice on VPS |
| PDF to Excel | Not reliably | Use API later |
| Unlock PDF | Possible with backend tooling | May need `qpdf` or a compatible service |
| Protect PDF | Possible with backend tooling | May need `qpdf` or a compatible service |

## 7. Recommended Launch Phases

### Phase 1 - Public Tool Website

Implement tools that can be done cheaply and reliably:

- Merge PDF
- Split PDF
- Sign PDF
- Edit PDF basic
- XLSX to CSV
- Existing PDF to Word
- Existing Word to PDF

Remove or hide:

- Login button
- Register button
- Account page

Add:

- Contact page
- Tool landing pages
- Help/SEO content for each tool
- AdSense-ready layout

### Phase 2 - Backend Tool API

Create a new backend route group:

```text
/api/v1/tools
```

Add reusable backend pieces:

- Upload middleware
- File validation
- File size limits
- Temporary file cleanup
- Standard download response
- Error response format

Recommended temporary file flow:

```text
Upload file -> save to temp folder -> process -> return output -> delete temp files
```

Important for Railway:

- Do not treat Railway storage as permanent.
- Uploaded files should be temporary.
- Delete files after processing.
- Use external storage later only if saved files are needed.

### Phase 3 - Advanced Conversions

Add API-based conversions only when needed:

- PDF to DOCX
- DOCX to PDF
- PPTX to PDF
- Excel to PDF
- PDF to Excel

Possible paid services:

- Aspose Cloud
- CloudConvert
- ConvertAPI

To keep costs low, advanced conversion tools can be:

- Limited by file size
- Limited by daily usage
- Monetized with ads
- Added later as premium tools

### Phase 4 - Optional Accounts and Premium

Add login only if business features are needed:

- Free user limits
- Premium user limits
- Conversion history
- Saved files
- Subscription billing

## 8. Frontend Implementation Plan

### 8.1 Update Routes

Update `Client/src/App.tsx` with new public tool routes.

Example:

```tsx
<Route path="/compress-pdf" element={<CompressPdfPage />} />
<Route path="/merge-pdf" element={<MergePdfPage />} />
<Route path="/split-pdf" element={<SplitPdfPage />} />
<Route path="/sign-pdf" element={<SignPdfPage />} />
<Route path="/edit-pdf" element={<EditPdfPage />} />
<Route path="/xlsx-to-csv" element={<XlsxToCsvPage />} />
```

### 8.2 Create Reusable Components

Recommended components:

```text
Client/src/Components/tools/FileDropzone.tsx
Client/src/Components/tools/ToolLayout.tsx
Client/src/Components/tools/DownloadResult.tsx
Client/src/Components/tools/ProcessingState.tsx
Client/src/Components/tools/AdBanner.tsx
```

Purpose:

- `FileDropzone`: handles choose-file and drag-drop.
- `ToolLayout`: shared page layout for all tools.
- `DownloadResult`: shows download button after conversion.
- `ProcessingState`: loading/progress UI.
- `AdBanner`: reusable AdSense slot.

### 8.3 Configure API URL With Environment Variable

Create:

```text
Client/.env
```

Local:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Production:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

Update Axios config:

```ts
import axios from "axios";

export const baseUrl = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: baseUrl,
});

export default instance;
```

### 8.4 Hide Login For Launch

Recommended changes:

- Remove login/register buttons from the header.
- Remove account menu.
- Keep privacy and terms pages.
- Add contact page.
- Add tool navigation.

The authentication files can stay in the codebase if they will be used later.

## 9. Backend Implementation Plan

### 9.1 Add Tool Routes

Recommended file:

```text
Server/src/framework/webserver/routes/tools/tools.js
```

Example route structure:

```js
router.post("/merge-pdf", upload.array("files"), controller.mergePdf);
router.post("/split-pdf", upload.single("file"), controller.splitPdf);
router.post("/sign-pdf", upload.single("file"), controller.signPdf);
router.post("/xlsx-to-csv", upload.single("file"), controller.xlsxToCsv);
```

Then mount it:

```js
app.use("/api/v1/tools", toolsRouter(express));
```

### 9.2 Add File Upload Limits

Use Multer limits:

```js
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});
```

Start with a 25 MB limit for Railway.

### 9.3 Add File Validation

Validate file extensions and MIME types.

Examples:

```text
PDF tools: .pdf
Word tools: .doc, .docx
PowerPoint tools: .ppt, .pptx
Excel tools: .xls, .xlsx, .csv
```

### 9.4 Add Temporary File Cleanup

After response is sent, remove uploaded and generated files.

Recommended:

```js
res.download(outputPath, outputName, (err) => {
  cleanupFiles([inputPath, outputPath]);
});
```

### 9.5 Move Secrets To Environment Variables

Do not keep secrets in code.

Backend `.env` for local development:

```env
PORT=3000
MONGO_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ASPOSE_CLIENT_ID=
ASPOSE_CLIENT_SECRET=
CORS_ORIGIN=http://localhost:5173
```

Railway variables:

```text
PORT
MONGO_URI
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
ASPOSE_CLIENT_ID
ASPOSE_CLIENT_SECRET
CORS_ORIGIN
```

If login is disabled for launch, MongoDB and JWT variables are not required immediately.

## 10. Hosting Setup

## 10.1 Recommended Hosting Architecture

```text
Namecheap
├── Domain DNS
├── Static React frontend
├── Free SSL
├── Supersonic CDN
└── Optional business email

Railway
├── Express backend
├── File processing API
├── Environment variables
└── Temporary upload processing

MongoDB Atlas
└── Optional later if login/accounts are enabled
```

## 10.2 Namecheap Frontend Setup

Use Namecheap Stellar for the React frontend.

Steps:

1. Build the React app locally:

```bash
cd Client
npm install
npm run build
```

2. The production output will be:

```text
Client/dist/
```

3. Upload the contents of `Client/dist/` to Namecheap:

```text
public_html/
```

4. Enable SSL in cPanel.

5. Enable Supersonic CDN if available for the domain.

6. For React Router, add a fallback rule so refresh works on tool pages.

Create or update `.htaccess` inside `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 10.3 Railway Backend Setup

Steps:

1. Push the project to GitHub.

2. Create a Railway account.

3. Create a new Railway project.

4. Select "Deploy from GitHub repo".

5. Choose this repository.

6. Set the backend root directory:

```text
Server
```

7. Set install command:

```bash
npm install
```

8. Set start command:

```bash
npm start
```

For production, change the server start script to avoid `nodemon`.

Recommended `Server/package.json`:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

9. Add Railway environment variables.

Example:

```text
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

10. Deploy.

11. Railway will generate a backend URL like:

```text
https://your-app-name.up.railway.app
```

## 10.4 Custom API Domain

Recommended domain setup:

```text
yourdomain.com      -> Namecheap frontend
www.yourdomain.com  -> Namecheap frontend
api.yourdomain.com  -> Railway backend
```

In Railway:

1. Open backend service.
2. Go to settings/domains.
3. Add custom domain:

```text
api.yourdomain.com
```

In Namecheap DNS:

1. Open Advanced DNS.
2. Add the CNAME record Railway provides.

Example:

```text
Type: CNAME
Host: api
Value: Railway provided target
TTL: Automatic
```

Then update frontend production env:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

Rebuild and re-upload frontend after changing the env variable.

## 11. Ad Monetization Setup

Use Google AdSense for the website.

Do not use AdMob unless you create an Android or iOS mobile app.

AdSense requirements to prepare:

- Live domain
- HTTPS enabled
- Privacy policy page
- Terms page
- Contact page
- Useful original content
- No broken pages
- Clear navigation
- No misleading ad placements

Recommended ad placements:

- Homepage after tools section
- Tool page below upload area
- Tool result area below the download button
- Blog/help pages between content sections

Avoid:

- Ads too close to the upload button
- Ads that look like download buttons
- Popups that block conversion
- Encouraging users to click ads

Recommended component:

```text
Client/src/Components/ads/AdBanner.tsx
```

Example AdSense script in `Client/index.html` after approval:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX"
  crossorigin="anonymous">
</script>
```

## 12. SEO and Content Pages

To improve Google traffic and AdSense approval, add informational pages for each tool.

Recommended pages:

```text
/how-to-compress-pdf
/how-to-merge-pdf
/how-to-split-pdf
/how-to-sign-pdf
/how-to-edit-pdf
/how-to-convert-pdf-to-word
/how-to-convert-word-to-pdf
/how-to-convert-xlsx-to-csv
/privacy
/terms
/contact
```

Each page should include:

- What the tool does
- How to use it
- File privacy note
- Supported file types
- Common issues
- Link to the tool

## 13. Privacy and File Handling Policy

Recommended user-facing file privacy message:

```text
Uploaded files are processed only for the selected conversion or PDF task. Files are temporary and are deleted automatically after processing. Do not upload files you are not allowed to process.
```

Backend behavior should match this:

- Files are temporary.
- Files are not saved permanently.
- Files are deleted after processing.
- No conversion history unless login is added later.

## 14. Security Checklist

Before launch:

- Move all secrets to environment variables.
- Restrict CORS to the live frontend domain.
- Add upload file size limits.
- Validate file type and extension.
- Delete temporary files after processing.
- Do not expose Aspose or other API secrets in frontend code.
- Add basic rate limiting if traffic grows.
- Add error handling for failed conversions.
- Add HTTPS for frontend and backend.

Recommended backend packages:

```bash
npm install helmet express-rate-limit
```

Use `helmet` for safer HTTP headers.

Use `express-rate-limit` to reduce abuse.

## 15. Cost Control Plan

Cheapest launch setup:

```text
Namecheap Stellar: frontend/domain/email
Railway: backend
MongoDB Atlas Free: only if login is enabled later
Free npm libraries: first tool implementations
AdSense: monetization
Paid conversion APIs: optional later
```

Cost-saving rules:

- Process simple PDF tools with free libraries.
- Avoid storing files permanently.
- Keep file size limits small at launch.
- Do not enable user accounts until needed.
- Do not pay for cloud conversion APIs until traffic or revenue justifies it.
- Add advanced conversion tools gradually.

## 16. Suggested Implementation Order

1. Remove/hide login requirement from public UI.
2. Add new tool pages and navigation.
3. Add reusable upload/download components.
4. Add backend `/api/v1/tools` route group.
5. Implement `merge-pdf` with `pdf-lib`.
6. Implement `split-pdf` with `pdf-lib`.
7. Implement `sign-pdf` with `pdf-lib`.
8. Implement `xlsx-to-csv` with `xlsx`.
9. Add file cleanup and upload validation.
10. Move API URL and backend secrets to environment variables.
11. Deploy backend to Railway.
12. Build frontend and upload to Namecheap.
13. Add contact page and SEO/help pages.
14. Apply for Google AdSense.
15. Add advanced conversion APIs later if needed.

## 17. Final Recommended MVP

Launch with:

- Homepage
- Tools listing page
- Compress PDF basic
- Merge PDF
- Split PDF
- Sign PDF
- Edit PDF basic
- XLSX to CSV
- PDF to Word
- Word to PDF
- Privacy page
- Terms page
- Contact page
- Railway backend
- Namecheap frontend
- No login
- AdSense-ready layout

This gives the website a strong low-cost starting point while leaving room for premium tools and user accounts later.

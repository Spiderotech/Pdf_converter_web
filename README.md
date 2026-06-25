# PDF Converter Web

PDF Converter Web is a full-stack document utility application. It combines a React/Vite frontend with an Express/MongoDB backend for authentication and server-side conversions. Some tools run entirely in the browser, while heavier conversion/security features use backend services and system tools.

## Repository

```text
git@github.com:Spiderotech/Pdf_converter_web.git
```

## Current Hosting Status

The project now includes production-oriented backend hosting files:

- `Dockerfile` installs Node 22, LibreOffice, common Office-compatible fonts, Tesseract, Python pdf2docx dependencies, and qpdf for backend conversion features.
- `nixpacks.toml` declares Node, LibreOffice, common fonts, Tesseract, Python, and qpdf packages for Railway/Nixpacks deployments.
- `Client/src/Utils/axios.ts` reads `VITE_API_BASE_URL` and falls back to:

```text
https://pdfconverterweb-production.up.railway.app/api/v1/user
```

Set `VITE_API_BASE_URL` explicitly for each deployed frontend environment.

## Main Features

- User registration, login, Google user creation/login, and persisted auth state
- PDF to Word and Word to PDF conversion
- PowerPoint to PDF and Excel to PDF conversion
- PDF compression, password protection, and password unlock
- Browser-based PDF merge, split, signing, and editing
- Browser-based XLS/XLSX to CSV export
- Homepage, reusable navigation, tool pages, loading overlay, account page, FAQ, contact, about, privacy, and terms pages

## Tech Stack

Frontend:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Redux Toolkit and Redux Persist
- Axios
- React Hook Form and Yup
- React OAuth Google
- React Icons
- `pdf-lib`
- `pdfjs-dist`
- `xlsx`

Backend:

- Node.js
- Express
- MongoDB and Mongoose
- JWT
- Bcrypt
- Multer
- LibreOffice
- Office-compatible Linux fonts
- Python `pdf2docx`
- Tesseract OCR
- qpdf
- `pdf-lib`
- Dotenv
- Morgan
- CORS

## Project Structure

```text
Pdf_converter_web/
|-- Client/                         # React + Vite frontend
|   |-- public/                     # Static public files
|   |-- src/
|   |   |-- assets/                 # Images, logos, icons, generated tool artwork
|   |   |-- Components/             # Shared UI components
|   |   |-- Components/tools/       # Dedicated tool implementations
|   |   |-- Pages/                  # Route-level page components
|   |   |-- redux/                  # Redux Toolkit store and slices
|   |   |-- Utils/axios.ts          # API base URL configuration
|   |   |-- App.tsx                 # Frontend routes
|   |   +-- main.tsx                # React app entry point
|   |-- .env.example                # Frontend env template
|   |-- package.json
|   +-- vite.config.ts
|-- Server/                         # Node.js + Express backend
|   |-- src/
|   |   |-- adapters/               # Controllers
|   |   |-- application/            # Use cases, repository interfaces, services
|   |   |-- config/                 # Dotenv-backed config
|   |   |-- entities/               # Domain helpers
|   |   +-- framework/              # Express, database, services, routes
|   |-- uploads/                    # Multer temporary uploads
|   |-- downloads/                  # Generated output files
|   |-- app.js
|   +-- package.json
|-- Dockerfile
|-- nixpacks.toml
+-- README.md
```

## Local Setup

Install dependencies:

```bash
cd Client
npm install

cd ../Server
npm install
```

Create backend environment values:

```text
PORT=3000
MONGO_URI=<mongodb-connection-string>
ACCESS_TOKEN_SECRET=<jwt-access-secret>
REFRESH_TOKEN_SECRET=<jwt-refresh-secret>
LIBREOFFICE_PATH=libreoffice
PYTHON_PDF_TOOLS_BIN=python3
PDF_TO_DOCX_OCR=auto
QPDF_PATH=qpdf
CLIENT_URL=<frontend-url>
```

Optional frontend environment values:

```text
VITE_API_BASE_URL=http://localhost:3000/api/v1/user
VITE_SHOW_TEST_ADS=true
VITE_ADSENSE_CLIENT_ID=
VITE_ADSENSE_SLOT_ID=
```

Run backend:

```bash
cd Server
npm start
```

Run frontend:

```bash
cd Client
npm run dev
```

The backend runs on `http://localhost:3000`, and Vite usually runs on `http://localhost:5173`.

## Frontend Routes

```text
/                  Homepage
/login             Login page
/register          Register page
/pdf-to-word       PDF to Word converter
/word-to-pdf       Word to PDF converter
/compress-pdf      Compress PDF
/merge-pdf         Merge PDFs in browser
/split-pdf         Split PDF in browser
/sign-pdf          Sign PDF in browser
/edit-pdf          Edit PDF in browser
/pptx-to-pdf       PowerPoint to PDF
/excel-to-pdf      Excel to PDF
/xlsx-to-csv       XLS/XLSX to CSV in browser
/unlock-pdf        Unlock PDF
/protect-pdf       Protect PDF
/about             About page
/contact           Contact page
/faq               FAQ page
/privacy           Privacy policy
/terms&conditions  Terms and conditions
/account           Protected account page
```

## Backend API Routes

Base route:

```text
/api/v1/user
```

Available endpoints:

```text
POST /createuser
POST /login
POST /googlelogin
POST /googlecreateuser
POST /pdfconverter
POST /wordconverter
POST /pptxtopdf
POST /exceltopdf
POST /protectpdf
POST /unlockpdf
POST /compresspdf
```

## Tool Processing

Server-backed tools:

- PDF to Word: Python `pdf2docx`; scanned PDFs are OCR-processed with Tesseract when needed
- Word to PDF: LibreOffice headless with `writer_pdf_Export`
- PPT/PPTX to PDF: LibreOffice headless with `impress_pdf_Export`
- XLS/XLSX to PDF: LibreOffice headless with `calc_pdf_Export`
- Protect PDF: qpdf
- Unlock PDF: qpdf
- Compress PDF: qpdf with `pdf-lib` fallback

Browser-only tools:

- Merge PDF
- Split PDF
- Sign PDF
- Edit PDF
- XLS/XLSX to CSV

## Build Commands

Frontend:

```bash
cd Client
npm run build
npm run preview
npm run lint
```

Backend:

```bash
cd Server
npm start
npm run dev
```

## Production Notes

- Restrict CORS to deployed frontend domains before public launch.
- Add Multer file size and MIME/type validation.
- Clean temporary files from `uploads/` and `downloads/`.
- Keep `.env` files, JWT secrets, and MongoDB URI out of Git.
- Confirm LibreOffice, Office-compatible fonts, Python pdf2docx dependencies, Tesseract, and qpdf exist in the hosted backend runtime.
- Verify all server-backed conversions from the deployed frontend after setting `VITE_API_BASE_URL`.

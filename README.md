# PDF Converter Web

PDF Converter Web is a full-stack document conversion application. It provides a React web interface for user registration, login, PDF-to-Word conversion, and Word-to-PDF conversion. The backend is built with Node.js, Express, MongoDB, and Aspose Cloud SDKs for document conversion.

## Repository

Git repository:

```text
git@github.com:Spiderotech/Pdf_converter_web.git
```

Current hosting status:

```text
Not hosted yet
```

## Main Features

- User registration with name, email, and password
- User login with JWT access token generation
- Google user registration/login flow
- PDF to Word conversion
- Word to PDF conversion
- Drag-and-drop file upload UI
- Account page protected by frontend authentication state
- Privacy policy and terms pages

## Tech Stack

Frontend:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- Redux Persist
- Axios
- React Hook Form
- Yup
- React OAuth Google

Backend:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Aspose PDF Cloud
- Aspose Words Cloud
- Morgan
- CORS

## Project Structure

```text
Pdf_converter_web/
|-- Client/                  # React + Vite frontend
|   |-- public/              # Static public files
|   |-- src/
|   |   |-- assets/          # Images, icons, and visual assets
|   |   |-- Components/      # Reusable UI components
|   |   |-- Pages/           # Route-level page components
|   |   |-- redux/           # Redux store and slices
|   |   |-- Utils/           # Axios configuration
|   |   |-- App.tsx          # Frontend routes
|   |   +-- main.tsx         # React app entry point
|   |-- package.json         # Frontend dependencies and scripts
|   +-- vite.config.ts       # Vite configuration
|-- Server/                  # Node.js + Express backend
|   |-- src/
|   |   |-- adapters/        # Controllers
|   |   |-- application/     # Use cases, repository interfaces, services
|   |   |-- config/          # App configuration
|   |   |-- entities/        # Domain entities
|   |   +-- framework/       # Express, database, services, routes
|   |-- uploads/             # Uploaded files from Multer
|   |-- downloads/           # Converted output files
|   |-- app.js               # Backend entry point
|   +-- package.json         # Backend dependencies and scripts
|-- README.md
|-- PROJECT_DOCUMENTATION.md
+-- HOSTING_DOCUMENTATION.md
```

## Local Setup

### 1. Clone the Repository

```bash
git clone git@github.com:Spiderotech/Pdf_converter_web.git
cd Pdf_converter_web
```

### 2. Install Frontend Dependencies

```bash
cd Client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../Server
npm install
```

### 4. Configure Backend

Update [Server/src/config/config.js](/Users/am/Desktop/Pdf_converter_web/Server/src/config/config.js) with:

- MongoDB connection URI
- JWT access token secret
- JWT refresh token secret, if refresh tokens are later implemented
- Aspose Cloud credentials in the converter use case files

Current config shape:

```js
export default {
  port: "3000",
  mongo: {
    uri: ""
  },
  ACESS_TOKEN_SCERET: "",
  REFRESH_TOKEN_SECRET: ""
}
```

Important: secrets should be moved to environment variables before production hosting.

### 5. Run Backend

```bash
cd Server
npm start
```

The backend runs on:

```text
http://localhost:3000
```

### 6. Run Frontend

```bash
cd Client
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## API Base URL

The frontend currently uses:

```ts
http://localhost:3000/api/v1/user
```

This is configured in [Client/src/Utils/axios.ts](/Users/am/Desktop/Pdf_converter_web/Client/src/Utils/axios.ts).

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
```

## Build Commands

Frontend production build:

```bash
cd Client
npm run build
```

Frontend preview:

```bash
cd Client
npm run preview
```

Frontend lint:

```bash
cd Client
npm run lint
```

Backend start:

```bash
cd Server
npm start
```

## Notes

- The project is currently configured for local development.
- The frontend API URL is hardcoded to localhost.
- Backend secrets and Aspose credentials are currently empty in the codebase.
- `uploads/` and `downloads/` store user-uploaded and converted files.
- Before hosting, move sensitive config to environment variables and configure CORS for the deployed frontend domain.


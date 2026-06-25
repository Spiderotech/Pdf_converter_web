# FileBrother Website Legal Documentation

This website contains the current privacy policy, terms, data management summary, and permission notes for FileBrother.

## Current App Working Model

FileBrother is a document conversion and PDF utility web app.

Detailed app flow:

1. User opens the FileBrother website.
2. User can browse the homepage, tools, about page, contact page, FAQ page, privacy policy, and terms page.
3. User selects a document tool from the navigation or homepage.
4. Browser-only tools process selected files locally in the user's browser.
5. Server-backed tools upload the selected file to the backend for conversion, compression, protection, or unlock processing.
6. The backend stores uploaded files temporarily in the `uploads/` directory through Multer.
7. The backend creates converted or processed output files in the `downloads/` directory.
8. The backend returns the processed file to the browser as a download response.
9. The frontend creates a browser download URL for the returned file and lets the user save the result.
10. For PDF protection, the user enters a new password that is sent to the backend only for that request.
11. For PDF unlock, the user enters the current PDF password that is sent to the backend only for that request.
12. For compression, the user may choose a lossless compression level that is sent with the file.
13. PDF to Word uses local Python `pdf2docx`; scanned PDFs may be OCR-processed with Tesseract before DOCX conversion.
14. Word, PowerPoint, and Excel to PDF use LibreOffice headless with type-specific PDF export filters and common Office-compatible fonts; PDF utilities may use qpdf and `pdf-lib` depending on the selected tool.
15. Browser-only tools use frontend libraries such as `pdf-lib`, `pdfjs-dist`, and `xlsx`.
16. The current public tool flow does not intentionally request camera, microphone, location, contacts, notification, or payment permissions.
17. The current public tool flow does not sell uploaded documents.
18. The current public tool flow does not include a payment, subscription, or active advertising flow in the inspected implementation.
19. FileBrother is planning to add ads on each public screen or tool page in the future.
20. Before ads are enabled, the Privacy Policy should be updated with the ad provider, ad placement details, ad personalization status, cookies or similar technologies, consent requirements, and any user choices.
21. Backend file cleanup is an operational requirement because uploaded files and generated downloads may remain on server storage unless removed by cleanup logic or hosting environment lifecycle.

Screen/function summary:

| Area | What it does | Data involved |
| --- | --- | --- |
| Homepage | Shows FileBrother tools and navigation. | Basic browser request data. |
| PDF to Word | Converts uploaded PDF to DOCX. | Uploaded PDF, generated DOCX, local `pdf2docx` processing, and OCR processing for scanned PDFs where needed. |
| Word to PDF | Converts uploaded DOC/DOCX to PDF. | Uploaded Word document, generated PDF, LibreOffice processing. |
| PowerPoint to PDF | Converts uploaded presentation to PDF. | Uploaded PPT/PPTX file, generated PDF, LibreOffice processing. |
| Excel to PDF | Converts uploaded spreadsheet to PDF. | Uploaded XLS/XLSX file, generated PDF, LibreOffice processing. |
| Compress PDF | Reduces PDF file size. | Uploaded PDF, compression quality, generated compressed PDF. |
| Protect PDF | Adds password protection. | Uploaded PDF, user-entered password for the request, generated protected PDF. |
| Unlock PDF | Removes password protection when the correct password is supplied. | Uploaded PDF, user-entered password for the request, generated unlocked PDF. |
| Merge PDF | Combines selected PDFs in the browser. | Local browser files, generated merged PDF object URL. |
| Split PDF | Extracts or splits selected PDF pages in the browser. | Local browser PDF, selected pages, generated split PDF object URL. |
| Sign PDF | Adds uploaded or drawn signature in the browser. | Local browser PDF, signature file or drawing data, generated signed PDF object URL. |
| Edit PDF | Adds text, shapes, drawings, or images in the browser. | Local browser PDF, local edit inputs, generated edited PDF object URL. |
| XLSX to CSV | Converts spreadsheet data to CSV in the browser. | Local XLS/XLSX file, selected sheet, generated CSV object URL. |
| Contact | Provides support/contact path. | Any details the user voluntarily sends through contact channels. |
| Privacy and Terms | Shows legal policy pages. | Basic browser request data. |
| Planned ads | Planned ad placements across public screens and tool pages. | Ad provider request data may include browser, device, IP-derived region, page context, ad impression/click data, cookies or similar identifiers depending on the ad provider and consent setup. |

## Data Management Summary

The current public tool flow uses both browser-side processing and backend file processing.

Browser/local data may include:

- Selected files used in browser-only tools.
- Generated browser object URLs for downloads.
- Local UI state while a tool page is open.
- Spreadsheet sheet selections for browser-only CSV export.
- PDF page selections, signature placement, edit elements, and similar temporary UI state.

Backend data may include:

- Uploaded files saved through Multer.
- Generated output files saved in the downloads directory.
- PDF password submitted for a protect or unlock request.
- Compression quality setting.
- Standard server request logs.
- Error logs needed for debugging.
- Service configuration and binary paths in environment variables.

Third-party or infrastructure data may include:

- Hosting provider logs and runtime metadata.
- Static/frontend hosting request metadata.
- Future ad provider request, impression, click, and measurement data if planned ads are enabled.

## What Other Users Can See

Other users cannot see private file-processing details through the current inspected app, such as:

- Uploaded documents.
- Generated downloads.
- PDF passwords.
- Browser-only files.
- Contact/support details.

Other users may only see information that the user intentionally shares outside the app, such as:

- A downloaded converted document shared by the user.
- A protected PDF shared by the user.
- A signed or edited PDF shared by the user.
- Any file or link the user sends manually through another channel.

The current inspected app does not include public user profiles, public leaderboards, social feeds, or public document galleries.

## What Admins or Operators Can See

Authorized hosting or backend operators may be able to access operational data needed to run the app:

- Uploaded files present in server storage.
- Generated output files present in server storage.
- Backend request logs.
- Backend error logs.
- Environment-backed service configuration.

Admin or operator access should be limited to support, security, debugging, abuse prevention, service maintenance, and legal compliance. Operators should not open user documents unless required for a support, security, or legal reason.

## Permissions To Document

When the app requests or uses a new permission, service, SDK, backend storage area, or document processor, update the Privacy Policy.

Current permissions/services to mention:

- Internet/network access.
- Browser file picker and drag-and-drop file selection.
- Browser download/object URL creation.
- Backend API for server-backed tools.
- LibreOffice processing with common Office-compatible fonts.
- Python `pdf2docx` processing.
- Tesseract processing for scanned PDF to DOCX.
- qpdf processing.
- `pdf-lib`, `pdfjs-dist`, and `xlsx` browser-side processing.
- Hosting provider logs and runtime infrastructure.
- Planned ad provider services for future screen-level ads.

Permissions/services not currently used in the inspected public tool flow:

- Camera.
- Microphone.
- Geolocation.
- Contacts.
- Notifications.
- Clipboard as a core required workflow.
- Payment details.
- Push notifications.
- Active advertising SDKs.

## Permission Details

Use this table to keep the Privacy Policy accurate. Some entries are browser capabilities or platform services rather than visible permission prompts, but users still need to understand why the app uses them.

| Permission or service | Current status | Why FileBrother uses it | What happens if disabled |
| --- | --- | --- | --- |
| Internet/network access | Used. | Loads the website, connects to the backend API, and supports server-backed conversion tools. | Website or backend-backed features may fail. |
| Browser file picker / drag-and-drop | Used. | Lets users choose documents for conversion, compression, protection, unlock, merge, split, sign, edit, or CSV export. | Users cannot select files for tool workflows. |
| Browser downloads/object URLs | Used. | Creates downloadable output files in the browser after server-backed or browser-only processing. | Users may not be able to save converted files. |
| Backend API | Used. | Handles server-backed file processing. | Server-backed tools will not work. |
| LibreOffice and fallback fonts | Used for Office-to-PDF processing. | Converts supported Word, PowerPoint, and spreadsheet files to PDF on the backend with common Linux font substitutes for Office documents. | Affected Office conversion tools may fail or render with font/layout differences. |
| Python `pdf2docx` | Used for PDF-to-DOCX processing. | Converts text-based PDFs into editable DOCX files on the backend. | PDF to Word may fail. |
| Tesseract OCR | Used when PDF-to-DOCX receives a scanned PDF with little or no readable text. | Adds an OCR text layer before DOCX conversion. | Scanned PDFs may convert with poor or missing editable text. |
| qpdf | Used for PDF protection/unlock. | Encrypts and decrypts PDFs using the password supplied by the user. | Protect/unlock PDF tools may fail. |
| qpdf and `pdf-lib` compression | Used for lossless PDF compression. | Optimizes PDF structures and returns the smallest candidate without image downsampling. | Compression may provide limited reduction for image-heavy PDFs. |
| Browser PDF/spreadsheet libraries | Used. | Processes merge, split, sign, edit, and XLSX-to-CSV workflows locally in the browser. | Browser-only tools may not work. |
| Hosting provider logs | Used. | Supports uptime, debugging, request monitoring, and security review. | Operators may have less ability to diagnose failures. |
| Planned ads on public screens | Planned, not active in the inspected implementation. | FileBrother plans to show ads on public screens and tool pages. The final provider and consent setup should be documented before ads go live. | No current impact until ads are enabled. |
| Camera | Not used. | No current FileBrother workflow needs camera access. | No impact. |
| Microphone | Not used. | No current FileBrother workflow needs microphone access. | No impact. |
| Location/geolocation | Not used. | No current FileBrother workflow needs precise device location. | No impact. |
| Contacts | Not used. | No current FileBrother workflow needs device contacts. | No impact. |
| Notifications/push | Not used. | No current reminder or push notification workflow is implemented. | No impact. |
| Payments/billing | Not used. | No current purchase or subscription workflow is implemented. | No impact. |
| Active advertising SDKs | Not used. | No active ad SDK data flow is implemented in the inspected app. | No impact until ads are enabled. |

## Current Privacy Coverage

The Privacy Policy should describe the current FileBrother setup:

- Public document tools.
- Browser-only tools that do not upload files to the backend.
- Server-backed tools that upload files to the backend.
- Uploaded files saved to `uploads/`.
- Generated files saved to `downloads/`.
- PDF passwords sent for protect/unlock requests.
- Lossless compression level submitted for compression requests.
- Local `pdf2docx`, Tesseract, LibreOffice, qpdf, and `pdf-lib` processing.
- Hosting logs and operational records.
- Planned ads on each public screen or tool page, including the fact that ads are not active until implemented.
- Current absence of camera, microphone, location, contacts, notifications, payments, and active ads in the public tool flow.
- Need for operational cleanup before promising immediate deletion.

## Current Maintenance Checklist

Keep this documentation and the Privacy Policy aligned with the current app by reviewing:

- Public tools currently enabled.
- Browser-only tools currently enabled.
- Server-backed tools currently enabled.
- Backend storage currently used for uploaded and generated files.
- Uploaded file types currently accepted.
- Generated file types currently returned.
- Local document conversion processors currently installed.
- Hosting providers currently used.
- Analytics SDKs currently installed.
- Planned ad placements currently designed.
- Advertising SDKs currently installed or planned.
- Ad provider, consent, personalization, cookies, and measurement setup before ads go live.
- Payment or subscription features currently enabled.
- Public sharing features currently enabled.
- Admin-visible fields currently available.
- Browser or platform permissions currently requested.
- Contact/support data flows currently active.
- Data deletion flows currently implemented.
- Retention periods currently enforced.
- Cleanup jobs currently active for uploaded or generated files.

## Current Policy Requirements

The current FileBrother policy should clearly state:

| Area | Current setup |
| --- | --- |
| Public tool model | Users can use the current public document tools directly from the website. |
| Data collection | Server-backed tools receive uploaded files and processing settings. Browser-only tools process selected files locally in the browser. |
| File processing | Some tools upload files to the backend, while merge, split, sign, edit, and XLSX-to-CSV process files locally in the browser. |
| File deletion | Current backend processing writes uploads and downloads to server folders, so automated or operational cleanup is required before promising immediate deletion. |
| Third parties | Backend/frontend hosting and infrastructure services may process relevant operational data. Current conversion tools are designed to run locally on the backend instead of sending uploaded documents to a cloud conversion API. |
| Passwords | PDF protect/unlock passwords are submitted to the backend only for the processing request and should not be stored in logs or persistent records. |
| Browser storage | Browser storage may hold temporary local tool state and generated object URLs while tools are in use. |
| Other user visibility | Other users cannot see documents through the current inspected app unless the user shares downloaded files outside the app. |
| Admin/operator access | Authorized operators may access logs, uploads, and downloads for support, security, operations, or legal compliance. |
| Permissions | The app uses internet, file picker, downloads, backend API, LibreOffice, Python `pdf2docx`, Tesseract, qpdf, `pdf-lib`, and browser processing libraries. |
| Ads and payments | Current inspected app does not include active ads, billing, subscriptions, or payment card collection. Ads are planned for public screens and tool pages, so the ad provider and consent details should be added before launch. |

## Recommended Public Privacy Policy Sections

Use these public sections for the website privacy page:

1. Introduction.
2. Information We Collect.
3. Information We Do Not Collect.
4. Browser-Only Processing.
5. Server-Backed File Processing.
6. PDF Passwords and Processing Settings.
7. How We Use Information.
8. Third-Party Services.
9. Planned Advertising.
10. Cookies, Consent, and Similar Technologies.
11. Data Retention and Deletion.
12. Security.
13. What Other Users Can See.
14. Admin and Operator Access.
15. User Rights and Choices.
16. Children's Privacy.
17. International Transfers.
18. Changes to This Policy.
19. Contact.

## Recommended Terms and Conditions Sections

Use these public sections for the website terms page:

1. Acceptance of Terms.
2. Description of Services.
3. User Responsibility for Files.
4. Lawful and Authorized Use.
5. File Processing and Conversion Limits.
6. Password-Protected PDFs.
7. Third-Party Services.
8. Advertising.
9. Intellectual Property.
10. No Professional or Legal Advice.
11. No Guarantee of Perfect Conversion.
12. Service Availability.
13. Termination or Restriction of Access.
14. Disclaimer of Warranties.
15. Limitation of Liability.
16. Changes to Terms.
17. Governing Law.
18. Contact.

## How To Make Legal Changes

Use this workflow whenever the app changes:

1. Identify the feature change.

   Example: new conversion provider, new file type, new browser storage value, new analytics SDK, new ad SDK, new ad placement, new payment feature, or new public sharing feature.

2. Decide whether the change affects privacy, terms, or both.

   Privacy Policy covers what data is collected, uploaded, stored, processed, shared, shown, retained, and deleted.

   Terms & Conditions covers how users may use the feature, user responsibility, prohibited content, service limits, conversion accuracy, third-party services, and liability.

3. Update this legal documentation file first.

4. Update the public Privacy Policy page in the app.

5. Update the public Terms and Conditions page if the change affects user responsibilities, service limits, third-party services, or liability.

6. Review the app UI for statements that may conflict with the policy.

7. Confirm there are no outdated statements such as:

```text
All files are processed locally only.
FileBrother never uploads files.
Uploaded files are deleted immediately.
FileBrother does not use third-party processors.
Closing the browser deletes all server-side uploaded files.
```

8. Confirm the code supports any deletion, retention, security, or privacy claims before publishing them.

9. Ask legal counsel to review public-facing legal documents before production release.

## Implementation Notes for Developers

Relevant code locations:

- Frontend privacy page: `Client/src/Pages/Privacy_policypage.tsx`.
- Frontend terms page: `Client/src/Pages/Termsconditionpage.tsx`.
- Shared legal page component: `Client/src/Components/LegalInfoPage.tsx`.
- Frontend API base URL: `Client/src/Utils/axios.ts`.
- Frontend routes: `Client/src/App.tsx`.
- Browser-only tool components: `Client/src/Components/tools/`.
- Backend conversion routes: `Server/src/framework/webserver/routes/user/user.js`.
- Backend controller: `Server/src/adapters/controllers/user/userController.js`.
- Conversion use cases: `Server/src/application/useCase/user/`.
- Environment config: `Server/src/config/config.js`.

## Important Legal Disclaimer

This document is a product and legal-readiness summary based on the current FileBrother public tool flow. It is not legal advice and does not replace review by a qualified lawyer. Review the public Privacy Policy and Terms and Conditions with legal counsel before launching or relying on them for compliance.

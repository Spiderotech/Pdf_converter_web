import {
  FiEyeOff,
  FiFile,
  FiGlobe,
  FiMail,
  FiShield,
  FiTrash2,
  FiUser,
  FiUsers,
  FiVolume2,
} from 'react-icons/fi';
import LegalInfoPage, { LegalSection } from '../Components/LegalInfoPage';

const sections: LegalSection[] = [
  { title: 'Information We Collect', text: 'FileBrother collects account details when you register or sign in, including name, email address, Google account status where used, and a password hash for password-based accounts. When you use server-backed tools, we receive the uploaded file and any processing options you provide, such as a PDF password or compression quality.', icon: FiUser },
  { title: "Information We Don't Collect", text: 'We do not intentionally request camera, microphone, location, contacts, payment card, health, or biometric information. Public tools can be used without creating an account unless a specific account feature is required.', icon: FiEyeOff },
  { title: 'How Server Tools Use Files', text: 'PDF to Word, Word to PDF, PowerPoint to PDF, Excel to PDF, PDF compression, PDF protection, and PDF unlock upload files to our backend so the requested operation can be completed and returned as a download.', icon: FiFile },
  { title: 'Browser-Only Processing', text: 'Merge PDF, Split PDF, Sign PDF, Edit PDF, and XLSX to CSV are designed to run in your browser. For those tools, the selected files are processed locally and are not uploaded to our conversion API.', icon: FiShield },
  { title: 'Passwords and Security Settings', text: 'When you protect or unlock a PDF, the password you enter is sent to the backend only for that processing request. We do not design the service to store PDF passwords in your account record.', icon: FiShield },
  { title: 'Account Data and Login', text: 'Account passwords are hashed before storage. Login sessions use access tokens returned by the backend, and the frontend may keep authentication state in browser storage so you can stay signed in.', icon: FiUser },
  { title: 'Data Security', text: 'We use reasonable technical safeguards, environment-based secrets, password hashing, limited token lifetimes, and controlled document-processing tools. No web service can guarantee perfect security, so avoid uploading files you are not authorized to process.', icon: FiShield },
  { title: 'Data Retention and Deletion', text: 'Uploaded and generated files are used to complete the requested task. Current server processing writes temporary uploads and generated downloads to backend storage, so operational cleanup is required to remove them after processing or after a limited retention period.', icon: FiTrash2 },
  { title: 'Third-Party Services', text: 'We may use hosting providers, MongoDB services, Google OAuth, and similar infrastructure providers to operate the app. Current server-backed conversion tools are designed to run on our backend using local processing tools instead of sending uploaded documents to a cloud conversion API. We do not sell uploaded documents.', icon: FiGlobe },
  { title: 'Your Rights', text: 'Depending on your location, you may ask to access, correct, export, or delete personal information associated with your account or support request. We may need to verify your identity before completing a request.', icon: FiUser },
  { title: "Children's Privacy", text: 'FileBrother is not intended to knowingly collect personal information from children. Minors should use the tools only with appropriate parent, guardian, school, or organizational supervision.', icon: FiUsers },
  { title: 'Changes to This Policy', text: 'We may update this policy when tools, vendors, retention practices, or legal requirements change. The effective date and last updated date on this page should be revised when changes are published.', icon: FiVolume2 },
  { title: 'Contact Us', text: 'For privacy questions, data requests, or security concerns, contact our support team through the Contact Us page.', icon: FiMail },
];

const Privacy_policypage = () => (
  <LegalInfoPage
    type="privacy"
    eyebrow="Your Privacy, Our Priority"
    title="Privacy Policy"
    description="This policy explains how FileBrother handles account information, uploaded files, browser-only tools, server-backed processing, and third-party services."
    sections={sections}
  />
);

export default Privacy_policypage;

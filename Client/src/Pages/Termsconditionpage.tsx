import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCopy,
  FiFileText,
  FiLayers,
  FiLock,
  FiMail,
  FiPower,
  FiRefreshCw,
  FiUser,
} from 'react-icons/fi';
import { FiBookOpen } from 'react-icons/fi';
import LegalInfoPage, { LegalSection } from '../Components/LegalInfoPage';

const sections: LegalSection[] = [
  { title: 'Acceptance of Terms', text: 'By accessing or using FileBrother and its tools, you agree to these Terms and Conditions. If you do not agree, do not use the service.', icon: FiFileText },
  { title: 'Description of Services', text: 'We provide online tools for converting, editing, compressing, signing, protecting, and otherwise processing supported document formats.', icon: FiLayers },
  { title: 'User Accounts', text: 'Some features may require an account. You are responsible for maintaining accurate account information and protecting your credentials.', icon: FiUser },
  { title: 'Acceptable Use', text: 'Use the service only for lawful files that you own or are authorized to process. Do not upload harmful, illegal, or infringing content.', icon: FiCheckCircle },
  { title: 'File Handling & Privacy', text: 'Files are processed for the requested task. Review our Privacy Policy for details about temporary processing and data handling.', icon: FiLock },
  { title: 'Intellectual Property', text: 'The FileBrother brand, interface, and original site content belong to us or our licensors. Your uploaded files remain yours.', icon: FiCopy },
  { title: 'Limitation of Liability', text: 'Document processing results can vary. Review downloaded files before relying on them. To the extent permitted by law, the service is provided without guarantees of uninterrupted or error-free operation.', icon: FiAlertTriangle },
  { title: 'Termination', text: 'We may restrict access when these terms are violated, the service is abused, or continued access creates security or legal risk.', icon: FiPower },
  { title: 'Changes to Terms', text: 'We may revise these terms as the service changes. Continued use after an update means you accept the revised terms.', icon: FiRefreshCw },
  { title: 'Governing Law', text: 'These terms are interpreted under applicable law. Mandatory consumer protections in your location remain unaffected.', icon: FiBookOpen },
  { title: 'Contact Us', text: 'Questions about these terms can be sent through the Contact Us page.', icon: FiMail },
];

const Termsconditionpage = () => (
  <LegalInfoPage
    type="terms"
    eyebrow="Legal Information"
    title="Terms and Conditions"
    description="Please read these terms carefully before using FileBrother tools and services."
    sections={sections}
  />
);

export default Termsconditionpage;

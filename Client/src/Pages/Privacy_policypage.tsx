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
  { title: "Information We Don't Collect", text: 'Our public document tools can be used without creating an account. We do not intentionally collect personal information merely because you process a file.', icon: FiEyeOff },
  { title: 'How We Use Your Files', text: 'Uploaded files are used only to perform the document task you request, such as conversion, compression, protection, or editing.', icon: FiFile },
  { title: 'Data Security', text: 'We use secure connections and reasonable technical safeguards while files are uploaded, processed, and returned.', icon: FiShield },
  { title: 'Data Deletion', text: 'Temporary processing files are intended to be deleted after the requested operation is completed.', icon: FiTrash2 },
  { title: 'Third-Party Services', text: 'Hosting and infrastructure providers may process limited technical data required to operate the service. We do not sell uploaded documents.', icon: FiGlobe },
  { title: 'Your Rights', text: 'You may contact us to ask about personal information associated with an account or support request and request correction or deletion where applicable.', icon: FiUser },
  { title: "Children's Privacy", text: 'The service is not designed to collect information from children. Minors should use the tools only with appropriate supervision.', icon: FiUsers },
  { title: 'Changes to This Policy', text: 'We may update this policy as our tools or legal obligations change. The revision date on this page will be updated.', icon: FiVolume2 },
  { title: 'Contact Us', text: 'For privacy questions, contact our support team through the Contact Us page.', icon: FiMail },
];

const Privacy_policypage = () => (
  <LegalInfoPage
    type="privacy"
    eyebrow="Your Privacy, Our Priority"
    title="Privacy Policy"
    description="This policy explains how FileBrother handles information and files when you use our document tools."
    sections={sections}
  />
);

export default Privacy_policypage;

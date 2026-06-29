import { FiAlertCircle, FiRefreshCw, FiUploadCloud } from 'react-icons/fi';
import { Link } from 'react-router-dom';

type AlternativeTool = {
  label: string;
  href: string;
};

type ConversionFailureRecoveryProps = {
  message: string;
  onRetry?: () => void;
  onChooseAnother?: () => void;
  alternatives?: AlternativeTool[];
};

const getLikelyReason = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('password')) return 'The file may be password protected or the password may be incorrect.';
  if (lowerMessage.includes('25 mb') || lowerMessage.includes('smaller')) return 'The uploaded file is larger than the current upload limit.';
  if (lowerMessage.includes('valid') || lowerMessage.includes('choose a')) return 'The selected file format is not supported for this tool.';
  if (lowerMessage.includes('damaged') || lowerMessage.includes('opened')) return 'The file may be damaged, encrypted, or not readable by the browser.';
  if (lowerMessage.includes('backend') || lowerMessage.includes('setup')) return 'The conversion engine may be temporarily unavailable.';

  return 'The file may be damaged, encrypted, too complex, or temporarily unsupported.';
};

const defaultAlternatives: AlternativeTool[] = [
  { label: 'Try PDF to Word', href: '/tools/pdf-to-word' },
  { label: 'Compress PDF first', href: '/tools/compress-pdf' },
  { label: 'Browse all tools', href: '/tools' },
];

const ConversionFailureRecovery = ({
  message,
  onRetry,
  onChooseAnother,
  alternatives = defaultAlternatives,
}: ConversionFailureRecoveryProps) => (
  <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
    <div className="flex items-start gap-3">
      <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-extrabold">Conversion failed</p>
        <p className="mt-1 font-semibold">{message}</p>
        <p className="mt-2 text-red-700">
          <span className="font-bold">Possible reason:</span> {getLikelyReason(message)}
        </p>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-black text-white transition hover:bg-red-700"
        >
          <FiRefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
      {onChooseAnother && (
        <button
          type="button"
          onClick={onChooseAnother}
          className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
        >
          <FiUploadCloud className="h-4 w-4" />
          Choose another file
        </button>
      )}
      {alternatives.map((tool) => (
        <Link
          key={tool.href}
          to={tool.href}
          className="rounded-md border border-red-200 bg-white px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
        >
          {tool.label}
        </Link>
      ))}
    </div>
  </div>
);

export default ConversionFailureRecovery;

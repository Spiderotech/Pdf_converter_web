import { FiFileText, FiRefreshCw } from 'react-icons/fi';

type ConversionLoadingOverlayProps = {
  isVisible: boolean;
  title: string;
  message?: string;
};

const ConversionLoadingOverlay = ({
  isVisible,
  title,
  message = 'Please keep this page open while your file is being processed.',
}: ConversionLoadingOverlayProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversion-loading-title"
      aria-describedby="conversion-loading-message"
    >
      <div className="w-full max-w-md rounded-lg border border-amber-100 bg-[#fffdf8] p-7 text-center shadow-2xl sm:p-9">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <FiRefreshCw className="absolute h-20 w-20 animate-spin text-amber-500" aria-hidden="true" />
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <FiFileText className="h-6 w-6 text-slate-700" aria-hidden="true" />
          </span>
        </div>

        <h2 id="conversion-loading-title" className="mt-6 text-2xl font-black text-slate-950">
          {title}
        </h2>
        <p id="conversion-loading-message" className="mt-3 text-sm font-medium leading-6 text-slate-600">
          {message}
        </p>

        <div className="mt-7 h-2 overflow-hidden rounded-full bg-amber-100" aria-hidden="true">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-amber-500" />
        </div>
        <p className="mt-3 text-xs font-bold uppercase text-amber-700" aria-live="polite">
          Processing file
        </p>
      </div>
    </div>
  );
};

export default ConversionLoadingOverlay;

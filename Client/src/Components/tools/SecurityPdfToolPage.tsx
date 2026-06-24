import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiLock,
  FiRefreshCw,
  FiTrash2,
  FiUnlock,
  FiUpload,
} from 'react-icons/fi';
import axios from '../../Utils/axios';
import securityPdfDownloadIcon from '../../assets/converter-icons/security-pdf-download.webp';
import securityPdfEncryptIcon from '../../assets/converter-icons/security-pdf-encrypt.webp';
import securityPdfPasswordIcon from '../../assets/converter-icons/security-pdf-password.webp';
import securityPdfPrivateLockIcon from '../../assets/converter-icons/security-pdf-private-lock.webp';
import securityPdfProtectHeroIcon from '../../assets/converter-icons/security-pdf-protect-hero.webp';
import securityPdfSecureProcessIcon from '../../assets/converter-icons/security-pdf-secure-process.webp';
import securityPdfUnlockHeroIcon from '../../assets/converter-icons/security-pdf-unlock-hero.webp';
import securityPdfUnlockIcon from '../../assets/converter-icons/security-pdf-unlock.webp';
import securityPdfUploadIcon from '../../assets/converter-icons/security-pdf-upload.webp';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';

type SecurityMode = 'protect' | 'unlock';

type SecurityPdfToolPageProps = {
  mode: SecurityMode;
};

const themes = {
  unlock: {
    accent: 'text-emerald-600',
    eyebrow: 'bg-emerald-100 text-emerald-700',
    iconBox: 'bg-emerald-100 text-emerald-600',
    border: 'border-emerald-400',
    activeDrop: 'border-emerald-600 bg-emerald-50',
    button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
    softPanel: 'border-emerald-100 bg-emerald-50/70',
    focus: 'focus:border-emerald-500 focus:ring-emerald-100',
    background: 'bg-[#fbf7ef]',
    glow: 'bg-[radial-gradient(circle_at_18%_12%,rgba(254,243,199,0.5),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(231,229,228,0.55),transparent_25%)]',
  },
  protect: {
    accent: 'text-rose-600',
    eyebrow: 'bg-rose-100 text-rose-700',
    iconBox: 'bg-rose-100 text-rose-600',
    border: 'border-rose-400',
    activeDrop: 'border-rose-600 bg-rose-50',
    button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200',
    softPanel: 'border-rose-100 bg-rose-50/70',
    focus: 'focus:border-rose-500 focus:ring-rose-100',
    background: 'bg-[#fbf7ef]',
    glow: 'bg-[radial-gradient(circle_at_18%_12%,rgba(254,243,199,0.5),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(231,229,228,0.55),transparent_25%)]',
  },
} as const;

const SecurityPdfToolPage = ({ mode }: SecurityPdfToolPageProps) => {
  const isProtect = mode === 'protect';
  const theme = themes[mode];
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const selectFile = (selectedFile: File) => {
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Choose a valid PDF file.');
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('Choose a PDF file that is 25 MB or smaller.');
      return;
    }

    setFile(selectedFile);
    setDownloadUrl('');
    setError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      selectFile(selectedFile);
    }
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      selectFile(selectedFile);
    }
  };

  const processPdf = async () => {
    if (!file) {
      setError('Choose a PDF file first.');
      return;
    }
    if (!password.trim()) {
      setError(isProtect ? 'Enter a new password for your PDF.' : 'Enter the current PDF password.');
      return;
    }
    if (isProtect && password.length < 6) {
      setError('Use at least 6 characters for the new password.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    setIsProcessing(true);
    setDownloadUrl('');
    setError('');

    try {
      const response = await axios.post(isProtect ? '/protectpdf' : '/unlockpdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      setDownloadUrl(URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })));
    } catch (processError) {
      console.error(processError);
      setError(
        isProtect
          ? 'This PDF could not be protected. Check the file or server security setup.'
          : 'This PDF could not be unlocked. Check that the password is correct.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const title = isProtect ? 'Protect PDF' : 'Unlock PDF';
  const passwordStrength = Math.min(
    4,
    Number(password.length >= 6)
      + Number(/[A-Z]/.test(password))
      + Number(/[0-9]/.test(password))
      + Number(/[^A-Za-z0-9]/.test(password)),
  );
  const heroIcon = isProtect ? securityPdfProtectHeroIcon : securityPdfUnlockHeroIcon;
  const actionIcon = isProtect ? securityPdfEncryptIcon : securityPdfUnlockIcon;
  const featureItems = [
    { icon: isProtect ? securityPdfEncryptIcon : securityPdfSecureProcessIcon, text: isProtect ? 'Secure & Private' : 'Secure Process' },
    { icon: securityPdfPrivateLockIcon, text: isProtect ? 'Your Password Stays Private' : 'Your Privacy Matters' },
    { icon: securityPdfDownloadIcon, text: 'Fast & Easy' },
  ];
  const securityStats = [
    { icon: securityPdfSecureProcessIcon, label: 'No storage' },
    { icon: isProtect ? securityPdfEncryptIcon : securityPdfUnlockIcon, label: '256-bit security' },
    { icon: securityPdfPrivateLockIcon, label: 'Temporary files' },
  ];
  const howItWorksSteps = isProtect
    ? [
        {
          title: 'Upload PDF',
          text: 'Choose the PDF file you want to lock with a password.',
          icon: securityPdfUploadIcon,
          color: 'bg-rose-50',
          badge: 'bg-rose-600',
        },
        {
          title: 'Set password',
          text: 'Enter a strong password that will be required to open the file.',
          icon: securityPdfPasswordIcon,
          color: 'bg-blue-50',
          badge: 'bg-blue-600',
        },
        {
          title: 'Protect file',
          text: 'We apply password protection and prepare a secured PDF copy.',
          icon: securityPdfEncryptIcon,
          color: 'bg-violet-50',
          badge: 'bg-violet-600',
        },
        {
          title: 'Download PDF',
          text: 'Save the protected PDF and share it only with trusted people.',
          icon: securityPdfDownloadIcon,
          color: 'bg-emerald-50',
          badge: 'bg-emerald-600',
        },
      ]
    : [
        {
          title: 'Upload locked PDF',
          text: 'Choose the password-protected PDF you need to unlock.',
          icon: securityPdfUploadIcon,
          color: 'bg-emerald-50',
          badge: 'bg-emerald-600',
        },
        {
          title: 'Enter password',
          text: 'Provide the current password so the document can be opened.',
          icon: securityPdfPasswordIcon,
          color: 'bg-blue-50',
          badge: 'bg-blue-600',
        },
        {
          title: 'Remove lock',
          text: 'We unlock the document and create a clean PDF copy.',
          icon: securityPdfUnlockIcon,
          color: 'bg-rose-50',
          badge: 'bg-rose-600',
        },
        {
          title: 'Download PDF',
          text: 'Download the unlocked PDF for easier reading and editing.',
          icon: securityPdfDownloadIcon,
          color: 'bg-emerald-50',
          badge: 'bg-emerald-600',
        },
      ];

  return (
    <>
      <Header />
      <ConversionLoadingOverlay
        isVisible={isProcessing}
        title={isProtect ? 'Protecting your PDF' : 'Unlocking your PDF'}
      />
      <main className={`relative overflow-hidden ${theme.background} py-10 sm:py-16`}>
        <div className={`pointer-events-none absolute inset-0 ${theme.glow}`} />
        <section className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold uppercase ${theme.eyebrow}`}>
                <img src={heroIcon} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
                PDF {isProtect ? 'Protection' : 'Unlock'}
              </p>
              <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 sm:mt-7 sm:text-6xl">
                {isProtect ? 'Protect' : 'Unlock'} <span className={theme.accent}>PDF</span>
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
                {isProtect
                  ? 'Add password protection to PDF files before sharing or archiving.'
                  : 'Remove password protection from PDFs when the correct password is provided.'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {featureItems.map(({ icon, text }) => (
                  <span key={text} className="inline-flex items-center gap-3 text-sm font-bold text-slate-700">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-lg ${theme.iconBox}`}>
                      <img src={icon} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
                    </span>
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-56 items-center justify-center sm:min-h-72">
              <div className={`absolute h-52 w-52 rounded-full opacity-80 sm:h-64 sm:w-64 ${isProtect ? 'bg-rose-100' : 'bg-emerald-100'}`} />
              <img
                src={heroIcon}
                alt=""
                aria-hidden="true"
                className="relative h-52 w-52 object-contain drop-shadow-[0_25px_30px_rgba(15,23,42,0.15)] sm:h-72 sm:w-72"
              />
            </div>
          </div>

          <section className="mt-10 grid gap-8 xl:grid-cols-[0.65fr_1.8fr] xl:items-center">
            <div>
              <p className={`text-sm font-extrabold uppercase ${theme.accent}`}>How it works</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                {isProtect ? 'Protect in 4 easy steps' : 'Unlock in 4 easy steps'}
              </h2>
              <p className="mt-4 max-w-md text-base font-medium leading-7 text-slate-600">
                {isProtect
                  ? 'Add password security to your PDF with a clear upload, password, protect, and download flow.'
                  : 'Remove PDF password protection when you know the current password, then download a clean copy.'}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {howItWorksSteps.map((step, index) => {
                return (
                  <div key={step.title} className="relative">
                    <article className="flex min-h-40 flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:min-h-44 sm:p-5">
                      <span className={`flex h-14 w-14 items-center justify-center rounded-lg sm:h-16 sm:w-16 ${step.color}`}>
                        <img src={step.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-14 sm:w-14" />
                      </span>
                      <span className={`mt-4 flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white ${step.badge}`}>
                        {index + 1}
                      </span>
                      <h3 className="mt-3 text-base font-extrabold text-slate-950">{step.title}</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{step.text}</p>
                    </article>
                    {index < howItWorksSteps.length - 1 && (
                      <span className={`absolute -right-7 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg lg:flex ${
                        isProtect ? 'bg-rose-600 shadow-rose-200' : 'bg-emerald-600 shadow-emerald-200'
                      }`}>
                        <FiArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-7">
            <div
              className={`flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition sm:min-h-[340px] sm:px-6 sm:py-10 ${
                isDragging ? theme.activeDrop : theme.border
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
              <span className={`flex h-20 w-20 items-center justify-center rounded-lg sm:h-24 sm:w-24 ${theme.iconBox}`}>
                <img src={securityPdfUploadIcon} alt="" aria-hidden="true" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
              </span>
              <h2 className="mt-5 max-w-full break-words text-xl font-extrabold text-slate-950 sm:text-2xl">
                {file ? file.name : isProtect ? 'Upload your PDF' : 'Drop your PDF here'}
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-500">
                {isProtect ? 'Drag and drop your file here or' : 'Choose the password-protected document to unlock.'}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className={`mt-5 inline-flex h-12 w-full max-w-xs items-center justify-center gap-3 rounded-lg px-6 text-sm font-extrabold text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-300 sm:h-14 sm:px-9 sm:text-base ${theme.button}`}
              >
                <FiUpload className="h-5 w-5" />
                {file ? 'Change file' : 'Choose file'}
              </button>
              <p className="mt-5 text-sm font-medium text-slate-500">Recommended maximum size: 25 MB.</p>
            </div>
          </section>

          {file && (
            <div className="mt-6 flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:items-center sm:p-5">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${theme.iconBox}`}>
                <img src={securityPdfUploadIcon} alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-sm text-slate-950">{file.name}</strong>
                <span className="text-xs font-medium text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setDownloadUrl('');
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove selected PDF"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          )}

          <section className="mt-7 grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.2fr)] md:items-center">
            <div className="flex items-start gap-4">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg sm:h-16 sm:w-16 ${theme.iconBox}`}>
                <img src={securityPdfPasswordIcon} alt="" aria-hidden="true" className="h-14 w-14 object-contain" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-slate-950">
                  {isProtect ? 'New PDF password' : 'Enter current PDF password'}
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                  {isProtect
                    ? 'Choose a strong password to protect your PDF file.'
                    : 'Enter the password to unlock and remove protection.'}
                </p>
              </div>
            </div>

            <div>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setDownloadUrl('');
                    setError('');
                  }}
                  placeholder={isProtect ? 'Enter new password' : 'Enter current password'}
                  className={`h-14 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-12 text-sm font-medium text-slate-900 outline-none ring-4 ring-transparent ${theme.focus}`}
                  autoComplete={isProtect ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-slate-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>

              {isProtect ? (
                <div className="mt-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <span
                        key={bar}
                        className={`h-1.5 flex-1 rounded-full ${
                          bar <= passwordStrength ? 'bg-rose-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Use 6+ characters with uppercase letters, numbers, and symbols.
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs font-medium text-slate-500">The password is used only for this unlocking request.</p>
              )}
            </div>
          </section>

          <section className={`mt-7 rounded-lg border p-6 ${theme.softPanel}`}>
            <div className="grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white sm:h-16 sm:w-16">
                  <img src={actionIcon} alt="" aria-hidden="true" className="h-14 w-14 object-contain" />
                </span>
                <div>
                  <h2 className={`text-base font-extrabold ${theme.accent}`}>
                    {isProtect ? 'Your security is our priority' : 'Secure and private processing'}
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    Your file and password are used only for processing and are never included in the downloaded PDF.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {securityStats.map(({ icon, label }) => (
                  <span key={label} className="flex flex-col items-center gap-2 text-xs font-bold text-slate-600">
                    <img src={icon} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={processPdf}
            disabled={!file || !password.trim() || isProcessing}
            className={`mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg px-6 text-base font-extrabold text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:h-16 sm:px-8 sm:text-lg ${theme.button}`}
          >
            {isProcessing ? <FiRefreshCw className="h-6 w-6 animate-spin" /> : isProtect ? <FiLock className="h-6 w-6" /> : <FiUnlock className="h-6 w-6" />}
            {isProcessing ? 'Processing...' : title}
            {!isProcessing && <FiArrowRight className="h-6 w-6" />}
          </button>

          {downloadUrl && (
            <div className="mt-5 flex flex-col gap-4 rounded-lg border border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-start gap-3 text-sm font-bold text-green-700">
                <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                Your {isProtect ? 'protected' : 'unlocked'} PDF is ready.
              </span>
              <a
                href={downloadUrl}
                download={isProtect ? 'protected.pdf' : 'unlocked.pdf'}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 text-sm font-extrabold text-white hover:bg-green-700"
              >
                <FiDownload className="h-5 w-5" />
                Download PDF
              </a>
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-500">
            <img src={securityPdfPrivateLockIcon} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
            Your file and password are never shared with anyone.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SecurityPdfToolPage;

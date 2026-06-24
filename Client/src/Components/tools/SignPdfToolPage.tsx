import { ChangeEvent, DragEvent, MouseEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEdit3,
  FiPenTool,
  FiRefreshCw,
  FiTrash2,
  FiUpload,
} from 'react-icons/fi';
import signPdfHeroIcon from '../../assets/converter-icons/sign-pdf-hero.webp';
import signPdfDownloadIcon from '../../assets/converter-icons/sign-pdf-download.webp';
import signPdfDrawSignatureIcon from '../../assets/converter-icons/sign-pdf-draw-signature.webp';
import signPdfPlaceSignatureIcon from '../../assets/converter-icons/sign-pdf-place-signature.webp';
import signPdfPrivateLockIcon from '../../assets/converter-icons/sign-pdf-private-lock.webp';
import signPdfReviewSignIcon from '../../assets/converter-icons/sign-pdf-review-sign.webp';
import signPdfUploadPdfIcon from '../../assets/converter-icons/sign-pdf-upload-pdf.webp';
import signPdfUploadSignatureIcon from '../../assets/converter-icons/sign-pdf-upload-signature.webp';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';

type SignatureMode = 'upload' | 'draw';
type MarginOption = 'small' | 'medium' | 'large';

type SignaturePlacement = {
  xPercent: number;
  yPercent: number;
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const signFeatures = [
  {
    title: 'Upload or draw',
    description: 'Use a PNG/JPG signature image or draw directly in the browser.',
    icon: signPdfDrawSignatureIcon,
    color: 'bg-red-50',
  },
  {
    title: 'Place on preview',
    description: 'Choose the exact page and click where the signature should appear.',
    icon: signPdfPlaceSignatureIcon,
    color: 'bg-blue-50',
  },
  {
    title: 'Private signing',
    description: 'Your PDF is processed in this browser and is not uploaded.',
    icon: signPdfPrivateLockIcon,
    color: 'bg-violet-50',
  },
];

const howItWorksSteps = [
  {
    title: 'Upload PDF',
    text: 'Choose the document you want to sign.',
    icon: signPdfUploadPdfIcon,
    color: 'bg-red-50',
    badge: 'bg-red-500',
  },
  {
    title: 'Add signature',
    text: 'Upload an image signature or draw one by hand.',
    icon: signPdfUploadSignatureIcon,
    color: 'bg-blue-50',
    badge: 'bg-blue-600',
  },
  {
    title: 'Place & adjust',
    text: 'Preview the page, set the size, and click the signature position.',
    icon: signPdfPlaceSignatureIcon,
    color: 'bg-violet-50',
    badge: 'bg-violet-600',
  },
  {
    title: 'Download PDF',
    text: 'Sign the file and download the finished PDF.',
    icon: signPdfDownloadIcon,
    color: 'bg-emerald-50',
    badge: 'bg-emerald-600',
  },
];

const SignPdfToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('upload');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signatureUrl, setSignatureUrl] = useState('');
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureSize, setSignatureSize] = useState(120);
  const [margin, setMargin] = useState<MarginOption>('medium');
  const [placement, setPlacement] = useState<SignaturePlacement>({ xPercent: 0.8, yPercent: 0.84 });
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const signatureInputRef = useRef<HTMLInputElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }

    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;

    const renderPreview = async () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) {
        return;
      }

      setIsPreviewLoading(true);
      setError('');

      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjs.getDocument({ data }).promise;
        const page = await pdf.getPage(selectedPage);
        const viewport = page.getViewport({ scale: 1.3 });
        const context = canvas.getContext('2d');

        if (!context || cancelled) {
          return;
        }

        setPageCount(pdf.numPages);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        renderTask = page.render({ canvas, canvasContext: context, viewport });
        await renderTask.promise;
      } catch (previewError) {
        if (!cancelled) {
          console.error(previewError);
          setError(`Could not render page ${selectedPage} of this PDF.`);
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      }
    };

    renderPreview();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [file, selectedPage]);

  useEffect(() => {
    return () => {
      if (signatureUrl.startsWith('blob:')) {
        URL.revokeObjectURL(signatureUrl);
      }
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl, signatureUrl]);

  const choosePdf = (selectedFile: File) => {
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Choose a valid PDF file.');
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('Choose a PDF file that is 25 MB or smaller.');
      return;
    }

    setFile(selectedFile);
    setSelectedPage(1);
    setPageCount(1);
    setPlacement({ xPercent: 0.8, yPercent: 0.84 });
    setDownloadUrl('');
    setError('');
  };

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      choosePdf(selectedFile);
    }
    event.target.value = '';
  };

  const handlePdfDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(false);
    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      choosePdf(selectedFile);
    }
  };

  const handleSignatureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    const isImage = selectedFile.type === 'image/png'
      || selectedFile.type === 'image/jpeg'
      || /\.(png|jpe?g)$/i.test(selectedFile.name);
    if (!isImage) {
      setError('Choose a PNG or JPG signature image.');
      return;
    }

    setSignatureFile(selectedFile);
    setSignatureUrl(URL.createObjectURL(selectedFile));
    setDownloadUrl('');
    setError('');
    event.target.value = '';
  };

  const getDrawPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }

    const point = getDrawPoint(event);
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#0f172a';
    setIsDrawing(true);
    setHasDrawing(true);
    setDownloadUrl('');
  };

  const drawSignature = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const context = drawCanvasRef.current?.getContext('2d');
    if (!context) {
      return;
    }
    const point = getDrawPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const finishDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    if (canvas && hasDrawing) {
      setSignatureUrl(canvas.toDataURL('image/png'));
    }
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    if (signatureMode === 'draw') {
      setSignatureUrl('');
    }
    setDownloadUrl('');
  };

  const setMode = (mode: SignatureMode) => {
    setSignatureMode(mode);
    if (mode === 'upload') {
      const canvas = drawCanvasRef.current;
      canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawing(false);
      setSignatureUrl(signatureFile ? URL.createObjectURL(signatureFile) : '');
    } else {
      setSignatureUrl(hasDrawing && drawCanvasRef.current ? drawCanvasRef.current.toDataURL('image/png') : '');
    }
    setDownloadUrl('');
  };

  const placeSignature = (event: MouseEvent<HTMLDivElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const xPercent = (event.clientX - rect.left) / rect.width;
    const yPercent = (event.clientY - rect.top) / rect.height;
    if (xPercent >= 0 && xPercent <= 1 && yPercent >= 0 && yPercent <= 1) {
      setPlacement({ xPercent, yPercent });
      setDownloadUrl('');
    }
  };

  const selectPage = (page: number) => {
    setSelectedPage(Math.min(Math.max(page, 1), pageCount));
    setPlacement({ xPercent: 0.8, yPercent: 0.84 });
    setDownloadUrl('');
  };

  const getSignatureBytes = async () => {
    if (signatureMode === 'upload') {
      if (!signatureFile) {
        throw new Error('Upload a PNG or JPG signature image first.');
      }
      return signatureFile.arrayBuffer();
    }

    const canvas = drawCanvasRef.current;
    if (!canvas || !hasDrawing) {
      throw new Error('Draw your signature first.');
    }
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) {
      throw new Error('Could not prepare the drawn signature.');
    }
    return blob.arrayBuffer();
  };

  const signPdf = async () => {
    if (!file) {
      setError('Choose a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setDownloadUrl('');
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const imageBytes = await getSignatureBytes();
      const isPng = signatureMode === 'draw'
        || signatureFile?.type === 'image/png'
        || signatureFile?.name.toLowerCase().endsWith('.png');
      const image = isPng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);
      const page = pdfDoc.getPage(selectedPage - 1);
      const { width, height } = page.getSize();
      const imageWidth = Math.min(width * 0.42, 160 * (signatureSize / 100));
      const imageHeight = (image.height / image.width) * imageWidth;
      const marginValue = { small: 18, medium: 36, large: 54 }[margin];
      const centerX = placement.xPercent * width;
      const centerY = height - placement.yPercent * height;
      const x = Math.min(Math.max(centerX - imageWidth / 2, marginValue), width - imageWidth - marginValue);
      const y = Math.min(Math.max(centerY - imageHeight / 2, marginValue), height - imageHeight - marginValue);

      page.drawImage(image, { x, y, width: imageWidth, height: imageHeight });
      const bytes = await pdfDoc.save();
      const pdfBuffer = bytes instanceof Uint8Array
        ? bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
        : bytes;
      setDownloadUrl(URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' })));
    } catch (signingError) {
      setError(signingError instanceof Error ? signingError.message : 'Could not sign this PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const signatureReady = signatureMode === 'upload' ? Boolean(signatureFile) : hasDrawing;
  const overlayWidth = Math.max(110, Math.min(220, signatureSize * 1.35));

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isProcessing} title="Adding your signature" />
      <main className="relative overflow-hidden bg-[#fbf7ef] py-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(254,243,199,0.5),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(231,229,228,0.55),transparent_25%)]" />
        <section className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase text-red-500">
                <img src={signPdfHeroIcon} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
                PDF Signature
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
                Sign PDF
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
                Upload a PDF, add your signature, choose the page, and download a signed copy with a simple visual workflow.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {['Upload or draw signature', 'Preview before signing', 'Private browser processing'].map((label) => (
                  <span key={label} className="border-l-4 border-red-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-red-100 bg-white p-3 shadow-[0_14px_34px_rgba(239,68,68,0.06)] sm:p-4">
              <div
                className={`flex min-h-[260px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition sm:min-h-[315px] sm:px-6 sm:py-10 ${isDraggingFile ? 'border-red-600 bg-red-50' : 'border-red-300 bg-white'
                  }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(false);
                }}
                onDrop={handlePdfDrop}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handlePdfChange} className="hidden" />
                <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-red-50 sm:h-28 sm:w-28">
                  <img src={signPdfUploadPdfIcon} alt="" aria-hidden="true" className="h-16 w-16 object-contain sm:h-24 sm:w-24" />
                </span>
                <h2 className="mt-4 max-w-full break-words text-xl font-extrabold text-slate-950">
                  {file ? file.name : 'Upload your PDF file'}
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">Supports PDF files. Recommended maximum size: 25 MB.</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 sm:px-7"
                >
                  <FiUpload className="h-5 w-5" />
                  {file ? 'Change file' : 'Choose PDF file'}
                </button>
                <p className="mt-4 text-sm font-medium text-slate-500">or drag and drop your PDF here</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-[0.65fr_1.8fr] xl:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase text-blue-600">How it works</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Sign in 4 easy steps</h2>
              <p className="mt-4 max-w-md text-base font-medium leading-7 text-slate-600">
                The page guides users from PDF upload to signature placement and final download.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {howItWorksSteps.map((step, index) => {
                return (
                  <div key={step.title} className="relative">
                    <article className="flex min-h-40 flex-col rounded-lg border border-red-100 bg-white p-4 shadow-[0_10px_24px_rgba(239,68,68,0.05)] sm:min-h-44 sm:p-5">
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
                      <span className="absolute -right-7 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 lg:flex">
                        <FiChevronRight className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {file && (
            <div className="mt-6 flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:items-center sm:p-5">
              <img src={signPdfUploadPdfIcon} alt="" aria-hidden="true" className="h-12 w-12 shrink-0 object-contain" />
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-sm text-slate-950">{file.name}</strong>
                <span className="text-xs font-medium text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setSelectedPage(1);
                  setPageCount(1);
                  setDownloadUrl('');
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove selected PDF"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-[370px_minmax(0,1fr)]">
            <div className="space-y-5">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-extrabold text-white">1</span>
                  <h2 className="font-extrabold text-slate-950">Add signature</h2>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">Upload a signature image or draw your signature.</p>

                <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`inline-flex h-11 items-center justify-center gap-2 text-sm font-bold ${signatureMode === 'upload' ? 'border border-red-400 bg-red-50 text-red-500' : 'text-slate-600'
                      }`}
                  >
                    <FiUpload /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('draw')}
                    className={`inline-flex h-11 items-center justify-center gap-2 text-sm font-bold ${signatureMode === 'draw' ? 'border border-red-400 bg-red-50 text-red-500' : 'text-slate-600'
                      }`}
                  >
                    <FiEdit3 /> Draw
                  </button>
                </div>

                <input ref={signatureInputRef} type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={handleSignatureChange} className="hidden" />
                {signatureMode === 'upload' ? (
                  <button
                    type="button"
                    onClick={() => signatureInputRef.current?.click()}
                    className="mt-4 flex min-h-36 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-4 text-center hover:border-blue-400"
                  >
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Uploaded signature" className="h-16 max-w-full object-contain" />
                    ) : (
                      <img src={signPdfUploadSignatureIcon} alt="" aria-hidden="true" className="h-16 w-16 object-contain" />
                    )}
                    <strong className="mt-2 text-sm text-slate-700">{signatureFile?.name || 'Upload signature image'}</strong>
                    <span className="mt-1 text-xs text-slate-500">PNG or JPG. Transparent background works best.</span>
                  </button>
                ) : (
                  <div className="mt-4">
                    <canvas
                      ref={drawCanvasRef}
                      width={700}
                      height={240}
                      onPointerDown={startDrawing}
                      onPointerMove={drawSignature}
                      onPointerUp={finishDrawing}
                      onPointerCancel={finishDrawing}
                      className="h-36 w-full touch-none rounded-lg border-2 border-dashed border-slate-300 bg-white"
                      aria-label="Draw your signature"
                    />
                    <button type="button" onClick={clearDrawing} className="mt-2 text-xs font-bold text-red-500">Clear drawing</button>
                  </div>
                )}

                <div className="mt-4 flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-xs font-medium leading-5 text-slate-600">
                  <img src={signPdfPlaceSignatureIcon} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
                  Click on the document preview to place your signature.
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-extrabold text-white">2</span>
                  <h2 className="font-extrabold text-slate-950">Adjust signature</h2>
                </div>
                <label htmlFor="signatureSize" className="mt-5 flex justify-between text-xs font-bold text-slate-700">
                  Size <span>{signatureSize}%</span>
                </label>
                <input
                  id="signatureSize"
                  type="range"
                  min="70"
                  max="170"
                  value={signatureSize}
                  onChange={(event) => {
                    setSignatureSize(Number(event.target.value));
                    setDownloadUrl('');
                  }}
                  className="mt-3 w-full accent-red-500"
                />
                <label htmlFor="signatureMargin" className="mt-5 block text-xs font-bold text-slate-700">Margin from edges</label>
                <select
                  id="signatureMargin"
                  value={margin}
                  onChange={(event) => {
                    setMargin(event.target.value as MarginOption);
                    setDownloadUrl('');
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-extrabold text-white">3</span>
                  <h2 className="font-extrabold text-slate-950">Review and sign</h2>
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-lg bg-green-50 p-4 text-xs font-medium text-green-700">
                  <img src={signPdfReviewSignIcon} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
                  Click on the preview to place your signature.
                </div>
              </section>
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-extrabold text-white">4</span>
                <h2 className="font-extrabold text-slate-950">Preview and select page</h2>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">
                Choose the page where your signature should appear, then click the document to place it.
              </p>

              <div className="relative mt-5 min-h-[320px] overflow-auto rounded-lg bg-slate-100 p-3 sm:min-h-[520px] sm:p-4">
                {!file && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <img src={signPdfUploadPdfIcon} alt="" aria-hidden="true" className="h-24 w-24 object-contain opacity-70" />
                    <p className="mt-3 text-sm font-bold text-slate-500">Choose a PDF to preview its first page.</p>
                  </div>
                )}
                {file && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={placeSignature}
                    className="relative mx-auto w-fit cursor-crosshair"
                  >
                    {isPreviewLoading && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 text-sm font-bold text-slate-600">
                        Rendering preview...
                      </div>
                    )}
                    <canvas ref={previewCanvasRef} className="block max-w-full border border-slate-200 bg-white shadow-lg" />
                    {signatureReady && signatureUrl && (
                      <div
                        className="pointer-events-none absolute flex items-center justify-center border-2 border-dashed border-red-400 bg-white/30 p-1"
                        style={{
                          left: `${placement.xPercent * 100}%`,
                          top: `${placement.yPercent * 100}%`,
                          width: `${overlayWidth}px`,
                          height: `${Math.max(60, overlayWidth * 0.38)}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <img src={signatureUrl} alt="Signature placement" className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {file && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => selectPage(selectedPage - 1)}
                      disabled={selectedPage === 1 || isPreviewLoading}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300"
                      aria-label="Previous PDF page"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      Page
                      <select
                        value={selectedPage}
                        onChange={(event) => selectPage(Number(event.target.value))}
                        disabled={isPreviewLoading}
                        className="h-10 rounded-lg border border-slate-300 bg-white px-3 font-bold text-slate-900 outline-none focus:border-blue-500"
                        aria-label="Select PDF page to sign"
                      >
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                          <option key={page} value={page}>{page}</option>
                        ))}
                      </select>
                      of {pageCount}
                    </label>
                    <button
                      type="button"
                      onClick={() => selectPage(selectedPage + 1)}
                      disabled={selectedPage === pageCount || isPreviewLoading}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300"
                      aria-label="Next PDF page"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {pageCount > 1 && pageCount <= 12 && (
                    <div className="mt-3 flex max-w-full justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
                      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => selectPage(page)}
                          className={`h-9 min-w-9 rounded-md border px-3 text-xs font-extrabold ${selectedPage === page
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                            }`}
                          aria-label={`Sign PDF page ${page}`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>


          <div className="mt-8 grid overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_12px_30px_rgba(239,68,68,0.06)] md:grid-cols-3">
            {signFeatures.map((feature, index) => {
              return (
                <div key={feature.title} className={`flex min-h-28 items-start gap-4 p-4 sm:items-center sm:p-5 ${index > 0 ? 'border-t border-red-100 md:border-l md:border-t-0' : ''}`}>
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg sm:h-16 sm:w-16 ${feature.color}`}>
                    <img src={feature.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-md sm:h-14 sm:w-14" />
                  </span>
                  <span>
                    <strong className="block text-base font-extrabold text-slate-950">{feature.title}</strong>
                    <span className="mt-2 block text-sm font-medium leading-6 text-slate-600">{feature.description}</span>
                  </span>
                </div>
              );
            })}
          </div>


          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={signPdf}
              disabled={!file || !signatureReady || isProcessing}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 text-base font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isProcessing ? <FiRefreshCw className="h-5 w-5 animate-spin" /> : <FiPenTool className="h-5 w-5" />}
              {isProcessing ? 'Signing...' : 'Sign PDF'}
              {!isProcessing && <FiArrowRight className="h-5 w-5" />}
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="signed.pdf"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-green-600 px-8 text-sm font-extrabold text-white hover:bg-green-700"
              >
                <FiDownload className="h-5 w-5" />
                Download signed PDF
              </a>
            )}
          </div>

          {downloadUrl && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              <FiCheck className="mt-0.5 h-5 w-5 shrink-0" />
              Your signed PDF is ready to download.
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              {error}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SignPdfToolPage;

import { ChangeEvent, DragEvent, MouseEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { IconType } from 'react-icons';
import {
  FiArrowDown,
  FiArrowUp,
  FiCheckCircle,
  FiDownload,
  FiRefreshCw,
  FiRotateCw,
  FiTrash2,
  FiUploadCloud,
} from 'react-icons/fi';
import ConversionFailureRecovery from '../ConversionFailureRecovery';
import Footer from '../Footer';
import Header from '../Header';

type PdfMode = 'merge' | 'split' | 'compress' | 'sign' | 'edit';

type BrowserPdfToolPageProps = {
  mode: PdfMode;
  title: string;
  eyebrow: string;
  description: string;
  icon: IconType;
};

type PdfFileItem = {
  id: string;
  file: File;
};

type SignaturePlacement = {
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
};

const createDownload = (bytes: Uint8Array, name: string) => {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  return {
    url: URL.createObjectURL(blob),
    name,
  };
};

const parsePageRanges = (value: string, pageCount: number) => {
  const pages = new Set<number>();
  const ranges = value.split(',').map((part) => part.trim()).filter(Boolean);

  ranges.forEach((range) => {
    if (range.includes('-')) {
      const [startText, endText] = range.split('-');
      const start = Number(startText);
      const end = Number(endText);

      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > pageCount || start > end) {
        throw new Error('Invalid page range.');
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page - 1);
      }
      return;
    }

    const page = Number(range);
    if (!Number.isInteger(page) || page < 1 || page > pageCount) {
      throw new Error('Invalid page range.');
    }
    pages.add(page - 1);
  });

  if (pages.size === 0) {
    throw new Error('Enter at least one page number.');
  }

  return [...pages].sort((a, b) => a - b);
};

const BrowserPdfToolPage = ({ mode, title, eyebrow, description, icon: Icon }: BrowserPdfToolPageProps) => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signatureMode, setSignatureMode] = useState<'upload' | 'draw'>('upload');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [signaturePlacement, setSignaturePlacement] = useState<SignaturePlacement | null>(null);
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState('');
  const [signatureRotation, setSignatureRotation] = useState(0);
  const [isMovingSignature, setIsMovingSignature] = useState(false);
  const [isRotatingSignature, setIsRotatingSignature] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [pageRange, setPageRange] = useState('1');
  const [editText, setEditText] = useState('Sample text');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const signatureInputRef = useRef<HTMLInputElement | null>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const signatureOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mode !== 'sign' || !files[0]) {
      return;
    }

    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;

    const renderPreview = async () => {
      const canvas = pdfPreviewCanvasRef.current;
      if (!canvas) {
        return;
      }

      setIsPreviewLoading(true);
      setError('');

      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

        const data = new Uint8Array(await files[0].file.arrayBuffer());
        const pdf = await pdfjs.getDocument({ data }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.35 });
        const context = canvas.getContext('2d');

        if (!context || cancelled) {
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
        });

        await renderTask.promise;
      } catch (previewError) {
        if (!cancelled) {
          console.error(previewError);
          setError('Could not render a preview for this PDF.');
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
  }, [files, mode]);

  const multiple = mode === 'merge';
  const canProcess = mode === 'merge' ? files.length >= 2 : files.length >= 1;

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const nextFiles = Array.from(fileList)
      .filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
      }));

    if (nextFiles.length === 0) {
      setError('Please choose a PDF file.');
      return;
    }

    setError('');
    setDownload(null);
    setFiles((current) => (multiple ? [...current, ...nextFiles] : [nextFiles[0]]));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
  };

  const handleSignatureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      setSignaturePreviewUrl(URL.createObjectURL(file));
      setDownload(null);
    }
  };

  const getCanvasPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
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
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const point = getCanvasPoint(event);
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#0f172a';
    setIsDrawing(true);
    setHasDrawnSignature(true);
    setDownload(null);
  };

  const drawSignature = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }

    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }

    const point = getCanvasPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    if (canvas && hasDrawnSignature) {
      setSignaturePreviewUrl(canvas.toDataURL('image/png'));
    }
    setIsDrawing(false);
  };

  const clearDrawnSignature = () => {
    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
    if (signatureMode === 'draw') {
      setSignaturePreviewUrl('');
    }
    setDownload(null);
  };

  const getDrawnSignatureBytes = async () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || !hasDrawnSignature) {
      throw new Error('Draw a signature first.');
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) {
      throw new Error('Could not prepare the drawn signature.');
    }

    return blob.arrayBuffer();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((item) => item.id !== id));
    setDownload(null);
    setSignaturePlacement(null);
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) {
        return current;
      }
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const processMerge = async () => {
    const { PDFDocument } = await import('pdf-lib');
    const mergedPdf = await PDFDocument.create();

    for (const item of files) {
      const sourceBytes = await item.file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);
      const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const bytes = await mergedPdf.save();
    return createDownload(bytes, 'merged.pdf');
  };

  const processSplit = async () => {
    const { PDFDocument } = await import('pdf-lib');
    const sourceBytes = await files[0].file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(sourceBytes);
    const pageIndexes = parsePageRanges(pageRange, sourcePdf.getPageCount());
    const outputPdf = await PDFDocument.create();
    const copiedPages = await outputPdf.copyPages(sourcePdf, pageIndexes);
    copiedPages.forEach((page) => outputPdf.addPage(page));

    const bytes = await outputPdf.save();
    return createDownload(bytes, 'split.pdf');
  };

  const processCompress = async () => {
    const { PDFDocument } = await import('pdf-lib');
    const sourceBytes = await files[0].file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(sourceBytes);
    const bytes = await sourcePdf.save({ useObjectStreams: true });
    return createDownload(bytes, 'compressed.pdf');
  };

  const processSign = async () => {
    const { PDFDocument, degrees } = await import('pdf-lib');
    if (signatureMode === 'upload' && !signatureFile) {
      throw new Error('Upload a PNG or JPG signature image first.');
    }

    const sourceBytes = await files[0].file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(sourceBytes);
    const imageBytes = signatureMode === 'draw'
      ? await getDrawnSignatureBytes()
      : await signatureFile!.arrayBuffer();
    const image = signatureMode === 'draw' || signatureFile?.type === 'image/png' || signatureFile?.name.toLowerCase().endsWith('.png')
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();
    const imageWidth = 160;
    const imageHeight = (image.height / image.width) * imageWidth;
    const x = signaturePlacement
      ? Math.min(Math.max(signaturePlacement.x - imageWidth / 2, 24), width - imageWidth - 24)
      : width - imageWidth - 48;
    const y = signaturePlacement
      ? Math.min(Math.max(signaturePlacement.y - imageHeight / 2, 24), height - imageHeight - 24)
      : 48;

    page.drawImage(image, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
      rotate: degrees(signatureRotation),
    });

    const bytes = await pdfDoc.save();
    return createDownload(bytes, 'signed.pdf');
  };

  const processEdit = async () => {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    if (!editText.trim()) {
      throw new Error('Enter text to add to the PDF.');
    }

    const sourceBytes = await files[0].file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(sourceBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPage(0);
    const { height } = page.getSize();

    page.drawText(editText.trim(), {
      x: 48,
      y: height - 72,
      size: 18,
      font,
      color: rgb(0.15, 0.23, 0.38),
    });

    const bytes = await pdfDoc.save();
    return createDownload(bytes, 'edited.pdf');
  };

  const handleProcess = async () => {
    if (!canProcess) {
      setError(mode === 'merge' ? 'Upload at least two PDF files.' : 'Upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setDownload(null);

    try {
      const result = await {
        merge: processMerge,
        split: processSplit,
        compress: processCompress,
        sign: processSign,
        edit: processEdit,
      }[mode]();
      setDownload(result);
    } catch (processingError) {
      setError(processingError instanceof Error ? processingError.message : 'Could not process this PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const setSignaturePositionFromPoint = async (clientX: number, clientY: number) => {
    if (mode !== 'sign' || !files[0]) {
      return;
    }

    const canvas = pdfPreviewCanvasRef.current;
    if (!canvas) {
      return;
    }

    try {
      const sourceBytes = await files[0].file.arrayBuffer();
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(sourceBytes);
      const page = pdfDoc.getPage(0);
      const { width, height } = page.getSize();
      const rect = canvas.getBoundingClientRect();
      const xPercent = (clientX - rect.left) / rect.width;
      const yPercent = (clientY - rect.top) / rect.height;

      if (xPercent < 0 || xPercent > 1 || yPercent < 0 || yPercent > 1) {
        return;
      }

      setSignaturePlacement({
        x: xPercent * width,
        y: height - yPercent * height,
        xPercent,
        yPercent,
      });
      setDownload(null);
    } catch (placementError) {
      console.error(placementError);
      setError('Could not set the signature position for this PDF.');
    }
  };

  const handlePreviewClick = async (event: MouseEvent<HTMLDivElement>) => {
    await setSignaturePositionFromPoint(event.clientX, event.clientY);
  };

  const handleSignatureMoveStart = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    signatureOverlayRef.current?.setPointerCapture(event.pointerId);
    setIsMovingSignature(true);
  };

  const handleSignatureMove = async (event: PointerEvent<HTMLDivElement>) => {
    if (!isMovingSignature || isRotatingSignature) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    await setSignaturePositionFromPoint(event.clientX, event.clientY);
  };

  const handleSignatureMoveEnd = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (signatureOverlayRef.current?.hasPointerCapture(event.pointerId)) {
      signatureOverlayRef.current.releasePointerCapture(event.pointerId);
    }
    setIsMovingSignature(false);
  };

  const handleSignatureRotateStart = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsRotatingSignature(true);
  };

  const handleSignatureRotate = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isRotatingSignature || !signaturePlacement) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const canvas = pdfPreviewCanvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + signaturePlacement.xPercent * rect.width;
    const centerY = rect.top + signaturePlacement.yPercent * rect.height;
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
    setSignatureRotation((angle + 90 + 360) % 360);
    setDownload(null);
  };

  const handleSignatureRotateEnd = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsRotatingSignature(false);
  };

  const actionLabel = {
    merge: 'Merge PDF',
    split: 'Split PDF',
    compress: 'Compress PDF',
    sign: 'Sign PDF',
    edit: 'Save PDF',
  }[mode];

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">{title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
          </div>

          <div
            className={`mt-10 rounded-lg border-2 border-dashed bg-white p-6 text-center transition sm:p-10 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Icon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              {multiple ? 'Choose PDF files' : 'Choose a PDF file'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">Supports PDF files. Recommended maximum size: 25 MB.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <FiUploadCloud className="h-4 w-4" />
              Choose {multiple ? 'files' : 'file'}
            </button>
            <p className="mt-3 text-sm text-slate-500">or drop PDF {multiple ? 'files' : 'file'} here</p>
          </div>

          {files.length > 0 && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-slate-950">Selected files</h2>
                <button
                  type="button"
                  onClick={() => {
                    setFiles([]);
                    setDownload(null);
                  }}
                  className="text-sm font-semibold text-slate-500 hover:text-red-600"
                >
                  Clear
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {files.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.file.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {multiple && (
                        <>
                          <button type="button" onClick={() => moveFile(index, -1)} className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Move file up">
                            <FiArrowUp className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => moveFile(index, 1)} className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Move file down">
                            <FiArrowDown className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button type="button" onClick={() => removeFile(item.id)} className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Remove file">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {mode === 'split' && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
              <label className="text-sm font-semibold text-slate-950" htmlFor="pageRange">Pages to extract</label>
              <input
                id="pageRange"
                value={pageRange}
                onChange={(event) => setPageRange(event.target.value)}
                placeholder="1-3,5,8"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-slate-500">Use ranges like 1-3 or specific pages like 1,4,7.</p>
            </section>
          )}

          {mode === 'sign' && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
              <input ref={signatureInputRef} type="file" accept=".png,.jpg,.jpeg" onChange={handleSignatureChange} className="hidden" />
              <h2 className="text-base font-semibold text-slate-950">Signature</h2>
              <p className="mt-2 text-sm text-slate-500">
                Upload a PNG/JPG signature or draw one here. It will be placed on the first page near the bottom-right corner.
              </p>

                  <div className="mt-4 inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setSignatureMode('upload');
                    setSignaturePreviewUrl(signatureFile ? URL.createObjectURL(signatureFile) : '');
                    setDownload(null);
                  }}
                  className={`rounded px-3 py-2 text-sm font-semibold ${
                    signatureMode === 'upload' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignatureMode('draw');
                    setSignaturePreviewUrl(hasDrawnSignature && signatureCanvasRef.current ? signatureCanvasRef.current.toDataURL('image/png') : '');
                    setDownload(null);
                  }}
                  className={`rounded px-3 py-2 text-sm font-semibold ${
                    signatureMode === 'draw' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Draw
                </button>
              </div>

              {signatureMode === 'upload' && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => signatureInputRef.current?.click()}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    Choose signature image
                  </button>
                  {signatureFile && <p className="mt-3 text-sm font-medium text-slate-700">{signatureFile.name}</p>}
                </div>
              )}

              {signatureMode === 'draw' && (
                <div className="mt-4">
                  <canvas
                    ref={signatureCanvasRef}
                    width={720}
                    height={220}
                    onPointerDown={startDrawing}
                    onPointerMove={drawSignature}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    className="h-44 w-full touch-none rounded-md border border-slate-300 bg-white"
                    aria-label="Draw signature"
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">Draw with mouse, trackpad, stylus, or touch.</p>
                    <button
                      type="button"
                      onClick={clearDrawnSignature}
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {files[0] && (
                <div className="mt-6">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-950">Place signature</h3>
                      <p className="mt-1 text-sm text-slate-500">Click the preview where the signature should appear.</p>
                    </div>
                    {signaturePlacement && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSignaturePlacement(null);
                            setSignatureRotation(0);
                            setDownload(null);
                          }}
                          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handlePreviewClick}
                    className="relative mt-4 max-h-[620px] overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-3"
                  >
                    {isPreviewLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-sm font-semibold text-slate-600">
                        Rendering preview...
                      </div>
                    )}
                    <div className="relative mx-auto w-fit">
                      <canvas
                        ref={pdfPreviewCanvasRef}
                        className="block max-w-full cursor-crosshair rounded border border-slate-300 bg-white shadow-sm"
                        aria-label="PDF first page preview"
                      />
                      {signaturePlacement && (
                        <div
                          ref={signatureOverlayRef}
                          onPointerDown={handleSignatureMoveStart}
                          onPointerMove={handleSignatureMove}
                          onPointerUp={handleSignatureMoveEnd}
                          onPointerCancel={handleSignatureMoveEnd}
                          className="absolute flex h-16 w-44 -translate-x-1/2 -translate-y-1/2 touch-none cursor-move items-center justify-center rounded border-2 border-blue-600 bg-blue-50/80 p-1 text-xs font-semibold text-blue-700 shadow-sm"
                          style={{
                            left: `${signaturePlacement.xPercent * 100}%`,
                            top: `${signaturePlacement.yPercent * 100}%`,
                            transform: `translate(-50%, -50%) rotate(${signatureRotation}deg)`,
                          }}
                        >
                          {signaturePreviewUrl ? (
                            <img decoding="async" loading="lazy" src={signaturePreviewUrl} alt="Signature preview" className="h-full max-w-full object-contain" />
                          ) : (
                            'Signature'
                          )}
                          <button
                            type="button"
                            onPointerDown={handleSignatureRotateStart}
                            onPointerMove={handleSignatureRotate}
                            onPointerUp={handleSignatureRotateEnd}
                            onPointerCancel={handleSignatureRotateEnd}
                            className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-blue-600 bg-white text-blue-700 shadow-sm"
                            aria-label="Drag to rotate signature"
                          >
                            <FiRotateCw className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {mode === 'edit' && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
              <label className="text-sm font-semibold text-slate-950" htmlFor="editText">Text to add on first page</label>
              <input
                id="editText"
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-2 text-sm text-slate-500">This first version adds text near the top-left of the first page.</p>
            </section>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleProcess}
              disabled={isProcessing || !canProcess}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isProcessing && <FiRefreshCw className="h-4 w-4 animate-spin" />}
              {isProcessing ? 'Processing...' : actionLabel}
            </button>
            {download && (
              <a
                href={download.url}
                download={download.name}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FiDownload className="h-4 w-4" />
                Download {download.name}
              </a>
            )}
          </div>

          {download && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <FiCheckCircle className="mt-0.5 h-5 w-5 flex-none" />
              <p>Your file is ready. Use the download button above to save it.</p>
            </div>
          )}

          {error && (
            <ConversionFailureRecovery
              message={error}
              onRetry={files.length > 0 ? handleProcess : undefined}
              onChooseAnother={() => fileInputRef.current?.click()}
              alternatives={[
                { label: 'Try Merge PDF', href: '/tools/merge-pdf' },
                { label: 'Try Split PDF', href: '/tools/split-pdf' },
                { label: 'Browse all tools', href: '/tools' },
              ]}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BrowserPdfToolPage;

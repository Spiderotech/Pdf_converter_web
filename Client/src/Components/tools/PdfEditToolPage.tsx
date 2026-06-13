import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import {
  FiAlertCircle,
  FiBold,
  FiCircle,
  FiDownload,
  FiEdit3,
  FiImage,
  FiItalic,
  FiMousePointer,
  FiRefreshCw,
  FiSquare,
  FiTrash2,
  FiType,
  FiUnderline,
  FiUploadCloud,
} from 'react-icons/fi';
import Footer from '../Footer';
import Header from '../Header';

type EditTool = 'select' | 'text' | 'erase' | 'rectangle' | 'circle' | 'draw' | 'image';

type BaseElement = {
  id: string;
  xPercent: number;
  yPercent: number;
};

type TextElement = BaseElement & {
  type: 'text';
  text: string;
  fontFamily: FontFamily;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  opacity: number;
};

type ShapeElement = BaseElement & {
  type: 'erase' | 'rectangle' | 'circle';
  widthPercent: number;
  heightPercent: number;
  fillColor: string;
  opacity: number;
};

type DrawElement = {
  id: string;
  type: 'draw';
  points: Array<{ xPercent: number; yPercent: number }>;
};

type ImageElement = BaseElement & {
  type: 'image';
  src: string;
  bytes: ArrayBuffer;
  mimeType: string;
};

type EditElement = TextElement | ShapeElement | DrawElement | ImageElement;

type PageSize = {
  width: number;
  height: number;
};

type FontFamily = 'Arial' | 'Times' | 'Courier';

type TextStyle = {
  fontFamily: FontFamily;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  opacity: number;
};

const defaultTextStyle: TextStyle = {
  fontFamily: 'Arial',
  fontSize: 36,
  bold: false,
  italic: false,
  underline: false,
  color: '#111827',
  opacity: 1,
};
const defaultShapeWidthPercent = 0.22;
const defaultShapeHeightPercent = 0.08;
const defaultShapeColor = '#dbeafe';
const defaultShapeOpacity = 0.35;
const imageWidth = 170;

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);

  return {
    red: ((value >> 16) & 255) / 255,
    green: ((value >> 8) & 255) / 255,
    blue: (value & 255) / 255,
  };
};

const getCssFontFamily = (fontFamily: FontFamily) => ({
  Arial: 'Arial, Helvetica, sans-serif',
  Times: '"Times New Roman", Times, serif',
  Courier: '"Courier New", Courier, monospace',
}[fontFamily]);

const PdfEditToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [tool, setTool] = useState<EditTool>('select');
  const [textValue, setTextValue] = useState('New text');
  const [textStyle, setTextStyle] = useState<TextStyle>(defaultTextStyle);
  const [elements, setElements] = useState<EditElement[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [pendingImage, setPendingImage] = useState<{ src: string; bytes: ArrayBuffer; mimeType: string } | null>(null);
  const [pageSize, setPageSize] = useState<PageSize | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeDrawId, setActiveDrawId] = useState('');
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pageLayerRef = useRef<HTMLDivElement | null>(null);
  const selectedElement = elements.find((element) => element.id === selectedId);
  const selectedAreaElement = selectedElement && (selectedElement.type === 'erase' || selectedElement.type === 'rectangle' || selectedElement.type === 'circle')
    ? selectedElement
    : null;
  const selectedStyledShape = selectedElement && (selectedElement.type === 'rectangle' || selectedElement.type === 'circle')
    ? selectedElement
    : null;
  const selectedTextElement = selectedElement?.type === 'text' ? selectedElement : null;

  const activeTextStyle = selectedTextElement
    ? {
      fontFamily: selectedTextElement.fontFamily,
      fontSize: selectedTextElement.fontSize,
      bold: selectedTextElement.bold,
      italic: selectedTextElement.italic,
      underline: selectedTextElement.underline,
      color: selectedTextElement.color,
      opacity: selectedTextElement.opacity,
    }
    : textStyle;

  const updateTextStyle = <Key extends keyof TextStyle>(key: Key, value: TextStyle[Key]) => {
    if (selectedTextElement) {
      setElements((current) => current.map((element) => (
        element.id === selectedTextElement.id && element.type === 'text'
          ? { ...element, [key]: value }
          : element
      )));
    }

    setTextStyle((current) => ({ ...current, [key]: value }));
    setDownload(null);
  };

  useEffect(() => {
    if (!file) {
      return;
    }

    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;

    const renderPreview = async () => {
      const canvas = pdfCanvasRef.current;
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
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.35 });
        const context = canvas.getContext('2d');

        if (!context || cancelled) {
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setPageSize({ width: viewport.width, height: viewport.height });
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
          setError('Could not render this PDF for editing.');
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
  }, [file]);

  const getLayerPoint = (event: PointerEvent<HTMLDivElement>) => {
    const layer = pageLayerRef.current;
    if (!layer) {
      return null;
    }

    const rect = layer.getBoundingClientRect();
    return {
      xPercent: (event.clientX - rect.left) / rect.width,
      yPercent: (event.clientY - rect.top) / rect.height,
    };
  };

  const clampPercent = (value: number) => Math.min(Math.max(value, 0), 1);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setElements([]);
    setSelectedId('');
    setDownload(null);
    setError('');
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];
    if (!selectedImage) {
      return;
    }

    const bytes = await selectedImage.arrayBuffer();
    setPendingImage({
      src: URL.createObjectURL(selectedImage),
      bytes,
      mimeType: selectedImage.type,
    });
    setTool('image');
    setDownload(null);
  };

  const handlePagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!file || tool === 'select') {
      return;
    }

    const point = getLayerPoint(event);
    if (!point) {
      return;
    }

    const id = crypto.randomUUID();
    setDownload(null);

    if (tool === 'text') {
      setElements((current) => [
        ...current,
        {
          id,
          type: 'text',
          text: textValue || 'Text',
          xPercent: point.xPercent,
          yPercent: point.yPercent,
          ...textStyle,
        },
      ]);
      setSelectedId(id);
      return;
    }

    if (tool === 'erase' || tool === 'rectangle' || tool === 'circle') {
      setElements((current) => [
        ...current,
        {
          id,
          type: tool,
          xPercent: point.xPercent,
          yPercent: point.yPercent,
          widthPercent: defaultShapeWidthPercent,
          heightPercent: defaultShapeHeightPercent,
          fillColor: tool === 'erase' ? '#ffffff' : defaultShapeColor,
          opacity: tool === 'erase' ? 1 : defaultShapeOpacity,
        },
      ]);
      setSelectedId(id);
      return;
    }

    if (tool === 'image') {
      if (!pendingImage) {
        setError('Choose an image first, then click the PDF to place it.');
        return;
      }

      setElements((current) => [
        ...current,
        {
          id,
          type: 'image',
          xPercent: point.xPercent,
          yPercent: point.yPercent,
          src: pendingImage.src,
          bytes: pendingImage.bytes,
          mimeType: pendingImage.mimeType,
        },
      ]);
      setSelectedId(id);
      return;
    }

    if (tool === 'draw') {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDrawing(true);
      setActiveDrawId(id);
      setElements((current) => [
        ...current,
        { id, type: 'draw', points: [{ xPercent: point.xPercent, yPercent: point.yPercent }] },
      ]);
    }
  };

  const handlePagePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const point = getLayerPoint(event);
    if (!point) {
      return;
    }

    if (dragState) {
      setElements((current) => current.map((element) => {
        if (element.id !== dragState.id || element.type === 'draw') {
          return element;
        }

        return {
          ...element,
          xPercent: clampPercent(point.xPercent - dragState.offsetX),
          yPercent: clampPercent(point.yPercent - dragState.offsetY),
        };
      }));
      setDownload(null);
      return;
    }

    if (!isDrawing || !activeDrawId) {
      return;
    }

    setElements((current) => current.map((element) => {
      if (element.id !== activeDrawId || element.type !== 'draw') {
        return element;
      }

      return {
        ...element,
        points: [...element.points, { xPercent: point.xPercent, yPercent: point.yPercent }],
      };
    }));
  };

  const stopPointerAction = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDrawing(false);
    setActiveDrawId('');
    setDragState(null);
  };

  const startElementDrag = (event: PointerEvent<HTMLDivElement>, element: EditElement) => {
    if (element.type === 'draw') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setTool('select');
    setSelectedId(element.id);

    const point = getLayerPoint(event);
    if (!point) {
      return;
    }

    setDragState({
      id: element.id,
      offsetX: point.xPercent - element.xPercent,
      offsetY: point.yPercent - element.yPercent,
    });
  };

  const deleteSelected = () => {
    if (!selectedId) {
      return;
    }

    setElements((current) => current.filter((element) => element.id !== selectedId));
    setSelectedId('');
    setDownload(null);
  };

  const exportPdf = async () => {
    if (!file) {
      setError('Upload a PDF first.');
      return;
    }

    setIsExporting(true);
    setError('');
    setDownload(null);

    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const page = pdfDoc.getPage(0);
      const { width, height } = page.getSize();
      const getPdfFont = async (element: TextElement) => {
        const fonts = {
          Arial: {
            regular: StandardFonts.Helvetica,
            bold: StandardFonts.HelveticaBold,
            italic: StandardFonts.HelveticaOblique,
            boldItalic: StandardFonts.HelveticaBoldOblique,
          },
          Times: {
            regular: StandardFonts.TimesRoman,
            bold: StandardFonts.TimesRomanBold,
            italic: StandardFonts.TimesRomanItalic,
            boldItalic: StandardFonts.TimesRomanBoldItalic,
          },
          Courier: {
            regular: StandardFonts.Courier,
            bold: StandardFonts.CourierBold,
            italic: StandardFonts.CourierOblique,
            boldItalic: StandardFonts.CourierBoldOblique,
          },
        }[element.fontFamily];

        const fontName = element.bold && element.italic
          ? fonts.boldItalic
          : element.bold
            ? fonts.bold
            : element.italic
              ? fonts.italic
              : fonts.regular;

        return pdfDoc.embedFont(fontName);
      };

      for (const element of elements) {
        if (element.type === 'text') {
          const font = await getPdfFont(element);
          const textColor = hexToRgb(element.color);
          const x = element.xPercent * width;
          const y = height - element.yPercent * height;
          page.drawText(element.text, {
            x,
            y,
            size: element.fontSize,
            font,
            color: rgb(textColor.red, textColor.green, textColor.blue),
            opacity: element.opacity,
          });

          if (element.underline) {
            page.drawLine({
              start: { x, y: y - 4 },
              end: { x: x + font.widthOfTextAtSize(element.text, element.fontSize), y: y - 4 },
              thickness: Math.max(1, element.fontSize / 16),
              color: rgb(textColor.red, textColor.green, textColor.blue),
              opacity: element.opacity,
            });
          }
        }

        if (element.type === 'rectangle') {
          const fill = hexToRgb(element.fillColor);
          page.drawRectangle({
            x: element.xPercent * width,
            y: height - element.yPercent * height - element.heightPercent * height,
            width: element.widthPercent * width,
            height: element.heightPercent * height,
            borderColor: rgb(0.15, 0.39, 0.92),
            borderWidth: 2,
            color: rgb(fill.red, fill.green, fill.blue),
            opacity: element.opacity,
          });
        }

        if (element.type === 'erase') {
          page.drawRectangle({
            x: element.xPercent * width,
            y: height - element.yPercent * height - element.heightPercent * height,
            width: element.widthPercent * width,
            height: element.heightPercent * height,
            color: rgb(1, 1, 1),
          });
        }

        if (element.type === 'circle') {
          const fill = hexToRgb(element.fillColor);
          page.drawEllipse({
            x: element.xPercent * width + (element.widthPercent * width) / 2,
            y: height - element.yPercent * height - (element.heightPercent * height) / 2,
            xScale: (element.widthPercent * width) / 2,
            yScale: (element.heightPercent * height) / 2,
            borderColor: rgb(0.15, 0.39, 0.92),
            borderWidth: 2,
            color: rgb(fill.red, fill.green, fill.blue),
            opacity: element.opacity,
          });
        }

        if (element.type === 'image') {
          const image = element.mimeType === 'image/png'
            ? await pdfDoc.embedPng(element.bytes)
            : await pdfDoc.embedJpg(element.bytes);
          const imageHeight = (image.height / image.width) * imageWidth;
          page.drawImage(image, {
            x: element.xPercent * width,
            y: height - element.yPercent * height - imageHeight,
            width: imageWidth,
            height: imageHeight,
          });
        }

        if (element.type === 'draw' && element.points.length > 1) {
          for (let index = 1; index < element.points.length; index += 1) {
            const previous = element.points[index - 1];
            const next = element.points[index];
            page.drawLine({
              start: { x: previous.xPercent * width, y: height - previous.yPercent * height },
              end: { x: next.xPercent * width, y: height - next.yPercent * height },
              thickness: 2,
              color: rgb(0.08, 0.15, 0.3),
            });
          }
        }
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setDownload({
        url: URL.createObjectURL(blob),
        name: 'edited.pdf',
      });
    } catch (exportError) {
      console.error(exportError);
      setError('Could not export this edited PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderElement = (element: EditElement) => {
    if (element.type === 'draw') {
      if (!pageSize || element.points.length < 2) {
        return null;
      }

      const points = element.points.map((point) => `${point.xPercent * pageSize.width},${point.yPercent * pageSize.height}`).join(' ');
      return (
        <svg key={element.id} className="pointer-events-none absolute inset-0 h-full w-full">
          <polyline points={points} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    const selected = selectedId === element.id;
    const commonClass = `absolute cursor-move border-2 ${selected ? 'border-blue-600' : 'border-transparent'} hover:border-blue-400`;

    if (element.type === 'text') {
      return (
        <div
          key={element.id}
          onPointerDown={(event) => startElementDrag(event, element)}
          className={`${commonClass} bg-white/70 px-1`}
          style={{
            left: `${element.xPercent * 100}%`,
            top: `${element.yPercent * 100}%`,
            fontFamily: getCssFontFamily(element.fontFamily),
            fontSize: element.fontSize,
            fontWeight: element.bold ? 700 : 400,
            fontStyle: element.italic ? 'italic' : 'normal',
            textDecoration: element.underline ? 'underline' : 'none',
            color: element.color,
            opacity: element.opacity,
          }}
        >
          {element.text}
        </div>
      );
    }

    if (element.type === 'erase') {
      return (
        <div
          key={element.id}
          onPointerDown={(event) => startElementDrag(event, element)}
          className={`${commonClass} bg-white`}
          style={{
            left: `${element.xPercent * 100}%`,
            top: `${element.yPercent * 100}%`,
            width: `${element.widthPercent * 100}%`,
            height: `${element.heightPercent * 100}%`,
          }}
        >
          <span className="pointer-events-none absolute left-2 top-1 text-[10px] font-semibold uppercase text-slate-400">
            Erase
          </span>
        </div>
      );
    }

    if (element.type === 'rectangle') {
      return (
        <div
          key={element.id}
          onPointerDown={(event) => startElementDrag(event, element)}
          className={`${commonClass} bg-blue-100/30`}
          style={{
            left: `${element.xPercent * 100}%`,
            top: `${element.yPercent * 100}%`,
            width: `${element.widthPercent * 100}%`,
            height: `${element.heightPercent * 100}%`,
            backgroundColor: element.fillColor,
            opacity: element.opacity,
          }}
        />
      );
    }

    if (element.type === 'circle') {
      return (
        <div
          key={element.id}
          onPointerDown={(event) => startElementDrag(event, element)}
          className={`${commonClass} rounded-full bg-blue-100/30`}
          style={{
            left: `${element.xPercent * 100}%`,
            top: `${element.yPercent * 100}%`,
            width: `${element.widthPercent * 100}%`,
            height: `${element.heightPercent * 100}%`,
            backgroundColor: element.fillColor,
            opacity: element.opacity,
          }}
        />
      );
    }

    if (element.type === 'image') {
      return (
      <div
        key={element.id}
        onPointerDown={(event) => startElementDrag(event, element)}
        className={`${commonClass} bg-white/50 p-1`}
        style={{ left: `${element.xPercent * 100}%`, top: `${element.yPercent * 100}%`, width: imageWidth }}
      >
        <img src={element.src} alt="PDF overlay" className="w-full object-contain" />
      </div>
      );
    }

    return null;
  };

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">PDF editor</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Edit PDF</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Add text, shapes, drawings, and images to the first page of a PDF, then download the edited file.
            </p>
          </div>

          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            <input ref={imageInputRef} type="file" accept=".png,.jpg,.jpeg" onChange={handleImageChange} className="hidden" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <FiUploadCloud className="h-4 w-4" />
                {file ? 'Replace PDF' : 'Choose PDF'}
              </button>

              <div className="flex flex-wrap gap-2">
                {[
                  ['select', FiMousePointer, 'Select'],
                  ['text', FiType, 'Text'],
                  ['erase', FiSquare, 'Erase'],
                  ['rectangle', FiSquare, 'Rectangle'],
                  ['circle', FiCircle, 'Circle'],
                  ['draw', FiEdit3, 'Draw'],
                  ['image', FiImage, 'Image'],
                ].map(([value, Icon, label]) => {
                  const ToolIcon = Icon as typeof FiMousePointer;
                  return (
                    <button
                      key={value as string}
                      type="button"
                      onClick={() => {
                        if (value === 'image') {
                          imageInputRef.current?.click();
                        }
                        setTool(value as EditTool);
                      }}
                      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
                        tool === value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ToolIcon className="h-4 w-4" />
                      {label as string}
                    </button>
                  );
                })}
              </div>
            </div>

            {tool === 'text' && (
              <div className="mt-4">
                <label htmlFor="editPdfText" className="text-sm font-semibold text-slate-950">Text to add</label>
                <input
                  id="editPdfText"
                  value={textValue}
                  onChange={(event) => setTextValue(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            )}

            {(tool === 'text' || selectedTextElement) && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <FiType className="h-5 w-5 text-slate-500" />
                <select
                  value={activeTextStyle.fontFamily}
                  onChange={(event) => updateTextStyle('fontFamily', event.target.value as FontFamily)}
                  className="h-10 min-w-40 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800"
                  aria-label="Font family"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times">Times</option>
                  <option value="Courier">Courier</option>
                </select>

                <select
                  value={activeTextStyle.fontSize}
                  onChange={(event) => updateTextStyle('fontSize', Number(event.target.value))}
                  className="h-10 w-24 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800"
                  aria-label="Font size"
                >
                  {[12, 14, 16, 18, 24, 30, 36, 48, 60, 72].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>

                <div className="flex rounded-md border border-slate-300 bg-white">
                  <button
                    type="button"
                    onClick={() => updateTextStyle('bold', !activeTextStyle.bold)}
                    className={`flex h-10 w-10 items-center justify-center border-r border-slate-300 ${activeTextStyle.bold ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                    aria-label="Bold"
                  >
                    <FiBold className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTextStyle('italic', !activeTextStyle.italic)}
                    className={`flex h-10 w-10 items-center justify-center border-r border-slate-300 ${activeTextStyle.italic ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                    aria-label="Italic"
                  >
                    <FiItalic className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTextStyle('underline', !activeTextStyle.underline)}
                    className={`flex h-10 w-10 items-center justify-center ${activeTextStyle.underline ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                    aria-label="Underline"
                  >
                    <FiUnderline className="h-5 w-5" />
                  </button>
                </div>

                <label className="flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700">
                  Color
                  <input
                    type="color"
                    value={activeTextStyle.color}
                    onChange={(event) => updateTextStyle('color', event.target.value)}
                    className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0"
                    aria-label="Text color"
                  />
                </label>

                <label className="flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700">
                  Opacity
                  <select
                    value={Math.round(activeTextStyle.opacity * 100)}
                    onChange={(event) => updateTextStyle('opacity', Number(event.target.value) / 100)}
                    className="bg-white text-sm font-medium outline-none"
                    aria-label="Text opacity"
                  >
                    {[25, 50, 75, 100].map((opacity) => (
                      <option key={opacity} value={opacity}>{opacity}%</option>
                    ))}
                  </select>
                </label>

                {selectedTextElement && (
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="ml-auto flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete selected text"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            {pendingImage && tool === 'image' && (
              <p className="mt-4 text-sm font-medium text-slate-600">Image ready. Click the PDF page to place it.</p>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="relative max-h-[760px] overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-3">
              {!file && (
                <div className="flex min-h-96 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-500">
                  Upload a PDF to start editing.
                </div>
              )}

              {file && (
                <div
                  ref={pageLayerRef}
                  onPointerDown={handlePagePointerDown}
                  onPointerMove={handlePagePointerMove}
                  onPointerUp={stopPointerAction}
                  onPointerCancel={stopPointerAction}
                  className="relative mx-auto w-fit touch-none"
                >
                  {isPreviewLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 text-sm font-semibold text-slate-600">
                      Rendering preview...
                    </div>
                  )}
                  <canvas ref={pdfCanvasRef} className="block max-w-full rounded border border-slate-300 bg-white shadow-sm" />
                  <div className="absolute inset-0">{elements.map(renderElement)}</div>
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-950">Editor controls</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select a tool, then click the PDF preview. Use Erase to cover existing text, then Text to add replacement text.
              </p>

              {selectedAreaElement && (
                <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-950">Selected area size</h3>
                  <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="areaWidth">
                    Width
                  </label>
                  <input
                    id="areaWidth"
                    type="range"
                    min="5"
                    max="80"
                    value={Math.round(selectedAreaElement.widthPercent * 100)}
                    onChange={(event) => {
                      const widthPercent = Number(event.target.value) / 100;
                      setElements((current) => current.map((element) => (
                        element.id === selectedId && (element.type === 'erase' || element.type === 'rectangle' || element.type === 'circle')
                          ? { ...element, widthPercent }
                          : element
                      )));
                      setDownload(null);
                    }}
                    className="mt-2 w-full"
                  />
                  <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="areaHeight">
                    Height
                  </label>
                  <input
                    id="areaHeight"
                    type="range"
                    min="3"
                    max="50"
                    value={Math.round(selectedAreaElement.heightPercent * 100)}
                    onChange={(event) => {
                      const heightPercent = Number(event.target.value) / 100;
                      setElements((current) => current.map((element) => (
                        element.id === selectedId && (element.type === 'erase' || element.type === 'rectangle' || element.type === 'circle')
                          ? { ...element, heightPercent }
                          : element
                      )));
                      setDownload(null);
                    }}
                    className="mt-2 w-full"
                  />

                  {selectedStyledShape && (
                    <>
                      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="shapeFillColor">
                        Fill color
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          id="shapeFillColor"
                          type="color"
                          value={selectedStyledShape.fillColor}
                          onChange={(event) => {
                            const fillColor = event.target.value;
                            setElements((current) => current.map((element) => (
                              element.id === selectedId && (element.type === 'rectangle' || element.type === 'circle')
                                ? { ...element, fillColor }
                                : element
                            )));
                            setDownload(null);
                          }}
                          className="h-10 w-12 cursor-pointer rounded border border-slate-300 bg-white p-1"
                        />
                        <span className="text-sm font-medium text-slate-700">{selectedStyledShape.fillColor}</span>
                      </div>

                      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="shapeOpacity">
                        Opacity: {Math.round(selectedStyledShape.opacity * 100)}%
                      </label>
                      <input
                        id="shapeOpacity"
                        type="range"
                        min="5"
                        max="100"
                        value={Math.round(selectedStyledShape.opacity * 100)}
                        onChange={(event) => {
                          const opacity = Number(event.target.value) / 100;
                          setElements((current) => current.map((element) => (
                            element.id === selectedId && (element.type === 'rectangle' || element.type === 'circle')
                              ? { ...element, opacity }
                              : element
                          )));
                          setDownload(null);
                        }}
                        className="mt-2 w-full"
                      />
                    </>
                  )}
                </div>
              )}

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={deleteSelected}
                  disabled={!selectedId}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Delete selected
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setElements([]);
                    setSelectedId('');
                    setDownload(null);
                  }}
                  disabled={elements.length === 0}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear edits
                </button>
                <button
                  type="button"
                  onClick={exportPdf}
                  disabled={!file || isExporting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isExporting && <FiRefreshCw className="h-4 w-4 animate-spin" />}
                  {isExporting ? 'Exporting...' : 'Export edited PDF'}
                </button>
                {download && (
                  <a
                    href={download.url}
                    download={download.name}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    <FiDownload className="h-4 w-4" />
                    Download PDF
                  </a>
                )}
              </div>
            </aside>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <FiAlertCircle className="mt-0.5 h-5 w-5 flex-none" />
              <p>{error}</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PdfEditToolPage;

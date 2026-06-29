import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import {
  FiBold,
  FiCircle,
  FiCopy,
  FiDownload,
  FiEdit3,
  FiFileText,
  FiImage,
  FiItalic,
  FiMousePointer,
  FiPlus,
  FiRotateCcw,
  FiRotateCw,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiSquare,
  FiTrash2,
  FiType,
  FiUnderline,
  FiUpload,
  FiUploadCloud,
} from 'react-icons/fi';
import ConversionFailureRecovery from '../ConversionFailureRecovery';
import Footer from '../Footer';
import Header from '../Header';
import ConversionLoadingOverlay from '../ConversionLoadingOverlay';

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
  color: string;
  strokeWidth: number;
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
  const [redoElements, setRedoElements] = useState<EditElement[]>([]);
  const [zoom, setZoom] = useState(100);
  const [drawColor, setDrawColor] = useState('#0f172a');
  const [drawSize, setDrawSize] = useState(2);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const thumbnailCanvasRef = useRef<HTMLCanvasElement | null>(null);
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

        const thumbnail = thumbnailCanvasRef.current;
        const thumbnailContext = thumbnail?.getContext('2d');
        if (thumbnail && thumbnailContext) {
          thumbnail.width = 150;
          thumbnail.height = Math.round((canvas.height / canvas.width) * thumbnail.width);
          thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
          thumbnailContext.drawImage(canvas, 0, 0, thumbnail.width, thumbnail.height);
        }
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
        {
          id,
          type: 'draw',
          points: [{ xPercent: point.xPercent, yPercent: point.yPercent }],
          color: drawColor,
          strokeWidth: drawSize,
        },
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

  const undoLastEdit = () => {
    setElements((current) => {
      const lastElement = current[current.length - 1];
      if (!lastElement) {
        return current;
      }

      setRedoElements((redo) => [...redo, lastElement]);
      if (lastElement.id === selectedId) {
        setSelectedId('');
      }
      setDownload(null);
      return current.slice(0, -1);
    });
  };

  const redoLastEdit = () => {
    setRedoElements((current) => {
      const lastElement = current[current.length - 1];
      if (!lastElement) {
        return current;
      }

      setElements((elementsCurrent) => [...elementsCurrent, lastElement]);
      setSelectedId(lastElement.id);
      setDownload(null);
      return current.slice(0, -1);
    });
  };

  const clearEdits = () => {
    if (elements.length > 0) {
      setRedoElements(elements);
    }
    setElements([]);
    setSelectedId('');
    setDownload(null);
  };

  const duplicateSelected = () => {
    if (!selectedElement || selectedElement.type === 'draw') {
      return;
    }

    const duplicate = {
      ...selectedElement,
      id: crypto.randomUUID(),
      xPercent: clampPercent(selectedElement.xPercent + 0.025),
      yPercent: clampPercent(selectedElement.yPercent + 0.025),
    };
    setElements((current) => [...current, duplicate]);
    setSelectedId(duplicate.id);
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
          const strokeColor = hexToRgb(element.color);
          for (let index = 1; index < element.points.length; index += 1) {
            const previous = element.points[index - 1];
            const next = element.points[index];
            page.drawLine({
              start: { x: previous.xPercent * width, y: height - previous.yPercent * height },
              end: { x: next.xPercent * width, y: height - next.yPercent * height },
              thickness: element.strokeWidth,
              color: rgb(strokeColor.red, strokeColor.green, strokeColor.blue),
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
          <polyline
            points={points}
            fill="none"
            stroke={element.color}
            strokeWidth={element.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
        <img decoding="async" loading="lazy" src={element.src} alt="PDF overlay" className="w-full object-contain" />
      </div>
      );
    }

    return null;
  };

  const tools: Array<{ value: EditTool; label: string; icon: typeof FiMousePointer }> = [
    { value: 'select', label: 'Select', icon: FiMousePointer },
    { value: 'text', label: 'Text', icon: FiType },
    { value: 'erase', label: 'Erase', icon: FiSquare },
    { value: 'rectangle', label: 'Rectangle', icon: FiSquare },
    { value: 'circle', label: 'Circle', icon: FiCircle },
    { value: 'draw', label: 'Draw', icon: FiEdit3 },
    { value: 'image', label: 'Image', icon: FiImage },
  ];

  return (
    <>
      <Header />
      <ConversionLoadingOverlay isVisible={isExporting} title="Exporting your edited PDF" />
      <main className="min-h-screen bg-[#f5f8fd] text-slate-900">
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        <input ref={imageInputRef} type="file" accept=".png,.jpg,.jpeg" onChange={handleImageChange} className="hidden" />

        <section className="mx-auto max-w-[1800px] p-4 sm:p-6">
        <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-[0_18px_60px_rgba(30,64,175,0.08)] sm:p-6">
          <div className="py-2 text-center">
            <p className="text-sm font-extrabold uppercase text-blue-600">PDF Editor</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Edit PDF</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
              Add text, shapes, drawings, and images to the first page of a PDF, then download the edited file.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-xs font-bold text-slate-500">
              Supports PDF files up to 25 MB. Image overlays support PNG, JPG, and JPEG.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 xl:flex-row xl:items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-extrabold text-white shadow-md shadow-blue-200 hover:bg-blue-700"
            >
              <FiUploadCloud className="h-5 w-5" />
              {file ? 'Replace PDF' : 'Choose PDF'}
            </button>
            <span className="hidden h-7 w-px bg-slate-200 xl:block" />

            <div className="flex flex-1 flex-wrap gap-2">
              {tools.map(({ value, label, icon: ToolIcon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    if (value === 'image') {
                      imageInputRef.current?.click();
                    }
                    setTool(value);
                  }}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold transition ${
                    tool === value
                      ? 'border-blue-300 bg-blue-50 text-blue-600 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <ToolIcon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <span className="hidden h-7 w-px bg-slate-200 xl:block" />
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={undoLastEdit}
                disabled={elements.length === 0}
                className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 disabled:text-slate-300"
              >
                <FiRotateCcw className="h-4 w-4" /> Undo
              </button>
              <button
                type="button"
                onClick={redoLastEdit}
                disabled={redoElements.length === 0}
                className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 disabled:text-slate-300"
              >
                <FiRotateCw className="h-4 w-4" /> Redo
              </button>
              <button
                type="button"
                onClick={clearEdits}
                disabled={elements.length === 0}
                className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 disabled:text-slate-300"
              >
                <FiRefreshCw className="h-4 w-4" /> Reset
              </button>
              <label className="ml-1 inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600">
                Zoom
                <select
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="bg-white font-bold text-slate-800 outline-none"
                  aria-label="Preview zoom"
                >
                  {[75, 90, 100, 110, 125].map((value) => <option key={value} value={value}>{value}%</option>)}
                </select>
              </label>
            </div>
          </div>

          {pendingImage && tool === 'image' && (
            <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Image ready. Click the PDF page to place it.
            </p>
          )}

          <div className="mt-5 grid min-h-[680px] gap-4 lg:grid-cols-[160px_minmax(0,1fr)_280px] xl:grid-cols-[180px_minmax(0,1fr)_310px]">
            <aside className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Pages</h2>
                <FiCopy className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setSelectedId('')}
                  className={`w-full rounded-lg border-2 p-2 ${file ? 'border-blue-500 bg-blue-50/50' : 'border-dashed border-slate-200'}`}
                >
                  {file ? (
                    <div className="relative overflow-hidden rounded border border-slate-200 bg-white">
                      <canvas ref={thumbnailCanvasRef} className="block h-auto w-full" />
                    </div>
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center text-slate-300">
                      <FiFileText className="h-10 w-10" />
                    </div>
                  )}
                </button>
                <span className="mx-auto mt-2 flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">1</span>
                {file && <p className="mt-3 truncate text-center text-xs font-semibold text-slate-500" title={file.name}>{file.name}</p>}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 text-xs font-extrabold text-blue-600 hover:bg-blue-50"
              >
                <FiPlus className="h-4 w-4" />
                Replace page
              </button>
            </aside>

            <div className="relative max-h-[760px] overflow-auto rounded-lg border border-slate-200 bg-[#eef3fa] p-4 sm:p-6">
              {!file && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[620px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-white text-center hover:border-blue-400 hover:bg-blue-50/30"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FiUpload className="h-8 w-8" />
                  </span>
                  <strong className="mt-5 text-lg font-extrabold">Upload a PDF to start editing</strong>
                  <span className="mt-2 text-sm font-medium text-slate-500">Your file stays in this browser while you work.</span>
                </button>
              )}

              {file && (
                <div
                  className="mx-auto w-fit origin-top transition-transform"
                  style={{ transform: `scale(${zoom / 100})`, marginBottom: `${Math.max(0, (zoom - 100) * 7)}px` }}
                >
                  <div
                    ref={pageLayerRef}
                    onPointerDown={handlePagePointerDown}
                    onPointerMove={handlePagePointerMove}
                    onPointerUp={stopPointerAction}
                    onPointerCancel={stopPointerAction}
                    className="relative w-fit touch-none"
                  >
                    {isPreviewLoading && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 text-sm font-bold text-slate-600">
                        <FiRefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Rendering preview
                      </div>
                    )}
                    <canvas ref={pdfCanvasRef} className="block max-w-full border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]" />
                    <div className="absolute inset-0">{elements.map(renderElement)}</div>
                  </div>
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
              <h2 className="text-xs font-extrabold uppercase text-slate-700">
                {selectedTextElement || tool === 'text'
                  ? 'Text properties'
                  : selectedAreaElement
                    ? 'Shape properties'
                    : tool === 'draw'
                      ? 'Drawing properties'
                      : 'Properties'}
              </h2>

              {(selectedTextElement || tool === 'text') && (
                <div className="mt-5">
                  <label htmlFor="editPdfText" className="mb-2 block text-xs font-bold text-slate-600">Text</label>
                  <input
                    id="editPdfText"
                    value={selectedTextElement?.text ?? textValue}
                    onChange={(event) => {
                      const value = event.target.value;
                      setTextValue(value);
                      if (selectedTextElement) {
                        setElements((current) => current.map((element) => (
                          element.id === selectedTextElement.id && element.type === 'text' ? { ...element, text: value } : element
                        )));
                      }
                      setDownload(null);
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-blue-400"
                  />
                  <div className="mt-3 grid grid-cols-[1fr_80px] gap-2">
                    <select
                      value={activeTextStyle.fontFamily}
                      onChange={(event) => updateTextStyle('fontFamily', event.target.value as FontFamily)}
                      className="h-11 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none"
                      aria-label="Font family"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times">Times</option>
                      <option value="Courier">Courier</option>
                    </select>
                    <select
                      value={activeTextStyle.fontSize}
                      onChange={(event) => updateTextStyle('fontSize', Number(event.target.value))}
                      className="h-11 rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium outline-none"
                      aria-label="Font size"
                    >
                      {[12, 14, 16, 18, 24, 30, 36, 48, 60, 72].map((size) => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Bold', icon: FiBold, active: activeTextStyle.bold, action: () => updateTextStyle('bold', !activeTextStyle.bold) },
                      { label: 'Italic', icon: FiItalic, active: activeTextStyle.italic, action: () => updateTextStyle('italic', !activeTextStyle.italic) },
                      { label: 'Underline', icon: FiUnderline, active: activeTextStyle.underline, action: () => updateTextStyle('underline', !activeTextStyle.underline) },
                    ].map(({ label, icon: StyleIcon, active, action }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={action}
                        className={`flex h-10 items-center justify-center rounded-lg border ${active ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600'}`}
                        aria-label={label}
                      >
                        <StyleIcon className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                  <label className="mt-5 flex items-center justify-between text-sm font-medium text-slate-600">
                    Text color
                    <input
                      type="color"
                      value={activeTextStyle.color}
                      onChange={(event) => updateTextStyle('color', event.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
                    />
                  </label>
                  <label className="mt-4 flex items-center justify-between text-sm font-medium text-slate-600">
                    Opacity
                    <select
                      value={Math.round(activeTextStyle.opacity * 100)}
                      onChange={(event) => updateTextStyle('opacity', Number(event.target.value) / 100)}
                      className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold"
                    >
                      {[25, 50, 75, 100].map((opacity) => <option key={opacity} value={opacity}>{opacity}%</option>)}
                    </select>
                  </label>
                </div>
              )}

              {selectedAreaElement && (
                <div className="mt-5 space-y-4">
                  <label className="block text-xs font-bold text-slate-600" htmlFor="areaWidth">
                    Width
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
                      className="mt-2 w-full accent-blue-600"
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-600" htmlFor="areaHeight">
                    Height
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
                      className="mt-2 w-full accent-blue-600"
                    />
                  </label>
                  {selectedStyledShape && (
                    <>
                      <label className="flex items-center justify-between text-sm font-medium text-slate-600">
                        Fill color
                        <input
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
                          className="h-9 w-12 rounded border border-slate-200 bg-white p-1"
                        />
                      </label>
                      <label className="block text-xs font-bold text-slate-600">
                        Opacity: {Math.round(selectedStyledShape.opacity * 100)}%
                        <input
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
                          className="mt-2 w-full accent-blue-600"
                        />
                      </label>
                    </>
                  )}
                </div>
              )}

              {tool === 'draw' && (
                <div className="mt-5 space-y-5">
                  <label className="flex items-center justify-between text-sm font-medium text-slate-600">
                    Pen color
                    <input
                      type="color"
                      value={drawColor}
                      onChange={(event) => setDrawColor(event.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                      aria-label="Drawing color"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Pen size: {drawSize}px
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={drawSize}
                      onChange={(event) => setDrawSize(Number(event.target.value))}
                      className="mt-3 w-full accent-blue-600"
                      aria-label="Drawing size"
                    />
                  </label>
                  <div className="flex h-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <span
                      className="block w-3/4 rounded-full"
                      style={{ height: drawSize, backgroundColor: drawColor }}
                    />
                  </div>
                  <p className="text-xs font-medium leading-5 text-slate-500">
                    Drag across the PDF to draw with the selected pen style.
                  </p>
                </div>
              )}

              {!selectedTextElement && tool !== 'text' && !selectedAreaElement && tool !== 'draw' && (
                <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-600">
                  Select a tool and click the document. Select an existing edit to move or change it.
                </div>
              )}

              <div className="mt-7">
                <h3 className="text-xs font-extrabold uppercase text-slate-700">Actions</h3>
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={duplicateSelected}
                    disabled={!selectedElement || selectedElement.type === 'draw'}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue-300 text-sm font-bold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                  >
                    <FiCopy className="h-4 w-4" />
                    Duplicate selected
                  </button>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    disabled={!selectedId}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue-300 text-sm font-bold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Delete selected
                  </button>
                  <button
                    type="button"
                    onClick={clearEdits}
                    disabled={elements.length === 0}
                    className="h-11 w-full rounded-lg border border-blue-300 text-sm font-bold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                  >
                    Clear all edits
                  </button>
                  <button
                    type="button"
                    onClick={exportPdf}
                    disabled={!file || isExporting}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {isExporting ? <FiRefreshCw className="h-4 w-4 animate-spin" /> : <FiSave className="h-4 w-4" />}
                    {isExporting ? 'Exporting...' : 'Export edited PDF'}
                  </button>
                  {download && (
                    <a
                      href={download.url}
                      download={download.name}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-extrabold text-white hover:bg-emerald-600"
                    >
                      <FiDownload className="h-4 w-4" />
                      Download PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-lg bg-blue-50 p-4">
                <FiShield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <strong className="block text-sm font-extrabold text-blue-950">Your files are secure</strong>
                  <p className="mt-1 text-xs font-medium leading-5 text-blue-800">We never store your files. All processing happens in your browser.</p>
                </div>
              </div>
            </aside>
          </div>

          {error && (
            <ConversionFailureRecovery
              message={error}
              onRetry={file ? exportPdf : undefined}
              onChooseAnother={() => fileInputRef.current?.click()}
              alternatives={[
                { label: 'Try Sign PDF', href: '/tools/sign-pdf' },
                { label: 'Try Merge PDF', href: '/tools/merge-pdf' },
                { label: 'Browse all tools', href: '/tools' },
              ]}
            />
          )}
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PdfEditToolPage;

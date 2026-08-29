'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft, Download, ZoomIn, ZoomOut,
  Volume2, VolumeX, Play, Pause,
  Maximize2, Minimize2, ChevronsLeft, ChevronsRight,
  ChevronLeft, ChevronRight, Loader2, BookOpen,
} from 'lucide-react';

const HTMLFlipBook = dynamic(
  () => import('react-pageflip').then(m => (m as any).default ?? m),
  { ssr: false }
) as any;

interface Props {
  pdfUrl: string;
  title: string;
  year: string;
  type: string;
}

export function EbookReader({ pdfUrl, title, year, type }: Props) {
  const [pages,       setPages]       = useState<string[]>([]);
  const [progress,    setProgress]    = useState(0);
  const [totalPgs,    setTotalPgs]    = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen,  setFullscreen]  = useState(false);
  const [zoom,        setZoom]        = useState(1);
  const [soundOn,     setSoundOn]     = useState(true);
  const [autoplay,    setAutoplay]    = useState(false);
  const [bookSize,    setBookSize]    = useState({ w: 460, h: 651, portrait: false });
  const [pan,         setPan]         = useState({ x: 0, y: 0 });
  const [dragging,    setDragging]    = useState(false);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const objectUrls = useRef<string[]>([]);
  const imgRefs    = useRef<(HTMLImageElement | null)[]>([]);
  const pageUrls   = useRef<string[]>([]);

  useEffect(() => () => { objectUrls.current.forEach(URL.revokeObjectURL); }, []);

  const paintPage = useCallback((i: number) => {
    const el = imgRefs.current[i];
    const url = pageUrls.current[i];
    if (el && url && el.src !== url) { el.src = url; el.style.opacity = '1'; }
  }, []);

  const flipRef       = useRef<any>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const autoRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const flipAudioRef  = useRef<HTMLAudioElement | null>(null);
  const soundOnRef    = useRef(soundOn);
  useEffect(() => { soundOnRef.current = soundOn; }, [soundOn]);
  // Preload the flip sound
  useEffect(() => {
    flipAudioRef.current = new Audio('/sounds/page-flip.ogg');
    flipAudioRef.current.load();
  }, []);

  /* ── Responsive book sizing ── */
  useEffect(() => {
    const calc = () => {
      // A hidden or not-yet-laid-out viewport reports 0, which would hand
      // StPageFlip an invalid size and make it throw on every render.
      const vw = window.innerWidth  || 1280;
      const vh = window.innerHeight || 800;
      const portrait = vw < 640;
      const availH = vh - 56 - 52 - 40;
      if (portrait) {
        const w = Math.min(vw - 32, 360);
        setBookSize({ w, h: Math.round(w * 1.414), portrait: true });
      } else {
        const h = Math.min(Math.max(availH, 280), 700);
        setBookSize({ w: Math.round(h / 1.414), h, portrait: false });
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  /* ── PDF rendering ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const lib = await import('pdfjs-dist');
        lib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${lib.version}/build/pdf.worker.min.mjs`;
        const effectiveUrl = /^https?:\/\//i.test(pdfUrl)
          ? `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`
          : pdfUrl;
        const pdf = await lib.getDocument({ url: effectiveUrl, cMapPacked: true }).promise;
        if (cancelled) return;
        const total = pdf.numPages;
        setTotalPgs(total);

        // Match the raster to the size the page is actually displayed at. A fixed
        // scale over-renders large page boxes by several times, and that surplus
        // is the bulk of the wait on image-heavy magazine PDFs.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        // innerWidth/innerHeight read 0 when the page renders while hidden, so
        // floor the display width rather than deriving a bogus scale from it.
        const vw = window.innerWidth  || 1280;
        const vh = window.innerHeight || 800;
        const displayW = vw < 640
          ? Math.min(vw - 32, 360)
          : Math.round(Math.min(Math.max(vh - 148, 280), 700) / 1.414);
        const targetW = displayW * dpr;

        // One reusable canvas, and toBlob instead of toDataURL — base64 encoding
        // 22 full-page rasters on the main thread is itself a large share of the wait.
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: false })!;

        const renderPage = async (i: number) => {
          const pg = await pdf.getPage(i);
          const base = pg.getViewport({ scale: 1 });
          const vp = pg.getViewport({ scale: Math.min(Math.max(targetW / base.width, 1), 2) });
          canvas.width = vp.width; canvas.height = vp.height;
          await pg.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise;
          const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.82));
          pg.cleanup();
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          objectUrls.current.push(url);
          pageUrls.current[i - 1] = url;
          paintPage(i - 1);
        };

        // Open the book as soon as the opening spread is ready; the rest stream in
        // behind it. On a 20+ page magazine that is a couple of seconds instead of
        // waiting on every page first.
        const eager = Math.min(2, total);
        for (let i = 1; i <= eager; i++) {
          if (cancelled) return;
          await renderPage(i);
          setProgress(i);
        }
        if (cancelled) return;
        setPages(new Array(total).fill(''));
        setLoading(false);

        for (let i = eager + 1; i <= total; i++) {
          if (cancelled) return;
          await renderPage(i);
          setProgress(i);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load PDF');
      }
    })();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  /* ── Page-flip sound: exact mygov flipsound.ogg ── */
  const playFlipSound = useCallback(() => {
    if (!soundOnRef.current) return;
    try {
      const snd = new Audio('/sounds/page-flip.ogg');
      snd.play().catch(() => {});
    } catch {}
  }, []);

  /* ── Fullscreen ── */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }, []);
  useEffect(() => {
    const h = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  /* ── Navigation ── */
  const flipNext    = useCallback(() => flipRef.current?.pageFlip()?.flipNext(), []);
  const flipPrev    = useCallback(() => flipRef.current?.pageFlip()?.flipPrev(), []);
  const flipToFirst = useCallback(() => flipRef.current?.pageFlip()?.flip(0), []);
  const flipToLast  = useCallback(() => flipRef.current?.pageFlip()?.flip(pages.length - 1), [pages.length]);

  /* ── Keyboard ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flipNext();
      if (e.key === 'ArrowLeft')  flipPrev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [flipNext, flipPrev]);

  /* ── Autoplay — flips exactly 1 page at a time ── */
  const currentPageRef = useRef(currentPage);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);

  useEffect(() => {
    if (autoplay && !loading && pages.length > 0) {
      autoRef.current = setInterval(() => {
        const cp = currentPageRef.current;
        if (cp >= pages.length - 1) { setAutoplay(false); return; }
        flipRef.current?.pageFlip()?.flip(cp + 1);
      }, 3500);
    } else {
      if (autoRef.current) clearInterval(autoRef.current);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoplay, loading, pages.length]);

  /* ── onFlip callback ── */
  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
    playFlipSound();
  }, [playFlipSound]);

  /* ── Zoom helpers ── */
  const zoomOut = () => setZoom(z => {
    const next = Math.max(+(z - 0.2).toFixed(1), 0.4);
    if (next <= 1) setPan({ x: 0, y: 0 });
    return next;
  });
  const zoomIn  = () => setZoom(z => Math.min(+(z + 0.2).toFixed(1), 2.4));
  const zoomPct = Math.round(zoom * 100);

  /* ── Drag-to-pan when zoomed in ── */
  const canPan = zoom > 1;

  const onPanStart = useCallback((e: React.PointerEvent) => {
    if (!canPan) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    setDragging(true);
  }, [canPan, pan.x, pan.y]);

  const onPanMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current) return;
    e.preventDefault();
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, []);

  const onPanEnd = useCallback(() => {
    dragStart.current = null;
    setDragging(false);
  }, []);

  const canPrev = currentPage > 0;
  const canNext = currentPage < pages.length - 1;

  // StPageFlip re-initialises whenever its children change, so these are built
  // once and each page's image is assigned imperatively as it finishes.
  const pageSlots = useMemo(
    () => pages.map((_, i) => (
      <div key={i} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#fff' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <Loader2 size={20} className="animate-spin" style={{ color: '#D1D5DB' }} />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: '#C7C7CC' }}>
            Page {i + 1}
          </span>
        </div>
        <img
          ref={el => { imgRefs.current[i] = el; if (el) paintPage(i); }}
          alt=""
          draggable={false}
          className="absolute inset-0"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0, transition: 'opacity 0.25s' }}
        />
      </div>
    )),
    [pages.length, paintPage],
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col"
      style={{ minHeight: '100vh', background: '#E8EBF0', userSelect: 'none' }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 shrink-0 gap-4"
        style={{ height: '56px', background: '#fff', borderBottom: '1px solid #E4E4E7', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <Link
          href="/publications"
          className="flex items-center gap-2 text-sm font-semibold shrink-0 transition-opacity hover:opacity-60"
          style={{ color: '#8B0000' }}
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <div className="text-center flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: '#0D0D0D' }}>{title}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#A1A1AA' }}>{type} · {year}</p>
        </div>
        <a
          href={pdfUrl}
          download
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-opacity hover:opacity-80"
          style={{ background: '#8B0000', color: '#fff' }}
        >
          <Download size={12} /> Download
        </a>
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <style>{`
            @keyframes sac-fan { 0%,100%{transform:rotate(-4deg) translateX(-6px);opacity:.35} 50%{transform:rotate(4deg) translateX(6px);opacity:.6} }
            @keyframes sac-fan2{ 0%,100%{transform:rotate(3deg) translateX(5px);opacity:.25} 50%{transform:rotate(-3deg) translateX(-5px);opacity:.5} }
            @keyframes sac-shimmer{ 0%{transform:translateX(-180px)} 100%{transform:translateX(360px)} }
          `}</style>

          {error ? (
            <div className="text-center rounded-2xl p-10" style={{ background: '#fff', border: '1px solid #E4E4E7', maxWidth: '340px', width: '100%' }}>
              <BookOpen size={32} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
              <p className="font-bold mb-2" style={{ color: '#0D0D0D' }}>Could not load PDF</p>
              <p className="text-sm mb-5" style={{ color: '#71717A' }}>{error}</p>
              <Link href="/publications" className="text-sm font-semibold underline" style={{ color: '#8B0000' }}>← Back to Publications</Link>
            </div>
          ) : (
            <>
              {/* Animated book visual */}
              <div className="relative mb-9" style={{ width: '72px', height: '88px' }}>
                {/* Fanned pages behind */}
                <div className="absolute inset-0 rounded-lg" style={{ background: 'rgba(139,0,0,0.12)', animation: 'sac-fan 2.6s ease-in-out infinite', transformOrigin: 'bottom center' }} />
                <div className="absolute inset-0 rounded-lg" style={{ background: 'rgba(139,0,0,0.08)', animation: 'sac-fan2 2.1s ease-in-out infinite', transformOrigin: 'bottom center' }} />
                {/* Book cover */}
                <div
                  className="absolute inset-0 rounded-lg flex items-center justify-center"
                  style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)', borderLeft: '3px solid rgba(139,0,0,0.18)' }}>
                  <BookOpen size={28} style={{ color: '#8B0000' }} />
                </div>
              </div>

              {/* Publication info */}
              <p className="font-bold text-center mb-1 text-base" style={{ color: '#191313', letterSpacing: '-0.01em', maxWidth: '26ch' }}>
                {title}
              </p>
              <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-10" style={{ color: 'rgba(25,19,19,0.35)' }}>
                {type} · {year}
              </p>

              {/* Progress bar */}
              <div style={{ width: '280px' }}>
                <div className="relative h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(25,19,19,0.1)' }}>
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #8B0000, #c67374)',
                      width: totalPgs ? `${Math.max(4, (progress / totalPgs) * 100)}%` : '6%',
                      transition: 'width 0.4s ease',
                    }}
                  />
                  {/* shimmer overlay */}
                  <div
                    className="absolute inset-y-0 w-16 rounded-full pointer-events-none"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)', animation: 'sac-shimmer 1.4s linear infinite' }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'rgba(25,19,19,0.4)' }}>
                    {totalPgs ? `${progress} of ${totalPgs} pages ready` : 'Loading…'}
                  </span>
                  {totalPgs > 0 && (
                    <span className="text-xs font-bold tabular-nums" style={{ color: '#8B0000' }}>
                      {Math.round((progress / totalPgs) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[11px] mt-6" style={{ color: 'rgba(25,19,19,0.25)' }}>
                Your ebook will open automatically
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Flipbook ── */}
      {!loading && pages.length > 0 && (
        <div
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{ padding: '20px 16px', touchAction: canPan ? 'none' : 'auto' }}
          onPointerDownCapture={onPanStart}
          onPointerMove={onPanMove}
          onPointerUp={onPanEnd}
          onPointerCancel={onPanEnd}
        >
          <div
            style={{
              // Cover sits in the right half of the spread; shift left to center it
              transform: `translate(${(!bookSize.portrait && currentPage === 0 ? -(bookSize.w / 2) : 0) + pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: dragging ? 'none' : 'transform 0.5s ease',
              filter: 'drop-shadow(0 16px 56px rgba(0,0,0,0.28))',
              cursor: canPan ? (dragging ? 'grabbing' : 'grab') : 'default',
            }}
          >
            <HTMLFlipBook
              ref={flipRef}
              width={bookSize.w}
              height={bookSize.h}
              size="fixed"
              autoSize={false}
              showCover={true}
              flippingTime={650}
              drawShadow={true}
              usePortrait={bookSize.portrait}
              showPageCorners={true}
              disableFlipByClick={false}
              mobileScrollSupport={true}
              useMouseEvents={true}
              swipeDistance={30}
              clickEventForward={false}
              startZIndex={20}
              style={{}}
              className=""
              startPage={0}
              onFlip={onFlip}
            >
              {pageSlots}
            </HTMLFlipBook>
          </div>
        </div>
      )}

      {/* ── Bottom control bar (mygov style) ── */}
      {!loading && pages.length > 0 && (
        <div
          className="flex items-center justify-between px-3 sm:px-5 shrink-0 gap-2"
          style={{ height: '52px', background: '#6B0000', borderTop: '1px solid rgba(0,0,0,0.25)' }}
        >
          {/* Left: Zoom + Sound */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={zoomOut}
              disabled={zoom <= 0.4}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
              title="Zoom out"
            >
              <ZoomOut size={16} style={{ color: '#fff' }} />
            </button>
            <span
              className="text-[10px] font-bold tabular-nums text-center"
              style={{ color: 'rgba(255,255,255,0.5)', minWidth: '34px' }}
            >
              {zoomPct}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 2.4}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
              title="Zoom in"
            >
              <ZoomIn size={16} style={{ color: '#fff' }} />
            </button>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.14)', margin: '0 4px' }} />
            <button
              onClick={() => setSoundOn(s => !s)}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              title={soundOn ? 'Mute sound' : 'Enable sound'}
            >
              {soundOn
                ? <Volume2 size={16} style={{ color: '#fff' }} />
                : <VolumeX size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />}
            </button>
          </div>

          {/* Center: Navigation */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={flipToFirst}
              disabled={!canPrev}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
              title="First page"
            >
              <ChevronsLeft size={16} style={{ color: '#fff' }} />
            </button>
            <button
              onClick={flipPrev}
              disabled={!canPrev}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
              title="Previous page"
            >
              <ChevronLeft size={16} style={{ color: '#fff' }} />
            </button>
            <div
              className="flex items-center justify-center rounded px-2"
              style={{ background: 'rgba(255,255,255,0.12)', height: '28px', minWidth: '72px' }}
            >
              <span className="text-xs font-bold tabular-nums" style={{ color: '#fff' }}>
                {(() => {
                  const total = pages.length;
                  if (bookSize.portrait || currentPage === 0) {
                    return `${currentPage + 1} / ${total}`;
                  }
                  const left  = currentPage + 1;
                  const right = Math.min(currentPage + 2, total);
                  return right > left
                    ? `${left}–${right} / ${total}`
                    : `${left} / ${total}`;
                })()}
              </span>
            </div>
            <button
              onClick={flipNext}
              disabled={!canNext}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
              title="Next page"
            >
              <ChevronRight size={16} style={{ color: '#fff' }} />
            </button>
            <button
              onClick={flipToLast}
              disabled={!canNext}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
              title="Last page"
            >
              <ChevronsRight size={16} style={{ color: '#fff' }} />
            </button>
          </div>

          {/* Right: Autoplay + Fullscreen */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setAutoplay(a => !a)}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              title={autoplay ? 'Stop autoplay' : 'Autoplay'}
            >
              {autoplay
                ? <Pause size={16} style={{ color: '#FBBF24' }} />
                : <Play  size={16} style={{ color: '#fff' }} />}
            </button>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.14)', margin: '0 4px' }} />
            <button
              onClick={toggleFullscreen}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen
                ? <Minimize2 size={16} style={{ color: '#fff' }} />
                : <Maximize2 size={16} style={{ color: '#fff' }} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
      const vw = window.innerWidth;
      const vh = window.innerHeight;
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
        lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        // External URLs are proxied server-side to avoid CORS restrictions
        const effectiveUrl = /^https?:\/\//i.test(pdfUrl)
          ? `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`
          : pdfUrl;
        const pdf = await lib.getDocument({ url: effectiveUrl, cMapPacked: true }).promise;
        if (cancelled) return;
        setTotalPgs(pdf.numPages);
        const out: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const pg = await pdf.getPage(i);
          const vp = pg.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = vp.width; canvas.height = vp.height;
          await pg.render({ canvasContext: canvas.getContext('2d')!, viewport: vp, canvas } as any).promise;
          out.push(canvas.toDataURL('image/jpeg', 0.88));
          setProgress(i);
        }
        if (!cancelled) { setPages(out); setLoading(false); }
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
  const zoomOut = () => setZoom(z => Math.max(+(z - 0.2).toFixed(1), 0.4));
  const zoomIn  = () => setZoom(z => Math.min(+(z + 0.2).toFixed(1), 2.4));
  const zoomPct = Math.round(zoom * 100);

  const canPrev = currentPage > 0;
  const canNext = currentPage < pages.length - 1;

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
        <div className="flex-1 flex items-center justify-center">
          {error ? (
            <div className="text-center rounded-2xl p-8" style={{ background: '#fff', border: '1px solid #E4E4E7' }}>
              <p className="font-bold mb-2" style={{ color: '#0D0D0D' }}>Could not load PDF</p>
              <p className="text-sm mb-4" style={{ color: '#71717A' }}>{error}</p>
              <Link href="/publications" className="text-sm underline" style={{ color: '#8B0000' }}>← Back</Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <BookOpen size={32} style={{ color: '#8B0000' }} />
                <Loader2 size={64} className="animate-spin absolute" style={{ color: '#D1D5DB' }} />
              </div>
              <div>
                <p className="font-bold text-center mb-4" style={{ color: '#0D0D0D' }}>Preparing your ebook…</p>
                <div className="w-64">
                  <div className="flex justify-between text-xs mb-2" style={{ color: '#A1A1AA' }}>
                    <span>Rendering pages</span>
                    <span>{progress} / {totalPgs || '…'}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E4E4E7' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ background: '#8B0000', width: totalPgs ? `${(progress / totalPgs) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Flipbook ── */}
      {!loading && pages.length > 0 && (
        <div
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{ padding: '20px 16px' }}
        >
          <div
            style={{
              // Cover sits in the right half of the spread; shift left to center it
              transform: `translateX(${!bookSize.portrait && currentPage === 0 ? -(bookSize.w / 2) : 0}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.5s ease',
              filter: 'drop-shadow(0 16px 56px rgba(0,0,0,0.28))',
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
              {pages.map((src, i) => (
                <div key={i} style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#fff' }}>
                  <img
                    src={src}
                    alt={`Page ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    draggable={false}
                  />
                </div>
              ))}
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
              style={{ background: 'rgba(255,255,255,0.12)', height: '28px', minWidth: '62px' }}
            >
              <span className="text-xs font-bold tabular-nums" style={{ color: '#fff' }}>
                {currentPage + 1} / {pages.length}
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

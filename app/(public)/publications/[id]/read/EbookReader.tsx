'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Download, ArrowLeft, Loader2, BookOpen, Maximize2, Minimize2 } from 'lucide-react';

// SSR-safe import — StPageFlip uses DOM APIs
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
  const [pages,      setPages]      = useState<string[]>([]);
  const [progress,   setProgress]   = useState(0);
  const [totalPgs,   setTotalPgs]   = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const flipRef      = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Render PDF pages ── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const pdf   = await pdfjsLib.getDocument({ url: pdfUrl, cMapPacked: true }).promise;
        if (cancelled) return;
        const count = pdf.numPages;
        setTotalPgs(count);
        const rendered: string[] = [];
        for (let i = 1; i <= count; i++) {
          if (cancelled) return;
          const page   = await pdf.getPage(i);
          const vp     = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width  = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise;
          rendered.push(canvas.toDataURL('image/jpeg', 0.88));
          setProgress(i);
        }
        if (!cancelled) { setPages(rendered); setLoading(false); }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load PDF');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [pdfUrl]);

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

  /* ── Keyboard ── */
  const flipNext = useCallback(() => flipRef.current?.pageFlip()?.flipNext(), []);
  const flipPrev = useCallback(() => flipRef.current?.pageFlip()?.flipPrev(), []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flipNext();
      if (e.key === 'ArrowLeft')  flipPrev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [flipNext, flipPrev]);

  const canPrev = currentPage > 0;
  const canNext = currentPage < pages.length - 1;

  return (
    <div
      ref={containerRef}
      className="flex flex-col select-none"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #D4A843 0%, #C49230 40%, #D4A843 100%)' }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0 gap-4"
        style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(10px)' }}
      >
        <Link
          href="/publications"
          className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70 shrink-0"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="text-center flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: '#fff' }}>{title}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {type} · {year}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!loading && (
            <span className="hidden sm:block text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {currentPage + 1} / {pages.length}
            </span>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen
              ? <Minimize2 size={15} style={{ color: 'rgba(255,255,255,0.7)' }} />
              : <Maximize2 size={15} style={{ color: 'rgba(255,255,255,0.7)' }} />}
          </button>
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }}
          >
            <Download size={12} /> Download
          </a>
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {error ? (
            <div className="text-center rounded-2xl p-8" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <p className="font-bold mb-2" style={{ color: '#fff' }}>Could not load PDF</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{error}</p>
              <Link href="/publications" className="text-sm underline" style={{ color: 'rgba(255,255,255,0.8)' }}>
                ← Back to Publications
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <BookOpen size={32} style={{ color: '#fff' }} />
                <Loader2 size={64} className="animate-spin absolute" style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
              <div>
                <p className="font-bold text-center mb-4" style={{ color: '#fff' }}>
                  Preparing your ebook…
                </p>
                <div className="w-64">
                  <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <span>Rendering pages</span>
                    <span>{progress} / {totalPgs || '…'}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ background: '#fff', width: totalPgs ? `${(progress / totalPgs) * 100}%` : '0%' }}
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
        <>
          <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 px-2 py-6">
            {/* Prev */}
            <button
              onClick={flipPrev}
              disabled={!canPrev}
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110 disabled:opacity-0"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <ChevronLeft size={22} style={{ color: '#fff' }} />
            </button>

            {/* Book */}
            <div style={{ filter: 'drop-shadow(0 24px 64px rgba(0,0,0,0.5))' }}>
              <HTMLFlipBook
                ref={flipRef}
                width={420}
                height={594}
                size="stretch"
                minWidth={160}
                maxWidth={520}
                minHeight={226}
                maxHeight={740}
                showCover={true}
                flippingTime={700}
                drawShadow={true}
                usePortrait={false}
                showPageCorners={true}
                disableFlipByClick={false}
                mobileScrollSupport={true}
                useMouseEvents={true}
                swipeDistance={30}
                clickEventForward={false}
                startZIndex={20}
                autoSize={true}
                style={{}}
                className=""
                startPage={0}
                onFlip={(e: any) => setCurrentPage(e.data)}
              >
                {pages.map((dataUrl, i) => (
                  <div key={i} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <img
                      src={dataUrl}
                      alt={`Page ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      draggable={false}
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>

            {/* Next */}
            <button
              onClick={flipNext}
              disabled={!canNext}
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110 disabled:opacity-0"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <ChevronRight size={22} style={{ color: '#fff' }} />
            </button>
          </div>

          <p className="text-center pb-5 text-[11px]" style={{ color: 'rgba(0,0,0,0.4)' }}>
            Click page edges · Drag corners · Use ← → keys to flip
          </p>
        </>
      )}
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata = { title: '404 — Page Not Found' };

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#faf6f1' }}>

      <p
        className="font-display font-medium mb-4"
        style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', color: '#8B000012', lineHeight: 1, letterSpacing: '-0.04em' }}>
        404
      </p>

      <p className="kicker mb-4" style={{ color: '#970003' }}>Page not found</p>

      <h1
        className="font-display font-medium leading-tight mb-4"
        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#191313', letterSpacing: '-0.02em', maxWidth: '22ch' }}>
        This page doesn't exist.
      </h1>

      <p className="text-base mb-10" style={{ color: 'rgba(25,19,19,0.5)', maxWidth: '42ch' }}>
        The link may be broken or the page may have moved. Head back home and find what you're looking for.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#970003', color: '#fff' }}>
          <ArrowLeft size={15} />
          Back to Home
        </Link>
        <Link
          href="/clubs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-70"
          style={{ border: '1.5px solid rgba(25,19,19,0.15)', color: '#191313' }}>
          Explore Clubs
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

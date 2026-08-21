'use client';
import { useState, useCallback } from 'react';
import { Play, Download, AlertCircle, CheckCircle2, Clock, Table2, ChevronRight } from 'lucide-react';

const QUICK_QUERIES = [
  { label: 'SHOW TABLES',         sql: 'SHOW TABLES;'                             },
  { label: 'All clubs',           sql: 'SELECT * FROM `clubs` LIMIT 50;'          },
  { label: 'All domains',         sql: 'SELECT * FROM `domains` ORDER BY `sort_order`;' },
  { label: 'All admins',          sql: 'SELECT `id`,`username`,`name` FROM `sac_admins`;' },
  { label: 'Recent activities',   sql: 'SELECT * FROM `activities` ORDER BY `activity_date` DESC LIMIT 20;' },
  { label: 'Site settings',       sql: 'SELECT * FROM `site_settings`;'            },
];

export default function SQLExecutorClient() {
  const [query, setQuery]     = useState('SHOW TABLES;');
  const [results, setResults] = useState<any>(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (sql?: string) => {
    const q = (sql ?? query).trim();
    if (!q) return;

    if (/^(DROP|TRUNCATE)\s+/i.test(q)) {
      if (!window.confirm('⚠️ Destructive operation detected. This cannot be undone. Continue?')) return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res  = await fetch('/api/admin/db-query', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const exportCSV = () => {
    if (!results?.data?.length) return;
    const cols = Object.keys(results.data[0]);
    const rows = results.data.map((r: any) =>
      cols.map(c => JSON.stringify(r[c] ?? '')).join(',')
    );
    const csv  = [cols.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'query-result.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const columns = results?.data?.length ? Object.keys(results.data[0]) : [];
  const isSelect = results?.data && Array.isArray(results.data);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1" style={{ color: '#A1A1AA' }}>
          Developer Tool
        </p>
        <h1 className="text-2xl font-bold" style={{ color: '#18181B' }}>SQL Executor</h1>
        <p className="text-sm mt-1" style={{ color: '#71717A' }}>
          Run raw SQL queries against the live database. Restricted to dev access only.
        </p>
      </div>

      {/* Quick queries */}
      <div className="flex flex-wrap gap-2">
        {QUICK_QUERIES.map(q => (
          <button key={q.label}
            onClick={() => { setQuery(q.sql); run(q.sql); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:border-red-200 hover:bg-red-50"
            style={{ background: '#fff', borderColor: '#E8E8EC', color: '#52525B' }}>
            <ChevronRight size={11} style={{ color: '#8B0000' }} />
            {q.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#E8E8EC', background: '#18181B' }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: '#2D2D2D' }}>
          <span className="text-xs font-mono font-semibold" style={{ color: '#71717A' }}>SQL Query</span>
          <button
            onClick={() => run()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: '#8B0000', color: '#fff' }}>
            <Play size={13} fill="currentColor" />
            {loading ? 'Running…' : 'Run'}
          </button>
        </div>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') run(); }}
          className="w-full px-4 py-4 font-mono text-sm resize-none outline-none"
          style={{ background: '#18181B', color: '#E5E5E5', minHeight: '140px', caretColor: '#8B0000' }}
          spellCheck={false}
          placeholder="SELECT * FROM clubs LIMIT 10;"
        />
        <div className="px-4 py-2 border-t text-[11px]" style={{ borderColor: '#2D2D2D', color: '#555' }}>
          Ctrl+Enter / ⌘+Enter to run · DROP / TRUNCATE require confirmation
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <AlertCircle size={16} style={{ color: '#DC2626', flexShrink: 0, marginTop: 2 }} />
          <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: '#B91C1C' }}>{error}</pre>
        </div>
      )}

      {/* Results */}
      {results && !error && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#E8E8EC', background: '#fff' }}>
          {/* Meta bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#F4F4F6', background: '#FAFAFA' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} style={{ color: '#16A34A' }} />
                <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>Success</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} style={{ color: '#71717A' }} />
                <span className="text-xs" style={{ color: '#71717A' }}>{results.metadata?.executionTime}</span>
              </div>
              {isSelect && (
                <div className="flex items-center gap-1.5">
                  <Table2 size={12} style={{ color: '#71717A' }} />
                  <span className="text-xs" style={{ color: '#71717A' }}>{results.metadata?.rowCount} row{results.metadata?.rowCount !== 1 ? 's' : ''}</span>
                </div>
              )}
              {results.metadata?.affectedRows !== null && !isSelect && (
                <span className="text-xs" style={{ color: '#71717A' }}>{results.metadata.affectedRows} rows affected</span>
              )}
            </div>
            {isSelect && results.data.length > 0 && (
              <button onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all hover:bg-gray-50"
                style={{ borderColor: '#E8E8EC', color: '#52525B' }}>
                <Download size={12} /> Export CSV
              </button>
            )}
          </div>

          {/* Table */}
          {isSelect && results.data.length > 0 ? (
            <div className="overflow-x-auto" style={{ maxHeight: '480px' }}>
              <table className="min-w-full text-sm">
                <thead style={{ position: 'sticky', top: 0, background: '#F9FAFB', zIndex: 1 }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold border-b" style={{ borderColor: '#E8E8EC', color: '#71717A', minWidth: 40 }}>#</th>
                    {columns.map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-bold border-b whitespace-nowrap"
                        style={{ borderColor: '#E8E8EC', color: '#3F3F46' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F4F4F6' }}
                      className="hover:bg-red-50 transition-colors">
                      <td className="px-4 py-2.5 text-xs tabular-nums" style={{ color: '#A1A1AA' }}>{i + 1}</td>
                      {columns.map(col => (
                        <td key={col} className="px-4 py-2.5 text-sm font-mono whitespace-nowrap max-w-xs truncate" style={{ color: '#18181B' }}>
                          {row[col] === null
                            ? <span style={{ color: '#D4D4D8', fontStyle: 'italic' }}>NULL</span>
                            : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : isSelect && results.data.length === 0 ? (
            <div className="py-12 text-center" style={{ color: '#A1A1AA' }}>
              <Table2 size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Query returned 0 rows.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

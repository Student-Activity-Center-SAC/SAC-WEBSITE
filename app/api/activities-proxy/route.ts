import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export const dynamic = 'force-dynamic';

const AGENT = new https.Agent({ rejectUnauthorized: false });
const UPSTREAM = 'https://sacactivities.kluniversity.in/api/public/activities';

function proxyFetch(type: string): Promise<any> {
  return new Promise(resolve => {
    let settled = false;
    const done = (v: any) => { if (!settled) { settled = true; resolve(v); } };

    const req = https.request(`${UPSTREAM}/${type}`, { agent: AGENT, timeout: 10000 }, res => {
      let raw = '';
      res.on('data', c => (raw += c));
      res.on('end', () => {
        try { done(JSON.parse(raw)); }
        catch { done({ error: 'parse_error' }); }
      });
    });
    req.on('error', e => done({ error: e.message }));
    req.on('timeout', () => { req.destroy(); done({ error: 'timeout' }); });
    req.end();
  });
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') ?? 'completed';
  if (!['upcoming', 'completed'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
  const data = await proxyFetch(type);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=600' },
  });
}

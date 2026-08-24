import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export const dynamic = 'force-dynamic';

const AGENT = new https.Agent({ rejectUnauthorized: false });
const UPSTREAM = 'https://sacactivities.kluniversity.in/api/public/activities';

function proxyFetch(type: string): Promise<any> {
  return new Promise(resolve => {
    const req = https.request(`${UPSTREAM}/${type}`, { agent: AGENT }, res => {
      let raw = '';
      res.on('data', c => (raw += c));
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { resolve({ error: 'parse_error' }); }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
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

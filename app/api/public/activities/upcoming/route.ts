import { NextResponse } from 'next/server';
import https from 'https';

export async function GET(): Promise<Response> {
  return new Promise<Response>((resolve) => {
    https.get('https://sacactivities.kluniversity.in/api/public/activities/upcoming', { rejectUnauthorized: false }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          const data = Buffer.concat(chunks).toString('utf8');
          resolve(NextResponse.json(JSON.parse(data), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
            }
          }));
        } catch (err: any) {
          console.error("UPCOMING API PARSE ERROR:", err, Buffer.concat(chunks).toString('utf8').substring(0, 200));
          resolve(NextResponse.json({ error: 'Failed to parse JSON', details: err.message }, { status: 500 }));
        }
      });
    }).on('error', (err) => {
      console.error("UPCOMING API NETWORK ERROR:", err);
      resolve(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}

import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  return new Promise((resolve) => {
    https.get('https://sacactivities.kluniversity.in/api/public/activities/upcoming', { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(NextResponse.json(JSON.parse(data)));
        } catch (err: any) {
          resolve(NextResponse.json({ error: 'Failed to parse JSON' }, { status: 500 }));
        }
      });
    }).on('error', (err) => {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}

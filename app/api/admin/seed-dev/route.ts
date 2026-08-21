import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// One-time endpoint to seed the dev user. Safe to call multiple times (upsert).
export async function POST() {
  try {
    await pool.query(
      `INSERT INTO \`sac_admins\` (\`username\`, \`name\`, \`password_hash\`)
       VALUES (?, ?, NULL)
       ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`)`,
      ['2400030188', 'Dev User']
    );
    return NextResponse.json({ success: true, message: 'Dev user seeded. First login sets the password.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

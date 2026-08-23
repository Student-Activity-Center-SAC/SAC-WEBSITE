import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// The SQL console is a break-glass tool. It is disabled unless explicitly
// enabled, and then only for the username named in ADMIN_SQL_USER.
// Set ADMIN_SQL_CONSOLE=true and ADMIN_SQL_USER=<username> to turn it on.
const CONSOLE_ENABLED = process.env.ADMIN_SQL_CONSOLE === 'true';
const SQL_USER        = process.env.ADMIN_SQL_USER ?? '';

export async function POST(req: NextRequest) {
  if (!CONSOLE_ENABLED)
    return NextResponse.json({ error: 'SQL console is disabled' }, { status: 404 });

  const session = await getAdminSession();
  if (!session || !SQL_USER || session.username !== SQL_USER)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { query } = await req.json();
    if (typeof query !== 'string' || !query.trim())
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });

    const sql = query.trim();

    // Reject multi-statement payloads — mysql2's execute() does not allow them
    // by default, but rejecting early gives a clearer error.
    if (sql.split(';').filter(s => s.trim()).length > 1)
      return NextResponse.json(
        { error: 'Only a single statement is allowed per request' },
        { status: 400 },
      );

    const start = Date.now();
    const connection = await pool.getConnection();
    try {
      const [rows, fields] = (await connection.execute(sql)) as [any[], any[]];
      const ms = Date.now() - start;

      console.warn(`[db-query] "${session.username}" ran: ${sql.slice(0, 200)}`);

      return NextResponse.json({
        success: true,
        data: Array.isArray(rows) ? rows : [],
        metadata: {
          rowCount:      Array.isArray(rows) ? rows.length : 0,
          executionTime: `${ms}ms`,
          affectedRows:  (rows as any)?.affectedRows ?? null,
          fields: fields ? fields.map((f: any) => ({ name: f.name, type: f.type })) : [],
        },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.sqlMessage || error.message || 'Query failed' },
      { status: 400 },
    );
  }
}

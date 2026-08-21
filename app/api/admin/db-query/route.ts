import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

const DEV_USER = '2400030188';

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session || session.username !== DEV_USER)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { query } = await req.json();
    if (!query?.trim())
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });

    const start = Date.now();
    const connection = await pool.getConnection();
    try {
      const [rows, fields] = await connection.execute(query.trim()) as [any[], any[]];
      const ms = Date.now() - start;
      return NextResponse.json({
        success: true,
        data: Array.isArray(rows) ? rows : [],
        metadata: {
          rowCount: Array.isArray(rows) ? rows.length : 0,
          executionTime: `${ms}ms`,
          affectedRows: (rows as any)?.affectedRows ?? null,
          fields: fields ? fields.map((f: any) => ({ name: f.name, type: f.type })) : [],
        },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.sqlMessage || error.message || 'Query failed' },
      { status: 400 }
    );
  }
}

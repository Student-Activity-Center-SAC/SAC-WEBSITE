import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';
import pool from '@/lib/db';

function toSlug(name: string) {
  return name?.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') ?? '';
}

async function findClubBySlug(slug: string): Promise<any | null> {
  const { data: all } = await db.from('clubs').select('*').order('id', { ascending: true });
  return (all ?? []).find((c: any) => toSlug(c.club_name) === slug) ?? null;
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const domain = req.nextUrl.searchParams.get('domain');
  let query = db.from('clubs').select('*').order('id', { ascending: true });
  if (domain && domain !== 'all') query = query.eq('club_domain', domain);

  const { data: dbClubs } = await query;
  const clubs = (dbClubs ?? []).map((c: any, index: number) => ({
    id:          c.id,
    slug:        toSlug(c.club_name),
    name:        c.club_name,
    domain_code: c.club_domain,
    domain_slug: c.club_domain?.toLowerCase() ?? '',
    tagline:     c.club_description,
    logo_url:    c.club_logo,
    sort_order:  index + 1,
  }));

  return NextResponse.json({ success: true, data: clubs });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const clubName  = body.name || body.club_name;
  const clubDomain = body.domain_code || body.club_domain;
  const clubDesc  = body.tagline || body.club_description || null;
  const clubLogo  = body.logo_url || body.club_logo || null;
  const aboutRaw  = body.about || body.club_about;
  const clubAbout = Array.isArray(aboutRaw) ? aboutRaw.join('\n') : (aboutRaw || null);

  if (!clubName) return NextResponse.json({ error: 'Club name is required' }, { status: 400 });

  try {
    const [result]: any = await pool.query(
      `INSERT INTO \`clubs\` (club_name, club_domain, club_description, club_logo, club_about, active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [clubName, clubDomain, clubDesc, clubLogo, clubAbout]
    );
    revalidatePath('/clubs');
    revalidatePath('/');
    return NextResponse.json({ success: true, data: { id: result.insertId } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const { id, slug, ...rest } = body;

  let clubId = id;
  if (!clubId && slug) {
    const found = await findClubBySlug(slug);
    clubId = found?.id;
  }
  if (!clubId) return NextResponse.json({ error: 'Club not found' }, { status: 404 });

  const setClauses: string[] = [];
  const values: any[] = [];

  const map: Record<string, string> = {
    name:             'club_name',
    club_name:        'club_name',
    domain_code:      'club_domain',
    club_domain:      'club_domain',
    tagline:          'club_description',
    club_description: 'club_description',
    logo_url:         'club_logo',
    club_logo:        'club_logo',
  };

  for (const [formKey, dbCol] of Object.entries(map)) {
    if (formKey in rest && !setClauses.some(s => s.startsWith(`\`${dbCol}\``))) {
      setClauses.push(`\`${dbCol}\` = ?`);
      values.push(rest[formKey]);
    }
  }

  if ('about' in rest || 'club_about' in rest) {
    const aboutRaw = rest.about ?? rest.club_about;
    setClauses.push('`club_about` = ?');
    values.push(Array.isArray(aboutRaw) ? aboutRaw.join('\n') : aboutRaw);
  }

  if (!setClauses.length) return NextResponse.json({ success: true });

  try {
    await pool.query(
      `UPDATE \`clubs\` SET ${setClauses.join(', ')} WHERE id = ?`,
      [...values, clubId]
    );
    revalidatePath('/clubs');
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { slug, id } = await req.json();

  let clubId = id;
  if (!clubId && slug) {
    const found = await findClubBySlug(slug);
    clubId = found?.id;
  }
  if (!clubId) return NextResponse.json({ error: 'Club not found' }, { status: 404 });

  try {
    await pool.query('DELETE FROM `clubs` WHERE id = ?', [clubId]);
    revalidatePath('/clubs');
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

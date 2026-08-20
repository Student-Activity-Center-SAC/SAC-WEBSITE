import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { folder = 'misc', ext = 'pdf' } = await req.json();
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { data, error: signedErr } = await supabase.storage
    .from('sac-media')
    .createSignedUploadUrl(path);

  if (signedErr) return NextResponse.json({ error: signedErr.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from('sac-media').getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    publicUrl: urlData.publicUrl,
  });
}

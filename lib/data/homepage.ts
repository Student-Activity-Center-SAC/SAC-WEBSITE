import { supabase } from '@/lib/supabase-admin';

export async function getHomepageEvents(limit = 5) {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('activities')
    .select('code, title, domain, venue, activity_date, time_slot, difficulty, club_slug')
    .gte('activity_date', today)
    .order('activity_date', { ascending: true })
    .limit(limit);
  return data ?? [];
}

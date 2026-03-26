// Backend persistence layer — syncs OS data to Supabase
import { supabase } from '@/integrations/supabase/client';

const DEBOUNCE_MS = 2000;
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export async function loadOsData(key: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('os_data')
      .select('data')
      .eq('id', key)
      .maybeSingle();
    if (error) { console.warn('loadOsData error:', error); return null; }
    return data?.data ?? null;
  } catch (e) {
    console.warn('loadOsData failed:', e);
    return null;
  }
}

export function saveOsData(key: string, value: any) {
  // Save to localStorage immediately for responsiveness
  localStorage.setItem(`akibos-${key}`, JSON.stringify(value));

  // Debounce backend save
  if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
  debounceTimers[key] = setTimeout(async () => {
    try {
      const { error } = await supabase
        .from('os_data')
        .upsert({ id: key, data: value }, { onConflict: 'id' });
      if (error) console.warn('saveOsData error:', error);
    } catch (e) {
      console.warn('saveOsData failed:', e);
    }
  }, DEBOUNCE_MS);
}

// Load from backend, falling back to localStorage
export async function loadOrFallback(key: string, fallback: any): Promise<any> {
  const remote = await loadOsData(key);
  if (remote !== null) {
    // Also update localStorage cache
    localStorage.setItem(`akibos-${key}`, JSON.stringify(remote));
    return remote;
  }
  // Try localStorage
  const local = localStorage.getItem(`akibos-${key}`);
  if (local) {
    try { return JSON.parse(local); } catch {}
  }
  return fallback;
}

// Backend persistence layer — syncs OS data to Supabase
import { supabase } from '@/integrations/supabase/client';
import { accountKey, accountDataKey } from '@/lib/session-context';

const DEBOUNCE_MS = 2000;
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export async function loadOsData(key: string): Promise<any | null> {
  const scopedKey = accountDataKey(key);
  try {
    const { data, error } = await supabase
      .from('os_data')
      .select('data')
      .eq('id', scopedKey)
      .maybeSingle();
    if (error) { console.warn('loadOsData error:', error); return null; }
    return data?.data ?? null;
  } catch (e) {
    console.warn('loadOsData failed:', e);
    return null;
  }
}

export function saveOsData(key: string, value: any) {
  const scopedKey = accountDataKey(key);
  const localKey = accountKey(key);
  // Save to localStorage immediately for responsiveness
  localStorage.setItem(localKey, JSON.stringify(value));

  // Debounce backend save
  if (debounceTimers[scopedKey]) clearTimeout(debounceTimers[scopedKey]);
  debounceTimers[scopedKey] = setTimeout(async () => {
    try {
      const { error } = await supabase
        .from('os_data')
        .upsert({ id: scopedKey, data: value }, { onConflict: 'id' });
      if (error) console.warn('saveOsData error:', error);
    } catch (e) {
      console.warn('saveOsData failed:', e);
    }
  }, DEBOUNCE_MS);
}

// Load from backend, falling back to localStorage
export async function loadOrFallback(key: string, fallback: any): Promise<any> {
  const localKey = accountKey(key);
  const remote = await loadOsData(key);
  if (remote !== null) {
    localStorage.setItem(localKey, JSON.stringify(remote));
    return remote;
  }
  // Try localStorage
  const local = localStorage.getItem(localKey);
  if (local) {
    try { return JSON.parse(local); } catch {}
  }
  return fallback;
}

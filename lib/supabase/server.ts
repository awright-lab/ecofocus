import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase env vars missing: SUPABASE_URL and SUPABASE_ANON_KEY are required for portal auth.');
}

export function getServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // read-only in server components; middleware/route handlers handle writes
      },
      remove() {
        // read-only in server components
      },
    },
  });
}

export function getServiceSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getSession() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

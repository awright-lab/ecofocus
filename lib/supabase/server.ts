import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase env vars missing: SUPABASE_URL and SUPABASE_ANON_KEY are required for portal auth.',
  );
}

export async function getServerSupabase() {
  // Use Next's cookie store so Supabase can persist the PKCE verifier/session
  // cookies required for magic-link auth. Some runtimes expose cookies() as
  // async (edge), so we await for type-safety.
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // In read-only contexts (e.g., Server Components) setting cookies is not allowed.
        }
      },
      remove(name: string) {
        try {
          cookieStore.delete(name);
        } catch {
          // Ignore if cookies are read-only in the current context.
        }
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
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

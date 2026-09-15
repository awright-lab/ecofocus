'use client';
import { useEffect, useRef, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { ResetPasswordForm } from './ResetPasswordForm';
export function ResetPasswordHandler({ code, tokenHash, type }: { code?: string; tokenHash?: string; type?: string }) {
  const attempt = useRef<Promise<void> | null>(null);
  const [status, setStatus] = useState<'verifying' | 'ready' | 'error'>('verifying');
  useEffect(() => {
    let cancelled = false;
    if (!attempt.current) attempt.current = (async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');
      const clean = new URL(window.location.href);
      clean.hash = '';
      for (const key of ['code', 'token_hash', 'type']) clean.searchParams.delete(key);
      window.history.replaceState(null, '', clean.pathname + clean.search);
      const supabase = getBrowserSupabase();
      let error;
      if (code) ({ error } = await supabase.auth.exchangeCodeForSession(code));
      else if (tokenHash && (!type || type === 'recovery')) ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' }));
      else if (hash.get('type') === 'recovery' && accessToken && refreshToken) ({ error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }));
      else throw new Error('Missing recovery credentials');
      if (error) throw new Error('Recovery failed');
    })();
    attempt.current.then(() => { if (!cancelled) setStatus('ready'); }, () => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [code, tokenHash, type]);
  if (status === 'verifying') return <p role="status">Verifying your reset link…</p>;
  if (status === 'error') return <p role="alert">This reset link is invalid or expired. <a href="/forgot-password">Request a new reset link</a>.</p>;
  return <ResetPasswordForm recoveryReady />;
}

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  code?: string;
  redirect: string;
};

export default function LoginHandler({ code, redirect }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!code) return;

    const confirmUrl = new URL("/auth/confirm", window.location.origin);
    confirmUrl.searchParams.set("code", code);
    confirmUrl.searchParams.set("next", redirect || "/portal");
    router.replace(confirmUrl.toString());
  }, [code, redirect, router]);

  if (!code) return null;
  return (
    <div className="mx-auto max-w-xl px-4 pt-4 text-sm text-gray-700">
      Signing you in…
    </div>
  );
}

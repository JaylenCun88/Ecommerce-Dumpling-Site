"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
    setMessage(error ? error.message : "Check your email for a sign-in link.");
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <label className="text-sm">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-[#b9c9b5] bg-white px-4 py-3"
          placeholder="you@example.com"
        />
      </label>
      <button disabled={busy} className="bg-[#243529] px-5 py-3.5 text-sm text-white disabled:opacity-60">
        {busy ? "Sending…" : "Email me a sign-in link"}
      </button>
      {message && <p className="text-sm text-[#586457]">{message}</p>}
    </form>
  );
}

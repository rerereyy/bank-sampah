"use client";

import { useActionState } from "react";
import { Recycle, LogIn } from "lucide-react";
import { registerNasabah } from "@/lib/actions";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerNasabah, null);

  return (
    <main className="flex-1 flex items-center justify-center bg-cover px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-paper-soft">
          <Recycle size={28} className="text-gold-soft mb-3" />
          <h1 className="font-display text-2xl italic text-gold-soft">
            Daftar Nasabah
          </h1>
          <p className="text-xs text-paper-soft/60 mt-1 font-mono">
            Bank Sampah Digital
          </p>
        </div>

        <form
          action={formAction}
          className="bg-paper-soft rounded-xl p-8 space-y-5 border border-gold/20"
        >
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink-soft">
              Username
            </label>
            <input
              name="username"
              required
              className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink-soft">
              Kata Sandi
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink-soft">
              Nama Lengkap
            </label>
            <input
              name="nama"
              required
              className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink-soft">
              No. HP (Opsional)
            </label>
            <input
              name="no_hp"
              type="tel"
              className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-stamp bg-stamp/10 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          {state?.success && (
            <p className="text-sm text-leaf-deep bg-leaf/10 rounded-lg px-3 py-2">
              {state.success}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-leaf-deep text-paper-soft rounded-lg py-2.5 font-medium hover:bg-leaf transition-colors disabled:opacity-60"
          >
            {pending ? "Memproses…" : "Daftar"}
          </button>
        </form>

        <Link
          href="/login/nasabah"
          className="flex items-center justify-center gap-2 text-paper-soft/70 text-sm mt-6 hover:text-gold-soft"
        >
          <LogIn size={16} />
          Sudah punya akun? Login di sini
        </Link>
      </div>
    </main>
  );
}

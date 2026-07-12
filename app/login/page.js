"use client";

import { useActionState } from "react";
import { Recycle, Users } from "lucide-react";
import { login } from "@/lib/actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="flex-1 flex items-center justify-center bg-cover px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-paper-soft">
          <Recycle size={28} className="text-gold-soft mb-3" />
          <h1 className="font-display text-2xl italic text-gold-soft">
            Reyxx Trash Bank
          </h1>
          <p className="text-xs text-paper-soft/60 mt-1 font-mono">
            Halaman Petugas
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
              className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-stamp bg-stamp/10 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-leaf-deep text-paper-soft rounded-lg py-2.5 font-medium hover:bg-leaf transition-colors disabled:opacity-60"
          >
            {pending ? "Memeriksa…" : "Masuk"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <Link
            href="/login/nasabah"
            className="flex items-center justify-center gap-2 text-paper-soft/70 text-sm hover:text-gold-soft"
          >
            <Users size={16} />
            Login sebagai Nasabah
          </Link>
          <Link
            href="/"
            className="block text-center text-paper-soft/50 text-sm hover:text-gold-soft"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

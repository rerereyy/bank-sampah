"use client";

import { useActionState } from "react";
import { Wallet, ArrowLeft } from "lucide-react";
import { requestPenarikan } from "@/lib/actions";
import Link from "next/link";

export default function PenarikanSayaPage() {
  const [state, formAction, pending] = useActionState(requestPenarikan, null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/nasabah"
          className="p-2 hover:bg-paper-soft rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-ink-soft" />
        </Link>
        <div>
          <h1 className="font-display text-2xl italic text-leaf-deep">
            Tarik Saldo
          </h1>
          <p className="text-sm text-ink-soft mt-1">Ajukan penarikan saldo Anda</p>
        </div>
      </div>

      <div className="bg-paper-soft rounded-xl p-6 border border-gold/20 max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-leaf/10 rounded-lg">
            <Wallet size={20} className="text-leaf-deep" />
          </div>
          <span className="text-sm font-mono uppercase text-ink-soft">Form Penarikan</span>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink-soft">
              Jumlah (Rp)
            </label>
            <input
              name="jumlah"
              type="number"
              min="1"
              required
              className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="Masukkan jumlah penarikan"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink-soft">
              Keterangan (Opsional)
            </label>
            <textarea
              name="keterangan"
              rows={3}
              className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="Alasan penarikan..."
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
            {pending ? "Mengirim…" : "Ajukan Penarikan"}
          </button>
        </form>

        <p className="text-xs text-ink-soft mt-4 text-center">
          Penarikan akan diproses setelah mendapat konfirmasi dari admin.
        </p>
      </div>
    </div>
  );
}

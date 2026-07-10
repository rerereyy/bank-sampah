"use client";

import { useActionState, useRef, useEffect } from "react";
import { tambahWarga } from "@/lib/actions";
import { UserPlus } from "lucide-react";

export default function NasabahForm() {
  const [state, formAction, pending] = useActionState(tambahWarga, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-paper-soft border border-rule rounded-xl p-6 space-y-4"
    >
      <h2 className="font-display text-lg flex items-center gap-2">
        <UserPlus size={18} className="text-leaf-deep" /> Nasabah Baru
      </h2>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Nama</label>
        <input
          name="nama"
          required
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono uppercase text-ink-soft">RT</label>
          <input
            name="rt"
            placeholder="01"
            className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </div>
        <div>
          <label className="text-xs font-mono uppercase text-ink-soft">No. HP</label>
          <input
            name="no_hp"
            className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Alamat</label>
        <input
          name="alamat"
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-stamp bg-stamp/10 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-leaf-deep bg-leaf/10 rounded-lg px-3 py-2">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-leaf-deep text-paper-soft rounded-lg py-2.5 font-medium hover:bg-leaf transition-colors disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Tambah Nasabah"}
      </button>
    </form>
  );
}

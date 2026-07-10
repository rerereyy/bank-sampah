"use client";

import { useActionState, useRef, useEffect } from "react";
import { tambahJenisSampah } from "@/lib/actions";
import { PackagePlus } from "lucide-react";

export default function JenisSampahForm() {
  const [state, formAction, pending] = useActionState(tambahJenisSampah, null);
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
        <PackagePlus size={18} className="text-leaf-deep" /> Jenis Sampah Baru
      </h2>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Nama Jenis</label>
        <input
          name="nama"
          required
          placeholder="Plastik Botol (PET)"
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-mono uppercase text-ink-soft">Satuan</label>
          <input
            name="satuan"
            defaultValue="kg"
            className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </div>
        <div>
          <label className="text-xs font-mono uppercase text-ink-soft">Harga/kg</label>
          <input
            name="harga_per_kg"
            type="number"
            required
            min="0"
            className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </div>
        <div>
          <label className="text-xs font-mono uppercase text-ink-soft">Poin/kg</label>
          <input
            name="poin_per_kg"
            type="number"
            defaultValue={1}
            min="0"
            className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
          />
        </div>
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
        {pending ? "Menyimpan…" : "Tambah Jenis Sampah"}
      </button>
    </form>
  );
}

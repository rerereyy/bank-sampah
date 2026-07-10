"use client";

import { useActionState, useRef, useEffect, useMemo, useState } from "react";
import { tambahPenarikan } from "@/lib/actions";
import { Wallet } from "lucide-react";

export default function PenarikanForm({ wargaList }) {
  const [state, formAction, pending] = useActionState(tambahPenarikan, null);
  const formRef = useRef(null);
  const [wargaId, setWargaId] = useState(wargaList[0]?.id?.toString() || "");

  const wargaTerpilih = useMemo(
    () => wargaList.find((w) => w.id.toString() === wargaId),
    [wargaId, wargaList]
  );

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
        <Wallet size={18} className="text-leaf-deep" /> Tarik Saldo
      </h2>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Nasabah</label>
        <select
          name="warga_id"
          required
          value={wargaId}
          onChange={(e) => setWargaId(e.target.value)}
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        >
          {wargaList.map((w) => (
            <option key={w.id} value={w.id}>
              {w.nama}
            </option>
          ))}
        </select>
        {wargaTerpilih && (
          <p className="text-xs text-ink-soft font-mono mt-1">
            Saldo saat ini: Rp {Number(wargaTerpilih.saldo).toLocaleString("id-ID")}
          </p>
        )}
      </div>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Jumlah (Rp)</label>
        <input
          name="jumlah"
          type="number"
          min="1000"
          step="500"
          required
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        />
      </div>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Keterangan</label>
        <input
          name="keterangan"
          placeholder="opsional"
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
        {pending ? "Memproses…" : "Tarik Saldo"}
      </button>
    </form>
  );
}

"use client";

import { useActionState, useEffect, useRef, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { tambahSetoran } from "@/lib/actions";
import { Recycle } from "lucide-react";

export default function SetoranForm({ wargaList, jenisList }) {
  const [state, formAction, pending] = useActionState(tambahSetoran, null);
  const formRef = useRef(null);
  const router = useRouter();
  const [jenisId, setJenisId] = useState(jenisList[0]?.id?.toString() || "");
  const [berat, setBerat] = useState("");

  const jenisTerpilih = useMemo(
    () => jenisList.find((j) => j.id.toString() === jenisId),
    [jenisId, jenisList]
  );

  const estimasi = useMemo(() => {
    if (!jenisTerpilih || !berat) return null;
    const b = Number(berat);
    return {
      rupiah: Math.round(b * Number(jenisTerpilih.harga_per_kg)),
      poin: Math.round(b * Number(jenisTerpilih.poin_per_kg)),
    };
  }, [jenisTerpilih, berat]);

  useEffect(() => {
    if (state?.success && state?.setoranId) {
      formRef.current?.reset();
      router.push(`/dashboard/setoran/${state.setoranId}`);
    }
  }, [state, router]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-paper-soft border border-rule rounded-xl p-6 space-y-4"
    >
      <h2 className="font-display text-lg flex items-center gap-2">
        <Recycle size={18} className="text-leaf-deep" /> Catat Setoran
      </h2>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Nasabah</label>
        <select
          name="warga_id"
          required
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        >
          {wargaList.map((w) => (
            <option key={w.id} value={w.id}>
              {w.nama} {w.rt ? `(RT ${w.rt})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Jenis Sampah</label>
        <select
          name="jenis_sampah_id"
          required
          value={jenisId}
          onChange={(e) => setJenisId(e.target.value)}
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        >
          {jenisList.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nama} — Rp {Number(j.harga_per_kg).toLocaleString("id-ID")}/{j.satuan}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-mono uppercase text-ink-soft">Berat (kg)</label>
        <input
          name="berat_kg"
          type="number"
          step="0.1"
          min="0.1"
          required
          value={berat}
          onChange={(e) => setBerat(e.target.value)}
          className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
        />
      </div>

      {estimasi && (
        <div className="text-sm font-mono bg-leaf/10 text-leaf-deep rounded-lg px-3 py-2 flex justify-between">
          <span>Estimasi: Rp {estimasi.rupiah.toLocaleString("id-ID")}</span>
          <span>{estimasi.poin} poin</span>
        </div>
      )}

      {state?.error && (
        <p className="text-sm text-stamp bg-stamp/10 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-leaf-deep text-paper-soft rounded-lg py-2.5 font-medium hover:bg-leaf transition-colors disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Simpan Setoran"}
      </button>
    </form>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getSetoranById } from "@/lib/queries";
import { ArrowLeft, Recycle } from "lucide-react";
import PrintButton from "@/components/PrintButton";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function BuktiSetoranPage({ params }) {
  const { id } = await params;
  const s = await getSetoranById(Number(id));
  if (!s) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 no-print">
        <Link
          href="/dashboard/setoran"
          className="flex items-center gap-2 text-sm text-ink-soft hover:text-leaf-deep"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <PrintButton />
      </div>

      <div className="max-w-md mx-auto bg-paper-soft border border-rule rounded-xl overflow-hidden ruled">
        <div className="bg-cover text-paper-soft px-6 py-5 flex items-center gap-2">
          <Recycle size={18} className="text-gold-soft" />
          <div>
            <div className="font-display italic text-gold-soft text-sm">Bank Sampah Digital</div>
            <div className="text-[10px] text-paper-soft/60 font-mono">Bukti Setoran Sah</div>
          </div>
        </div>

        <div className="px-6 pt-6 pb-2 font-mono text-xs text-ink-soft">
          <div className="flex justify-between">
            <span>No. Bukti</span>
            <span>#{String(s.id).padStart(6, "0")}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Tanggal</span>
            <span>{new Date(s.tanggal).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-1 border-y border-dashed border-rule my-3">
          <div className="text-xs text-ink-soft font-mono uppercase">Nasabah</div>
          <div className="font-display text-xl">{s.warga_nama}</div>
          <div className="text-xs text-ink-soft font-mono">RT {s.rt || "-"}</div>
        </div>

        <div className="px-6 py-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Jenis Sampah</span>
            <span className="font-medium">{s.jenis_nama}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Berat</span>
            <span className="font-mono">{Number(s.berat_kg).toFixed(1)} {s.satuan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Harga per {s.satuan}</span>
            <span className="font-mono">{rupiah(s.harga_per_kg)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Poin per {s.satuan}</span>
            <span className="font-mono">{s.poin_per_kg}</span>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-rule bg-leaf/5 flex justify-between items-end">
          <div>
            <div className="text-xs text-ink-soft font-mono uppercase">Total Poin</div>
            <div className="font-display text-lg text-leaf-deep">{s.total_poin} poin</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-ink-soft font-mono uppercase">Total Saldo</div>
            <div className="font-display text-2xl">{rupiah(s.total_rupiah)}</div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between">
          <span className="stamp inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide">
            Tercatat
          </span>
          <span className="text-xs text-ink-soft font-mono">Petugas: {s.petugas || "-"}</span>
        </div>
      </div>
    </div>
  );
}


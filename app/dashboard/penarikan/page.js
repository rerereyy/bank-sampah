import { getWargaList, getPenarikanList } from "@/lib/queries";
import { konfirmasiPenarikan } from "@/lib/actions";
import PenarikanForm from "@/components/PenarikanForm";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const statusBadge = (status) => {
  const styles = {
    pending: "bg-gold/20 text-gold-deep",
    approved: "bg-leaf/20 text-leaf-deep",
    rejected: "bg-stamp/20 text-stamp",
  };
  const labels = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-mono ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default async function PenarikanPage() {
  const [wargaListRaw, riwayatRaw] = await Promise.all([
    getWargaList(),
    getPenarikanList(50),
  ]);

  // Serialize data to plain objects (Turso rows may contain non-serializable values)
  const wargaList = wargaListRaw.map((w) => ({
    id: Number(w.id),
    nama: String(w.nama),
    rt: w.rt ? String(w.rt) : null,
    alamat: w.alamat ? String(w.alamat) : null,
    no_hp: w.no_hp ? String(w.no_hp) : null,
    saldo: Number(w.saldo),
    total_poin: Number(w.total_poin),
    total_berat: Number(w.total_berat),
    created_at: String(w.created_at),
  }));

  const riwayat = riwayatRaw.map((p) => ({
    id: Number(p.id),
    warga_id: Number(p.warga_id),
    jumlah: Number(p.jumlah),
    keterangan: p.keterangan ? String(p.keterangan) : null,
    status: String(p.status),
    tanggal: String(p.tanggal),
    approved_at: p.approved_at ? String(p.approved_at) : null,
    petugas: p.petugas ? String(p.petugas) : null,
    warga_nama: String(p.warga_nama),
  }));

  const pending = riwayat.filter((p) => p.status === "pending");
  const processed = riwayat.filter((p) => p.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
          Transaksi
        </span>
        <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8">
          Pencairan saldo nasabah.
        </h1>
      </div>

      {/* Pending Requests */}
      <div className="bg-paper-soft border border-gold/30 rounded-xl w-full min-w-0 overflow-hidden">
        <div className="px-4 py-3 bg-gold/10 border-b border-gold/20">
          <h2 className="font-mono text-sm uppercase text-gold-deep">
            Menunggu Konfirmasi ({pending.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left font-mono text-xs uppercase text-ink-soft">
                <th className="px-4 py-3">Nasabah</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                    Tidak ada penarikan yang menunggu konfirmasi.
                  </td>
                </tr>
              )}
              {pending.map((p) => (
                <tr key={p.id} className="border-t border-rule">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.warga_nama}</div>
                    <div className="text-xs text-ink-soft font-mono">
                      {new Date(p.tanggal).toLocaleDateString("id-ID")}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-stamp">{rupiah(p.jumlah)}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.keterangan || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={konfirmasiPenarikan}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-leaf-deep text-paper-soft rounded-lg text-xs font-medium hover:bg-leaf transition-colors"
                        >
                          Setuju
                        </button>
                      </form>
                      <form action={konfirmasiPenarikan}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-stamp text-paper-soft rounded-lg text-xs font-medium hover:opacity-80 transition-colors"
                        >
                          Tolak
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Withdrawal Form */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          {wargaList.length === 0 ? (
            <div className="bg-paper-soft border border-rule rounded-xl p-6 text-sm text-ink-soft">
              Belum ada nasabah terdaftar.
            </div>
          ) : (
            <PenarikanForm wargaList={wargaList} />
          )}
        </div>

        {/* History */}
        <div className="lg:col-span-3 bg-paper-soft border border-rule rounded-xl w-full min-w-0 overflow-hidden">
          <div className="px-4 py-3 bg-cover text-paper-soft">
            <h2 className="font-mono text-xs uppercase">Riwayat Penarikan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[450px]">
              <thead>
                <tr className="text-left font-mono text-xs uppercase text-ink-soft">
                  <th className="px-4 py-3">Nasabah</th>
                  <th className="px-4 py-3">Jumlah</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ket.</th>
                </tr>
              </thead>
              <tbody>
                {processed.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                      Belum ada riwayat penarikan.
                    </td>
                  </tr>
                )}
                {processed.map((p) => (
                  <tr key={p.id} className="border-t border-rule">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.warga_nama}</div>
                      <div className="text-xs text-ink-soft font-mono">
                        {new Date(p.tanggal).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-stamp">-{rupiah(p.jumlah)}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3 text-ink-soft">{p.keterangan || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

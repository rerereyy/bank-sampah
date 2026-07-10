import { getWargaList, getPenarikanList } from "@/lib/queries";
import PenarikanForm from "@/components/PenarikanForm";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function PenarikanPage() {
  const [wargaList, riwayat] = await Promise.all([
    getWargaList(),
    getPenarikanList(30),
  ]);

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
        Transaksi
      </span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8">
        Pencairan saldo nasabah.
      </h1>

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

        <div className="lg:col-span-3 bg-paper-soft border border-rule rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cover text-paper-soft text-left font-mono text-xs uppercase">
                <th className="px-4 py-3">Nasabah</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                    Belum ada penarikan.
                  </td>
                </tr>
              )}
              {riwayat.map((p) => (
                <tr key={p.id} className="border-t border-rule">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.warga_nama}</div>
                    <div className="text-xs text-ink-soft font-mono">
                      {new Date(p.tanggal).toLocaleDateString("id-ID")}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-stamp">-{rupiah(p.jumlah)}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.keterangan || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getWargaList, getJenisSampahList, getSetoranList } from "@/lib/queries";
import SetoranForm from "@/components/SetoranForm";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function SetoranPage() {
  const [wargaList, jenisList, riwayat] = await Promise.all([
    getWargaList(),
    getJenisSampahList(),
    getSetoranList(30),
  ]);

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
        Transaksi
      </span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8">
        Setor sampah hari ini.
      </h1>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          {wargaList.length === 0 || jenisList.length === 0 ? (
            <div className="bg-paper-soft border border-rule rounded-xl p-6 text-sm text-ink-soft">
              Tambahkan nasabah dan jenis sampah terlebih dahulu sebelum mencatat setoran.
            </div>
          ) : (
            <SetoranForm wargaList={wargaList} jenisList={jenisList} />
          )}
        </div>

        <div className="lg:col-span-3 bg-paper-soft border border-rule rounded-xl w-full min-w-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[450px]">
              <thead>
                <tr className="bg-cover text-paper-soft text-left font-mono text-xs uppercase">
                  <th className="px-4 py-3">Nasabah</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Berat</th>
                  <th className="px-4 py-3">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {riwayat.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                      Belum ada setoran.
                    </td>
                  </tr>
                )}
                {riwayat.map((s) => (
                  <tr key={s.id} className="border-t border-rule hover:bg-paper cursor-pointer">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/setoran/${s.id}`} className="font-medium hover:underline">
                        {s.warga_nama}
                      </Link>
                      <div className="text-xs text-ink-soft font-mono">
                        {new Date(s.tanggal).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-4 py-3">{s.jenis_nama}</td>
                    <td className="px-4 py-3 font-mono">{Number(s.berat_kg).toFixed(1)} kg</td>
                    <td className="px-4 py-3 font-mono text-leaf-deep">{rupiah(s.total_rupiah)}</td>
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

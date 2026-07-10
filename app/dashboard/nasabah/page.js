import { getWargaList } from "@/lib/queries";
import { hapusWarga } from "@/lib/actions";
import NasabahForm from "@/components/NasabahForm";
import DeleteButton from "@/components/DeleteButton";
import EditWargaButton from "@/components/EditWargaButton";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function NasabahPage() {
  const warga = await getWargaList();

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
        Data Nasabah
      </span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8">
        Daftar warga penabung.
      </h1>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <NasabahForm />
        </div>

        <div className="lg:col-span-3 bg-paper-soft border border-rule rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cover text-paper-soft text-left font-mono text-xs uppercase">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">RT</th>
                <th className="px-4 py-3">Saldo</th>
                <th className="px-4 py-3">Poin</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {warga.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                    Belum ada nasabah.
                  </td>
                </tr>
              )}
              {warga.map((w) => (
                <tr key={w.id} className="border-t border-rule">
                  <td className="px-4 py-3">
                    <div className="font-medium">{w.nama}</div>
                    <div className="text-xs text-ink-soft">{w.no_hp}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{w.rt || "-"}</td>
                  <td className="px-4 py-3 font-mono">{rupiah(w.saldo)}</td>
                  <td className="px-4 py-3 font-mono">{w.total_poin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <EditWargaButton warga={w} />
                      <DeleteButton
                        action={hapusWarga.bind(null, w.id)}
                        confirmText={`Hapus nasabah "${w.nama}" beserta riwayat transaksinya?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

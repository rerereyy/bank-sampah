import { getJenisSampahList } from "@/lib/queries";
import { hapusJenisSampah } from "@/lib/actions";
import JenisSampahForm from "@/components/JenisSampahForm";
import DeleteButton from "@/components/DeleteButton";
import EditJenisSampahButton from "@/components/EditJenisSampahButton";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function JenisSampahPage() {
  const jenis = await getJenisSampahList();

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
        Master Data
      </span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8">
        Jenis sampah & harga.
      </h1>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <JenisSampahForm />
        </div>

        <div className="lg:col-span-3 bg-paper-soft border border-rule rounded-xl w-full min-w-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="bg-cover text-paper-soft text-left font-mono text-xs uppercase">
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Poin</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jenis.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                      Belum ada jenis sampah.
                    </td>
                  </tr>
                )}
                {jenis.map((j) => (
                  <tr key={j.id} className="border-t border-rule">
                    <td className="px-4 py-3 font-medium">{j.nama}</td>
                    <td className="px-4 py-3 font-mono">{rupiah(j.harga_per_kg)}/{j.satuan}</td>
                    <td className="px-4 py-3 font-mono">{j.poin_per_kg}/{j.satuan}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <EditJenisSampahButton jenis={j} />
                        <DeleteButton
                          action={hapusJenisSampah.bind(null, j.id)}
                          confirmText={`Hapus jenis sampah "${j.nama}"?`}
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
    </div>
  );
}

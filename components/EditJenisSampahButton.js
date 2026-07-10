"use client";

import { useActionState, useState } from "react";
import { editJenisSampah } from "@/lib/actions";
import { Pencil, X } from "lucide-react";

export default function EditJenisSampahButton({ jenis }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState, formData) => {
    const result = await editJenisSampah(prevState, formData);
    if (result?.success) setOpen(false);
    return result;
  }, null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-ink-soft hover:text-leaf-deep transition-colors p-1.5"
        aria-label="Edit"
      >
        <Pencil size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="bg-paper-soft border border-rule rounded-xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Edit Jenis Sampah</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ink-soft hover:text-stamp"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="id" value={jenis.id} />

              <div>
                <label className="text-xs font-mono uppercase text-ink-soft">Nama Jenis</label>
                <input
                  name="nama"
                  required
                  defaultValue={jenis.nama}
                  className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-ink-soft">Satuan</label>
                  <input
                    name="satuan"
                    defaultValue={jenis.satuan}
                    className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-ink-soft">Harga/kg</label>
                  <input
                    name="harga_per_kg"
                    type="number"
                    min="0"
                    required
                    defaultValue={jenis.harga_per_kg}
                    className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-ink-soft">Poin/kg</label>
                  <input
                    name="poin_per_kg"
                    type="number"
                    min="0"
                    defaultValue={jenis.poin_per_kg}
                    className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
              </div>

              {state?.error && (
                <p className="text-sm text-stamp bg-stamp/10 rounded-lg px-3 py-2">{state.error}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-rule rounded-lg py-2.5 font-medium hover:bg-paper transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 bg-leaf-deep text-paper-soft rounded-lg py-2.5 font-medium hover:bg-leaf transition-colors disabled:opacity-60"
                >
                  {pending ? "Menyimpan…" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

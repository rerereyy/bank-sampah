"use client";

import { useActionState, useState } from "react";
import { editWarga } from "@/lib/actions";
import { Pencil, X } from "lucide-react";

export default function EditWargaButton({ warga }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState, formData) => {
    const result = await editWarga(prevState, formData);
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
              <h2 className="font-display text-lg">Edit Nasabah</h2>
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
              <input type="hidden" name="id" value={warga.id} />

              <div>
                <label className="text-xs font-mono uppercase text-ink-soft">Nama</label>
                <input
                  name="nama"
                  required
                  defaultValue={warga.nama}
                  className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-ink-soft">RT</label>
                  <input
                    name="rt"
                    defaultValue={warga.rt || ""}
                    className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-ink-soft">No. HP</label>
                  <input
                    name="no_hp"
                    defaultValue={warga.no_hp || ""}
                    className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-ink-soft">Alamat</label>
                <input
                  name="alamat"
                  defaultValue={warga.alamat || ""}
                  className="mt-1 w-full border border-rule rounded-lg px-3 py-2 bg-paper focus:outline-none focus:ring-2 focus:ring-leaf"
                />
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

"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton({ action, confirmText }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText || "Yakin ingin menghapus data ini?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-ink-soft hover:text-stamp transition-colors p-1.5"
        aria-label="Hapus"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
